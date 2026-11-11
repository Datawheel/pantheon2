#!/usr/bin/env python3
"""
Machine-translate person.famous_for into the site's other 12 languages, for
the people shown in the top 10 of an occupation x country page
(/profile/occupation/[id]/country/[countryId]). Results go to
core.person_famous_for, which those pages read for non-English locales.

Only people with an English famous_for are translated (~7,900 of the ~26,400
people in some top 10; ~1.6M characters per language). Rows remember an md5
of the English text they came from, so re-running only translates people
whose text is new or changed.

Some English blurbs describe a namesake instead of the person (Brazilian
footballer Zico "is most famous for being the leader of Block B, a Korean
hip-hop group"). Before translating, Gemini checks each blurb once against
the person's Wikidata description and birth year. Blurbs that fail are not
translated into any language and are listed in --mismatch-report so the
English can be fixed. --audit runs only that check.

Usage (from the repo root):
  set -a; source .env.local; set +a
  pip install google-genai psycopg2-binary requests
  python scripts/translate-famous-for.py --create-table
  python scripts/translate-famous-for.py --dry-run --source api --langs de,ja \\
      --country Brazil --occupation "SOCCER PLAYER"
  python scripts/translate-famous-for.py --limit 2000      # most famous first
  python scripts/translate-famous-for.py                   # everything left
  python scripts/translate-famous-for.py --audit --source api   # bad blurbs among top-10 people
  python scripts/translate-famous-for.py --audit --source api --top 0 \\
      --mismatch-report famous_for_audit.csv                     # every person with a blurb

The check also flags factual errors, and it can be wrong about events after
the model's training data (it insists Donald Trump wasn't the 47th
president): review the report and pass reviewed false positives with
--force-ids.

Env: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, and GEMINI_API_KEY
(default provider) or GOOGLE_TRANSLATE_API_KEY (--provider google, which
can't run the check: pass --no-check).
"""

import argparse
import csv
import datetime
import hashlib
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import psycopg2
import requests
from psycopg2 import errors as pg_errors
from psycopg2.extras import execute_values

LANGS = ["es", "fr", "de", "it", "pt", "nl", "ru", "pl", "hu", "ar", "ja", "zh"]

LANGUAGE_NAMES = {
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Brazilian Portuguese",
    "nl": "Dutch",
    "ru": "Russian",
    "pl": "Polish",
    "hu": "Hungarian",
    "ar": "Modern Standard Arabic",
    "ja": "Japanese",
    "zh": "Simplified Chinese",
}

# Google Translate codes where they differ from the site's locale codes.
GOOGLE_CODES = {"zh": "zh-CN"}

DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2"
PUBLIC_API = "https://api.pantheon.world"

DDL = """
CREATE TABLE IF NOT EXISTS core.person_famous_for (
    person_id bigint NOT NULL REFERENCES core.person (id) ON DELETE CASCADE,
    lang varchar(5) NOT NULL,
    famous_for text NOT NULL,
    source_hash char(32) NOT NULL,
    model text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (person_id, lang)
);
GRANT SELECT ON core.person_famous_for TO pantheonread;
NOTIFY pgrst, 'reload schema';
"""

# Candidate rows:
#   (id, famous_for, md5, slug, name, description, birthyear, occupation, wd_id, wp_id)
# --top 0 means everyone with a famous_for, ranked or not.
CANDIDATES_SQL = """
SELECT p.id, p.famous_for, md5(p.famous_for), p.slug, p.name, p.description, p.birthyear, p.occupation,
       p.wd_id, p.wp_id
FROM core.person p
LEFT JOIN core.person_ranks pr ON pr.id = p.id
WHERE (%(top)s = 0 OR pr.bplace_country_occupation_rank_unique <= %(top)s)
  AND p.famous_for IS NOT NULL
  AND btrim(p.famous_for) <> ''
  AND (%(country)s::text IS NULL OR p.bplace_country = %(country)s)
  AND (%(occupation)s::text IS NULL OR p.occupation = %(occupation)s)
ORDER BY pr.hpi DESC NULLS LAST, p.id
"""

PERSON_FIELDS = "id,famous_for,slug,name,description,birthyear,occupation,wd_id,wp_id"
REPORT_COLUMNS = ["person_id", "slug", "name", "description", "birthyear", "occupation",
                  "wd_id", "wikipedia_url", "reason", "famous_for"]

