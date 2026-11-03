import {REVALIDATE_PERIODS} from "@/app/constants";
import {encodePostgrestQuotedList} from "@/app/utils/postgrest";
import {safeFetchArray} from "@/app/utils/safeFetch";

// Trend reasons are written for the previous day (same cut-off as the news
// page), using the Godthab clock the trend pipeline runs on.
export function getTrendReasonsDate(now = new Date()) {
  const zoned = new Date(
    now.toLocaleString("en-US", {timeZone: "America/Godthab"}),
  );
  zoned.setDate(zoned.getDate() - 1);
  return `${zoned.getFullYear()}-${String(zoned.getMonth() + 1).padStart(2, "0")}-${String(zoned.getDate()).padStart(2, "0")}`;
}

/**
 * Fetch "why is this person trending" blurbs written in `lang` for the given
 * slugs. The slugs can come from any Wikipedia edition: reasons are keyed by
 * the reader's language, not the edition the person trended in.
 */
export async function fetchTrendReasons({slugs, lang, baseApi}) {
  if (!slugs?.length) return [];
  const rows = await safeFetchArray(
    `${baseApi}/trend_news?date=eq.${getTrendReasonsDate()}&lang=eq.${lang}&slug=in.(${encodePostgrestQuotedList(slugs)})&select=slug,title,reason,llm_metadata`,
    {next: {revalidate: REVALIDATE_PERIODS.SHORT * 2}},
  );
  const seen = new Set();
  return rows
    .filter(row => !seen.has(row.slug) && seen.add(row.slug))
    .map(row => ({
      slug: row.slug,
      trending_reason: row.reason || "",
      llm_metadata: row.llm_metadata,
      localized_name: row.title || "",
    }));
}
