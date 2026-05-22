# E2E smoke suite

Fast Playwright smoke tests that navigate every major page and confirm it
**loads, renders real data, and throws no JS errors** — meant to be run after
making changes.

## Run it

The suite assumes the app is **already running** (it does not start a server).

```bash
# one-time setup
npm install
npx playwright install chromium

# 1) start the app (either works)
npm run dev                 # fastest iteration; first run is slower (on-demand compile)
# or: npm run build && npm start   # production-realistic, fastest per page

# 2) run the suite (in another terminal)
npm run test:e2e            # full sweep, ~1 min
npm run test:e2e:ui        # interactive UI mode
npx playwright test profiles      # one file
npx playwright show-report        # open the last HTML report
```

Point it at a different server with `BASE_URL`:

```bash
BASE_URL=https://pantheon.world npm run test:e2e
```

## What it checks

For every page: the navigation returns HTTP < 400, the custom 404 page
(`h2.error-msg`) did **not** render, and there are **no uncaught JS exceptions**.
Beyond that:

- **`profiles.spec.js`** — entity detail pages assert `h1.profile-name` rendered
  with non-empty text. That's the key signal: `app/utils/safeFetch.js` swallows
  failed fetches and returns empty fallbacks, so a broken data fetch still yields
  HTTP 200 — only a content assertion catches it. Covers person, occupation,
  country, place, era, deaths, born-on-this-day, plus the cascading
  `occupation→country`, `deaths→occupation`, `deaths→country` routes.
- **`static-and-index.spec.js`** — home, explore, games, news/monthly, data,
  legal, and all entity index pages render real body content (index pages also
  assert they expose at least one working detail link).
- **`locales.spec.js`** — i18n spot-check on `/fr`, `/de`, `/es`, `/ja`.
- **`errors.spec.js`** — unsupported routes (e.g. `/profile/deaths/1950`) must 404
  gracefully, not 500.

Detail/cascade URLs are **discovered** from index pages (`firstHref` /
`discoverSlug` in `helpers.js`) rather than hardcoded, so the suite survives
slug/data changes.

## Tuning

- **Console noise:** `IGNORED_CONSOLE_PATTERNS` in `helpers.js` filters benign
  console errors (analytics, sub-resource 404s, dev-only React/HMR chatter).
  Add patterns there if a harmless third-party error trips a test; remove the
  `Failed to load resource` line if you want to police asset/image 404s.
- **Timeouts** live in `playwright.config.js` — generous so a cold `next dev`
  doesn't false-fail.

## Bug this suite surfaced (now fixed)

`/profile/deaths/<year>` used to return **HTTP 500 for unsupported years** (e.g.
1950, 1900) with: `"Only plain objects, and a few built-ins, can be passed to
Client Components from Server Components"`. Cause: the deaths page (and its
`occupation`/`country` sub-routes) did `return new Response("Not Found", {status:
404})` from a Server Component for years < 2000 — returning a `Response` (a class
instance) as the render result crashes React's serialization. Fixed by calling
`notFound()` instead. Guarded by `errors.spec.js`.