UPSERT_SQL = """
INSERT INTO core.person_famous_for (person_id, lang, famous_for, source_hash, model)
VALUES %s
ON CONFLICT (person_id, lang) DO UPDATE
SET famous_for = EXCLUDED.famous_for,
    source_hash = EXCLUDED.source_hash,
    model = EXCLUDED.model,
    updated_at = now()
"""

TRANSLATE_PROMPT = """Translate these short English blurbs into {language}. They come from Pantheon (pantheon.world), a dataset of famous people, and each one explains why a person is famous.

Rules:
- Write fluent, natural {language} that a native-speaking editor would publish. Keep every fact and the meaning; do not add, drop or soften information.
- Write names of people, places, works, teams, titles and events the way {language} Wikipedia writes them. Keep a name in its original form when there is no established {language} form.
- Plain text, one paragraph per blurb: no markdown, no surrounding quotes, no notes.

Answer with a JSON array containing one object per input blurb, in any order: {{"id": <the same id>, "text": <the translation>}}.

Blurbs:
{items}"""

CHECK_PROMPT = """Each item is a short English blurb from Pantheon (pantheon.world), a dataset of famous people, plus "person": that person's Wikidata description, birth year and occupation.

Some blurbs were written about a different person with the same name (a footballer's blurb describing a rapper, say), and some get facts about the person wrong. For each item set "ok" to false only for errors a careful encyclopedia editor would correct: the blurb is about someone else, or it gets a date, title, relationship, record or achievement clearly wrong. Give a short English "reason". Otherwise set "ok" to true and leave "reason" empty.

Do not flag simplifications or common phrasings ("Edison invented the light bulb"). Today is {today}: events after your training data may be real, so treat claims about recent events you can't verify as fine, not wrong. When unsure, answer true.

Answer with a JSON array: {{"id": <the same id>, "ok": <true|false>, "reason": <string>}}.

Items:
{items}"""


def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        dbname=os.getenv("DB_NAME", "pantheon"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
    )


def chunked(items, size):
    for index in range(0, len(items), size):
        yield items[index:index + size]


def person_context(row):
    name, description, birthyear, occupation = row[4:8]
    parts = [name]
    if description:
        parts.append(description)
    if birthyear is not None:
        parts.append(f"born {int(birthyear)}")
    if occupation:
        parts.append(f"occupation: {occupation.lower()}")
    return "; ".join(parts)


def plausible(source, translation, lang):
    """Reject empty output and obvious truncation or runaway text."""
    if not translation or not translation.strip():
        return False
    ratio = len(translation) / max(1, len(source))
    low = 0.15 if lang in ("ja", "zh") else 0.4
    return low <= ratio <= 3.5


# --------------------------------------------------------------- candidates

def fetch_candidates_db(conn, top, country, occupation):
    with conn.cursor() as cur:
        cur.execute(CANDIDATES_SQL, {"top": top, "country": country, "occupation": occupation})
        return cur.fetchall()


def candidate_row(row):
    text = row["famous_for"]
    return (row["id"], text, hashlib.md5(text.encode("utf-8")).hexdigest(), row["slug"], row["name"],
            row["description"], row["birthyear"], row["occupation"], row.get("wd_id"), row.get("wp_id"))


