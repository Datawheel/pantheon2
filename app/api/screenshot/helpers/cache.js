// Shared Cache-Control for the OG/screenshot image routes. These cards rarely
// change, so let the CDN/bots serve repeats instead of re-running Satori on
// every crawler hit — the main source of heap pressure in production. Without
// this, next/og defaults to `public, max-age=0, must-revalidate` (no caching).
export const OG_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
