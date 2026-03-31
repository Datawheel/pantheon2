import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES} from "/app/locales";

const SITE_URL = "https://pantheon.world";
const ITEMS_PER_SITEMAP = 25000;

async function getCount(endpoint, filter = "") {
  try {
    const url = `${BASE_API}/${endpoint}?select=id${filter}`;
    const res = await fetch(url, {
      headers: {"Prefer": "count=exact", "Range-Unit": "items", "Range": "0-0"},
      next: {revalidate: REVALIDATE_PERIODS.LONG},
    });
    const contentRange = res.headers.get("content-range");
    if (contentRange) {
      const match = contentRange.match(/\/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }
  } catch (e) {
    console.error(`[sitemap-index] count error for ${endpoint}:`, e.message);
  }
  return 0;
}

export async function GET() {
  const [personCount, placeCount] = await Promise.all([
    getCount("person", "&slug=not.is.null"),
    getCount("place", "&num_born=gt.0&slug=not.is.null"),
  ]);

  const personPages = Math.max(1, Math.ceil(personCount / ITEMS_PER_SITEMAP));
  const placePages = Math.max(1, Math.ceil(placeCount / ITEMS_PER_SITEMAP));

  const sitemaps = [];

  // Static pages (all locales in one file)
  sitemaps.push(`${SITE_URL}/sitemap/static`);

  for (const locale of SUPPORTED_LOCALES) {
    sitemaps.push(`${SITE_URL}/sitemap/countries-${locale}`);
    sitemaps.push(`${SITE_URL}/sitemap/occupations-${locale}`);
    sitemaps.push(`${SITE_URL}/sitemap/eras-${locale}`);

    for (let i = 0; i < placePages; i++) {
      sitemaps.push(`${SITE_URL}/sitemap/places-${locale}-${i}`);
    }
    for (let i = 0; i < personPages; i++) {
      sitemaps.push(`${SITE_URL}/sitemap/persons-${locale}-${i}`);
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemaps.map(url => `  <sitemap><loc>${url}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