def fetch_candidates_api(base_api, top, country=None, occupation=None, limit=0):
    """Same rows as CANDIDATES_SQL from the public PostgREST API, for
    --dry-run/--audit without DB access. md5 matches Postgres md5(text)."""
    session = requests.Session()

    def get(url):
        for attempt in range(4):
            res = session.get(url, timeout=120)
            if res.status_code < 500:
                res.raise_for_status()
                return res.json()
            time.sleep(2 ** attempt * 3)
        res.raise_for_status()

    def person_filters(country_col, occupation_col):
        out = ""
        if country:
            out += f"&{country_col}=eq.{requests.utils.quote(country)}"
        if occupation:
            out += f"&{occupation_col}=eq.{requests.utils.quote(occupation)}"
        return out

    page_size = 5000
    if top == 0:
        # Everyone with a blurb, straight from person (id order).
        rows = []
        for offset in range(0, 10_000_000, page_size):
            page = get(f"{base_api}/person?famous_for=not.is.null{person_filters('bplace_country', 'occupation')}"
                       f"&select={PERSON_FIELDS}&order=id.asc&limit={page_size}&offset={offset}")
            rows.extend(candidate_row(row) for row in page if row["famous_for"].strip())
            if len(page) < page_size or (limit and len(rows) >= limit):
                break
        return rows

    filters = f"bplace_country_occupation_rank_unique=lte.{top}" + person_filters("bplace_country", "occupation")
    ranked = []
    for offset in range(0, 10_000_000, page_size):
        page = get(f"{base_api}/person_ranks?{filters}&select=id&order=hpi.desc.nullslast,id.asc"
                   f"&limit={page_size}&offset={offset}")
        ranked.extend(row["id"] for row in page)
        if len(page) < page_size:
            break

    rows = []
    for ids in chunked(ranked, 100):
        people = {
            row["id"]: row
            for row in get(f"{base_api}/person?id=in.({','.join(map(str, ids))})&famous_for=not.is.null"
                           f"&select={PERSON_FIELDS}")
        }
        rows.extend(candidate_row(people[pid]) for pid in ids if pid in people and people[pid]["famous_for"].strip())
        if limit and len(rows) >= limit:
            break
    return rows


# ---------------------------------------------------------------- providers

class GeminiTranslator:
    can_check = True

    def __init__(self, api_key, model):
        from google import genai
        from google.genai import types

        self.client = genai.Client(api_key=api_key)
        self.types = types
        self.model = model
        self.name = model

    def _call(self, prompt, properties, retries=3):
        types = self.types
        config = types.GenerateContentConfig(
            temperature=0.2,
            response_mime_type="application/json",
            response_schema={
                "type": "ARRAY",
                "items": {"type": "OBJECT", "properties": properties, "required": list(properties)},
            },
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        )
        for attempt in range(retries):
            try:
                response = self.client.models.generate_content(model=self.model, contents=prompt, config=config)
                return json.loads(response.text)
            except Exception as e:  # noqa: BLE001 - retry any API/parse failure
                wait = 2 ** attempt * 5
                print(f"    Gemini error ({e}); retrying in {wait}s", file=sys.stderr)
                time.sleep(wait)
        return []

    def translate(self, rows, lang):
        """candidate rows -> {id: translation}"""
        items = json.dumps([{"id": row[0], "text": row[1]} for row in rows], ensure_ascii=False, indent=1)
        data = self._call(
            TRANSLATE_PROMPT.format(language=LANGUAGE_NAMES[lang], items=items),
            {"id": {"type": "INTEGER"}, "text": {"type": "STRING"}},
        )
        return {int(item["id"]): (item.get("text") or "").strip() for item in data if "id" in item}

    def check(self, rows):
        """candidate rows -> {id: reason} for blurbs that fail the check"""
        items = json.dumps(
            [{"id": row[0], "person": person_context(row), "text": row[1]} for row in rows],
            ensure_ascii=False, indent=1,
        )
        data = self._call(
            CHECK_PROMPT.format(items=items, today=datetime.date.today().isoformat()),
            {"id": {"type": "INTEGER"}, "ok": {"type": "BOOLEAN"}, "reason": {"type": "STRING"}},
        )
        return {int(item["id"]): item.get("reason") or "" for item in data if "id" in item and item.get("ok") is False}


class GoogleTranslator:
    can_check = False

    def __init__(self, api_key):
        self.api_key = api_key
        self.name = "google-translate-v2"
        self.session = requests.Session()

    def translate(self, rows, lang, retries=3):
        """candidate rows -> {id: translation}"""
        target = GOOGLE_CODES.get(lang, lang)
        for attempt in range(retries):
            try:
                res = self.session.post(
                    GOOGLE_TRANSLATE_URL,
                    params={"key": self.api_key},
                    data={"q": [row[1] for row in rows], "source": "en", "target": target, "format": "text"},
                    timeout=60,
                )
                res.raise_for_status()
                out = res.json()["data"]["translations"]
                return {row[0]: item["translatedText"].strip() for row, item in zip(rows, out)}
            except Exception as e:  # noqa: BLE001
                wait = 2 ** attempt * 5
                print(f"    [{lang}] Google Translate error ({e}); retrying in {wait}s", file=sys.stderr)
                time.sleep(wait)
        return {}


