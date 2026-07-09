import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";

const SITE_URL = "https://pantheon.world";
const ITEMS_PER_SITEMAP = 25000;

function localePrefix(locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlEntry(url) {
  return `  <url><loc>${escapeXml(url)}</loc></url>`;
}

function buildUrlEntries(slugs, locale, pathPrefix) {
  const prefix = `${SITE_URL}${localePrefix(locale)}${pathPrefix}`;
  return slugs.map(slug => buildUrlEntry(`${prefix}/${encodeURIComponent(slug)}`));
}

function getBirthdayDates() {
  const monthLengths = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dates = [];

  monthLengths.forEach((daysInMonth, monthIndex) => {
    const month = String(monthIndex + 1).padStart(2, "0");

    for (let day = 1; day <= daysInMonth; day += 1) {
      dates.push(`${month}-${String(day).padStart(2, "0")}`);
    }
  });

  return dates;
}

async function fetchSlugs(endpoint, slugField = "slug", filter = "", limit, offset) {
  const url = `${BASE_API}/${endpoint}?select=${slugField}${filter}&${slugField}=not.is.null&order=${slugField}&limit=${limit}&offset=${offset}`;
  try {
    const res = await fetch(url, {
      next: {revalidate: REVALIDATE_PERIODS.LONG},
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(d => d[slugField]).filter(Boolean);
  } catch (e) {
    console.error(`[sitemap] fetch error for ${endpoint}:`, e.message);
    return [];
  }
}

// Static/hub pages that exist for every locale
const STATIC_PATHS = [
  "",
  "/profile/person",
  "/profile/country",
  "/profile/occupation",
  "/profile/place",
  "/profile/era",
  "/profile/deaths",
  "/profile/born-on-this-day",
  "/profile/recently-added",
  "/explore/rankings",
  "/explore/viz",
  "/news",
  "/game/birthle",
  "/game/yearbook",
  "/game/trivia",
  "/data/api",
  "/data/datasets",
  "/data/faq",
  "/data/permissions",
  "/about/privacy",
  "/about/terms",
];

function generateStaticSitemap() {
  const entries = [];
  for (const locale of SUPPORTED_LOCALES) {
    const prefix = `${SITE_URL}${localePrefix(locale)}`;
    for (const path of STATIC_PATHS) {
      entries.push(buildUrlEntry(`${prefix}${path}`));
    }
  }
  return entries;
}

function generateBirthdaySitemap() {
  const entries = [];
  const dates = getBirthdayDates();

  for (const locale of SUPPORTED_LOCALES) {
    entries.push(...buildUrlEntries(dates, locale, "/profile/born-on-this-day"));
  }

  return entries;
}

async function generateEntitySitemap(locale, entity, page) {
  const config = {
    persons: {endpoint: "person", slugField: "slug", filter: "", pathPrefix: "/profile/person"},
    countries: {endpoint: "country", slugField: "slug", filter: "", pathPrefix: "/profile/country"},
    occupations: {endpoint: "occupation", slugField: "occupation_slug", filter: "", pathPrefix: "/profile/occupation"},
    places: {endpoint: "place", slugField: "slug", filter: "&num_born=gt.0", pathPrefix: "/profile/place"},
    eras: {endpoint: "era", slugField: "slug", filter: "", pathPrefix: "/profile/era"},
  };

  const cfg = config[entity];
  if (!cfg) return [];

  const offset = page * ITEMS_PER_SITEMAP;
  const slugs = await fetchSlugs(cfg.endpoint, cfg.slugField, cfg.filter, ITEMS_PER_SITEMAP, offset);
  return buildUrlEntries(slugs, locale, cfg.pathPrefix);
}

// Expose the last N days of daily trending-news pages so Google can discover
// each date variant. The page itself self-canonicalises to /news?date=YYYY-MM-DD
// for past dates and has a date-specific title/description, so each URL is
// genuinely unique content.
const NEWS_DAYS_BACK = 90;

function generateNewsSitemap(locale) {
  const prefix = `${SITE_URL}${localePrefix(locale)}/news`;
  const entries = [];
  // Skip "today" since it canonicalises to bare /news (already in static sitemap).
  for (let i = 1; i <= NEWS_DAYS_BACK; i++) {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - i);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    entries.push(buildUrlEntry(`${prefix}?date=${yyyy}-${mm}-${dd}`));
  }
  return entries;
}

// Pull a curated set of valuable /explore/rankings filter combinations from
// real data: single-dimension filters by top occupation and top country.
// Google can crawl deeper combinations from on-page internal links once these
// seed URLs are indexed.
const RANKINGS_TOP_OCCUPATIONS = 25;
const RANKINGS_TOP_COUNTRIES = 30;

async function fetchTopOccupationIds(limit) {
  // The /explore/rankings ?occupation= filter expects the occupation `id`
  // (e.g. "POLITICIAN"), not the slug ("politician"). Passing the wrong value
  // silently falls through to the unfiltered ranking.
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast&select=id&num_born=gt.0&limit=${limit}`;
  try {
    const res = await fetch(url, {next: {revalidate: REVALIDATE_PERIODS.LONG}});
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(d => d.id).filter(Boolean);
  } catch (e) {
    console.error("[sitemap] occupation id fetch error:", e.message);
    return [];
  }
}

async function fetchTopCountryCodes(limit) {
  const url = `${BASE_API}/country?order=num_born.desc.nullslast&select=country_code&num_born=gt.0&limit=${limit}`;
  try {
    const res = await fetch(url, {next: {revalidate: REVALIDATE_PERIODS.LONG}});
    if (!res.ok) return [];
    const data = await res.json();
    return data
      .map(d => d.country_code)
      .filter(Boolean)
      .map(code => code.toLowerCase());
  } catch (e) {
    console.error("[sitemap] country code fetch error:", e.message);
    return [];
  }
}

async function generateRankingsSitemap(locale) {
  const base = `${SITE_URL}${localePrefix(locale)}/explore/rankings`;
  const [occupationIds, countryCodes] = await Promise.all([
    fetchTopOccupationIds(RANKINGS_TOP_OCCUPATIONS),
    fetchTopCountryCodes(RANKINGS_TOP_COUNTRIES),
  ]);

  const entries = [];
  for (const id of occupationIds) {
    entries.push(buildUrlEntry(`${base}?occupation=${encodeURIComponent(id)}`));
  }
  for (const code of countryCodes) {
    entries.push(buildUrlEntry(`${base}?place=${encodeURIComponent(code)}`));
  }
  return entries;
}

function parseSlug(slug) {
  if (slug === "static") {
    return {type: "static"};
  }

  if (slug === "birthdays") {
    return {type: "birthdays"};
  }

  const matchNews = slug.match(/^news-([a-z]{2})$/);
  if (matchNews && SUPPORTED_LOCALES.includes(matchNews[1])) {
    return {type: "news", locale: matchNews[1]};
  }

  const matchRankings = slug.match(/^rankings-([a-z]{2})$/);
  if (matchRankings && SUPPORTED_LOCALES.includes(matchRankings[1])) {
    return {type: "rankings", locale: matchRankings[1]};
  }

  // Pattern: {entity}-{locale}-{page} or {entity}-{locale}
  // Locales are 2-letter codes
  const matchPaged = slug.match(/^(persons|places)-([a-z]{2})-(\d+)$/);
  if (matchPaged) {
    const [, entity, locale, page] = matchPaged;
    if (SUPPORTED_LOCALES.includes(locale)) {
      return {type: "entity", entity, locale, page: parseInt(page, 10)};
    }
  }

  const matchSimple = slug.match(/^(countries|occupations|eras)-([a-z]{2})$/);
  if (matchSimple) {
    const [, entity, locale] = matchSimple;
    if (SUPPORTED_LOCALES.includes(locale)) {
      return {type: "entity", entity, locale, page: 0};
    }
  }

  return null;
}

export async function GET(request, context) {
  const params = await context.params;
  const {slug} = params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return new Response("Not found", {status: 404});
  }

  let entries;
  if (parsed.type === "static") {
    entries = generateStaticSitemap();
  } else if (parsed.type === "birthdays") {
    entries = generateBirthdaySitemap();
  } else if (parsed.type === "news") {
    entries = generateNewsSitemap(parsed.locale);
  } else if (parsed.type === "rankings") {
    entries = await generateRankingsSitemap(parsed.locale);
  } else {
    entries = await generateEntitySitemap(parsed.locale, parsed.entity, parsed.page);
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
