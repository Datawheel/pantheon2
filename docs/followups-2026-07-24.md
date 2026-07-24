# Follow-up tickets (from 2026-07-24 incident investigation)

---

## Ticket 1 — Bug: occupation/country/domain slugs sent into `person.id` bigint queries

### Symptom
Postgres logs recurring `ERROR: invalid input syntax for type bigint: "<X>"` where `<X>`
is an occupation (`POLITICIAN`, `SOCCER PLAYER`, `CONDUCTOR`, `PORNOGRAPHIC ACTOR`, `COMPANION`),
a country (`United States`), or a domain (`Sports`, `Sports d'équipe`). ~6–20/day, ongoing
(seen through 2026-07-24). Each throws a 500 on a PostgREST request and the affected UI
section fails to localize (falls back to English or errors depending on caller).

### Root cause (confirmed)
`components/utils/exploreHelpers.js` → `localizeRankingPersonNames()` (line ~342) builds a
person-id set from **both** `row.id` and `row.top_ranked[].id`, then queries
`GET /person?id=in.(<ids>)&select=id,localized_name:translations->>${locale}` (line ~353).

But the ranking rows come from `components/utils/dataFormatter.js`, which for **grouped**
views sets the row id to the *dimension key*, not a person id:
- `showDepth==="occupations"` → `id: leaves[0].occupation.id` (occupation PK is an UPPERCASE
  slug string, e.g. `"SOCCER PLAYER"`)
- `showDepth==="industries"` → `id: leaves[0].occupation.industry`
- `showDepth==="domains"` → `id: leaves[0].occupation.domain` (e.g. `"Sports"`; localized in
  non-en locales → `"Sports d'équipe"`)
- country groupings → country name (`"United States"`)

Only `top_ranked[].id` are real (numeric) person ids. The dimension key gets passed into the
bigint `id=in.(...)` filter → error. It only fires for **non-default locales** (localization
is skipped for `en`) on ranking/explore pages that are grouped by a dimension.

The same unsafe shape exists defensively in `app/utils/personLocalization.js`
(`getPersonId` → `id=in.(...)` at line 47), though its current callers happen to pass numeric
ids; worth hardening the same way.

### Fix (proposed)
Guard the id set to numeric person ids (person.id is `bigint`). Minimal, behavior-preserving:

```js
// exploreHelpers.js, in localizeRankingPersonNames
const isPersonId = v => /^\d+$/.test(String(v));
const ids = new Set();
data.forEach(row => {
  if (isPersonId(row?.id)) ids.add(row.id);          // flat "people" rankings only
  row?.top_ranked?.forEach(p => { if (isPersonId(p?.id)) ids.add(p.id); });
});
```

- Flat people rankings (`showDepth==="people"`): `row.id` is numeric → still localized. ✓
- Grouped rankings: `row.id` is a slug/name → skipped; `top_ranked` people still localized. ✓
- Downstream `names.get(\`${row.id}\`) || row.name` already falls back correctly for group rows.

Apply the same `isPersonId` guard in `personLocalization.getPersonId` for defense in depth.

### Scope / risk
Client/SSR-side only, no schema change. Low risk. Needs a build + staggered redeploy to ship.

---

## Ticket 1b — Related: `/api/screenshot/person` passes raw `id` param into bigint query

### Symptom
Same `invalid input syntax for type bigint` but with values like `13753747?odnHeight=372`,
`66427?odnHeight=117`, `15997043&locale=en` — i.e. a numeric id with a **mangled query-string
fragment** appended (bots requesting HTML-entity-encoded URLs like `?id=15997043&amp;locale=en`).

### Root cause
`app/api/screenshot/person/route.jsx:252` interpolates the request `id` param straight into
`GET /person?id=eq.${id}&select=name,gender,translations,occupation(...),birthyear,deathyear`
without validating it's an integer. (This is the same class as the known screenshot
`&amp%3Blocale=` mangling noted previously.)

### Fix (proposed)
Parse/validate `id` at the top of the route: `const id = Number.parseInt(rawId, 10)` and
reject non-integer (`Number.isNaN`) with a 400 or the placeholder image, before building the
PostgREST URL. Cheap, stops bot-driven 500s.

---

## Ticket 2 — Move Postgres onto the idle NVMe (durable fix for the residual HDD load)

### Why
The 2026-07-24 outage was HDD I/O saturation (`/dev/sda`, 7200rpm). The fetch-cache write
stream was moved to tmpfs (done), but **Postgres WAL + data still live on `sda`** and are now
the dominant remaining disk writer. The box has a **931 GB NVMe (`nvme0n1`) sitting idle**,
currently ext4 **read-only** at `/mnt/nvme-check` holding a **stale Ubuntu 4.15 root image**
(initrd symlinks → `4.15.0-213-generic`; ~600 GB used, 269 GB free). DB size is **130 GB**.

### Options
- **(A) Reclaim + reformat the NVMe, move the whole PG data dir there.** Cleanest. Moves ALL
  Postgres I/O (data + WAL) to SSD (~200 HDD IOPS → 100k+). 130 GB fits easily in 916 GB.
- **(B) Move only `pg_wal` to the NVMe** (symlink). Smaller change; captures most of the
  commit-fsync latency win. But leaves data reads/checkpoint writes on the HDD.
- Recommend **(A)** for the durable fix.

### Preconditions (need Alex)
1. **Confirm the `/mnt/nvme-check` 4.15 image is a dead rescue copy** and safe to wipe. (Do NOT
   proceed until confirmed — it may be an intentional recovery root.)
2. Schedule a short maintenance window (see minimized-downtime flow below).
3. Root access (no passwordless sudo for the automation user).

### Migration flow (option A, minimized downtime)
1. Repartition/reformat `nvme0n1p2` fresh (ext4), mount e.g. at `/var/lib/postgresql-nvme`,
   `chown postgres:postgres`.
2. **Live pre-sync** while Postgres runs: `rsync -a --delete /var/lib/postgresql/17/main/ /var/lib/postgresql-nvme/main/` (bulk copy, ~130 GB, no downtime).
3. Stop PostgREST (`panteon-api`) then Postgres.
4. **Final delta rsync** (fast — only WAL/changes since step 2).
5. Point the cluster at the new dir: update `data_directory` in
   `/etc/postgresql/17/main/postgresql.conf` (Ubuntu packaging) to the NVMe path.
6. Start Postgres, verify (`SELECT pg_is_in_recovery(); \l+`), then start PostgREST.
7. Keep the old `sda` copy until verified, then reclaim.
- **Downtime ≈ the final delta rsync + restart (a few minutes).**

### Durability note
A single NVMe with no RAID is a SPOF for the DB — but so is the current single HDD, so this is
not a regression. If durability matters long-term, consider mirroring (the idle `sdb` 1.8 TB
HDD could be a WAL-archive/backup target, not a mirror of differing speed).

### Expected payoff
Removes the last major writer from the saturated HDD; per prior measurement the box was
chronically I/O-bound. This is the structural fix behind the recurring load/latency issues.