# -------------------------------------------------------------------- steps

class MismatchReport:
    """CSV of blurbs that failed the check, written as results arrive so an
    interrupted run keeps what it found."""

    def __init__(self, path):
        self.path = path
        self.file = open(path, "w", newline="", encoding="utf-8")
        self.writer = csv.writer(self.file)
        self.writer.writerow(REPORT_COLUMNS)
        self.count = 0

    def add(self, row, reason):
        pid, text, _, slug, name, description, birthyear, occupation, wd_id, wp_id = row
        wikipedia_url = f"https://en.wikipedia.org/?curid={wp_id}" if wp_id else ""
        self.writer.writerow([pid, slug, name, description, birthyear, occupation, wd_id, wikipedia_url, reason, text])
        self.file.flush()
        self.count += 1

    def close(self):
        self.file.close()
        print(f"{self.count:,} flagged blurbs -> {self.path}")


def run_check(translator, rows, batch_size, workers, report=None):
    """{id: (row, reason)} for blurbs that fail the check."""
    flagged = {}
    checked = 0
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(translator.check, batch): batch for batch in chunked(rows, batch_size)}
        for future in as_completed(futures):
            batch = futures[future]
            result = future.result()
            for row in batch:
                if row[0] in result:
                    flagged[row[0]] = (row, result[row[0]])
                    if report:
                        report.add(row, result[row[0]])
            checked += len(batch)
            print(f"  checked {checked:,}/{len(rows):,}, {len(flagged):,} flagged", end="\r", flush=True)
    print(f"  checked {len(rows):,}, {len(flagged):,} flagged" + " " * 20)
    return flagged


def existing_hashes(conn, lang):
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT person_id, source_hash FROM core.person_famous_for WHERE lang = %s", (lang,))
            return dict(cur.fetchall())
    except pg_errors.UndefinedTable:
        raise SystemExit("core.person_famous_for doesn't exist yet: run with --create-table first")


def translate_language(translator, conn, lang, todo, args, out):
    done = failed = 0
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(translator.translate, batch, lang): batch for batch in chunked(todo, args.batch_size)}
        for future in as_completed(futures):
            batch = futures[future]
            result = future.result()
            rows = []
            for row in batch:
                pid, text, digest = row[0], row[1], row[2]
                translation = result.get(pid)
                if not plausible(text, translation, lang):
                    failed += 1
                    continue
                rows.append((pid, lang, translation, digest, translator.name))
                if out:
                    out.write(json.dumps({"person_id": pid, "lang": lang, "source": text, "text": translation},
                                         ensure_ascii=False) + "\n")
            if args.dry_run:
                for pid, _, translation, _, _ in rows:
                    print(f"  {pid} [{lang}] {translation}")
            elif rows:
                with conn.cursor() as cur:
                    execute_values(cur, UPSERT_SQL, rows)
            done += len(rows)
            print(f"  [{lang}] {done:,}/{len(todo):,} translated, {failed:,} failed", end="\r")
    print(f"  [{lang}] {done:,} translated, {failed:,} failed" + " " * 20)
    return done, failed


# --------------------------------------------------------------------- main

