import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";

const SITE_URL = "https://pantheon.world";
const ITEMS_PER_SITEMAP = 25000;

function localePrefix(locale) {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

function buildUrlEntries(slugs, locale, pathPrefix) {
  const prefix = `${SITE_URL}${localePrefix(locale)}${pathPrefix}`;
  return slugs.map(slug => `  <url><loc>${prefix}/${slug}</loc></url>`);
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
      entries.push(`  <url><loc>${prefix}${path}</loc></url>`);
    }
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

function parseSlug(slug) {
  if (slug === "static") {
    return {type: "static"};
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

export async function GET(request, {params}) {
  const {slug} = params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    return new Response("Not found", {status: 404});
  }

  let entries;
  if (parsed.type === "static") {
    entries = generateStaticSitemap();
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