def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--create-table", action="store_true", help="create core.person_famous_for and exit")
    parser.add_argument("--langs", default=",".join(LANGS), help="comma-separated locales (default: all 12)")
    parser.add_argument("--top", type=int, default=10,
                        help="people ranked <= this within their occupation x country (default 10; 0 = everyone "
                             "with a famous_for)")
    parser.add_argument("--limit", type=int, default=0, help="only the N most famous candidates (0 = all)")
    parser.add_argument("--country", help='only this birth country id, e.g. "Brazil"')
    parser.add_argument("--occupation", help='only this occupation id, e.g. "SOCCER PLAYER"')
    parser.add_argument("--batch-size", type=int, default=20, help="blurbs per translation request")
    parser.add_argument("--workers", type=int, default=4, help="concurrent API requests")
    parser.add_argument("--provider", choices=["gemini", "google"], default="gemini")
    parser.add_argument("--model", default=DEFAULT_GEMINI_MODEL, help="Gemini model")
    parser.add_argument("--dry-run", action="store_true", help="translate and print, don't write to the DB")
    parser.add_argument("--out", help="also append translations to this JSONL file")
    parser.add_argument("--audit", action="store_true", help="only run the check and write --mismatch-report")
    parser.add_argument("--no-check", action="store_true", help="translate without checking blurbs first")
    parser.add_argument("--force-ids", default="",
                        help="comma-separated person ids to translate even if the check flags them (reviewed false positives)")
    parser.add_argument("--mismatch-report", default="famous_for_mismatches.csv",
                        help="CSV of blurbs that failed the check")
    parser.add_argument("--source", choices=["db", "api"], default="db",
                        help="read candidates from the DB or the public API ('api' only with --dry-run/--audit)")
    args = parser.parse_args()

    if args.source == "api" and not (args.dry_run or args.audit):
        raise SystemExit("--source api is read-only: use it with --dry-run or --audit")

    conn = None
    if args.source == "db" or args.create_table:
        conn = get_db_connection()
        conn.autocommit = True

    if args.create_table:
        with conn.cursor() as cur:
            cur.execute(DDL)
        print("core.person_famous_for is ready (PostgREST schema reload requested).")
        return

    langs = [lang.strip() for lang in args.langs.split(",") if lang.strip()]
    unknown = [lang for lang in langs if lang not in LANGUAGE_NAMES]
    if unknown:
        raise SystemExit(f"Unknown locale(s): {', '.join(unknown)}")

    if args.provider == "gemini":
        key = os.getenv("GEMINI_API_KEY") or sys.exit("GEMINI_API_KEY is not set")
        translator = GeminiTranslator(key, args.model)
    else:
        key = os.getenv("GOOGLE_TRANSLATE_API_KEY") or sys.exit("GOOGLE_TRANSLATE_API_KEY is not set")
        translator = GoogleTranslator(key)
    if (args.audit or not args.no_check) and not translator.can_check:
        raise SystemExit("The check needs --provider gemini; pass --no-check to translate without it")

    if args.source == "api":
        candidates = fetch_candidates_api(os.getenv("NEXT_PUBLIC_BASE_API") or PUBLIC_API,
                                          args.top, args.country, args.occupation, args.limit)
    else:
        candidates = fetch_candidates_db(conn, args.top, args.country, args.occupation)
    if args.limit:
        candidates = candidates[:args.limit]
    print(f"{len(candidates):,} candidates ({sum(len(c[1]) for c in candidates):,} characters per language)")

    if args.audit:
        report = MismatchReport(args.mismatch_report)
        try:
            run_check(translator, candidates, args.batch_size * 2, args.workers, report)
        finally:
            report.close()
        return

    # What each language still needs (new or changed English text).
    todo_by_lang = {}
    for lang in langs:
        existing = {} if args.dry_run else existing_hashes(conn, lang)
        todo_by_lang[lang] = [row for row in candidates if existing.get(row[0]) != row[2]]

    # Check each blurb once, so every language skips the same ones.
    forced = {int(pid) for pid in args.force_ids.split(",") if pid.strip()}
    flagged = {}
    if not args.no_check:
        pending = {row[0]: row for rows in todo_by_lang.values() for row in rows if row[0] not in forced}
        if pending:
            print(f"Checking {len(pending):,} blurbs against their person…")
            report = MismatchReport(args.mismatch_report)
            try:
                flagged = run_check(translator, list(pending.values()), args.batch_size * 2, args.workers, report)
            finally:
                report.close()

    out = open(args.out, "a", encoding="utf-8") if args.out else None
    done = failed = 0
    for lang in langs:
        todo = [row for row in todo_by_lang[lang] if row[0] not in flagged]
        print(f"[{lang}] {len(todo):,} to translate ({len(candidates) - len(todo):,} up to date or flagged)")
        if todo:
            d, f = translate_language(translator, conn, lang, todo, args, out)
            done += d
            failed += f
    if out:
        out.close()
    if conn:
        conn.close()
    verb = "printed" if args.dry_run else "written"
    print(f"Done: {done:,} translations {verb}, {failed:,} failed (re-run to retry), {len(flagged):,} flagged.")


if __name__ == "__main__":
    main()
