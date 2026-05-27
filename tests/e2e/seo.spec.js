import {test, expect, request} from "@playwright/test";

/**
 * SEO behavior tests.
 *
 * Covers the changes made to address Google Search Console failures:
 *   - /en/* permanent (301) redirects to the unprefixed URL.
 *   - /explore/rankings titles reflect every active filter in the SSR HTML
 *     (occupation, country/city, gender, placeType, year range, HPI/langs
 *     cutoff, birthday — partial or full, "new biographies", and the
 *     show=places / show=occupations modes).
 *   - /explore/rankings self-canonicalises per filter combination.
 *   - /news?date=YYYY-MM-DD self-canonicalises and exposes a date-specific
 *     title and description; ?model= is stripped from the canonical because
 *     both grok and gemini render identical HTML.
 *   - New sitemap routes (news-{locale}, rankings-{locale}) render valid XML.
 *   - robots.txt no longer disallows /explore/rankings.
 *
 * These tests inspect SSR responses directly (no JS execution required), so
 * they run fast and read the canonical/robots/title exactly as Googlebot would.
 */

// Helpers ---------------------------------------------------------------------

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match ? match[1].trim() : null;
}

function extractCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractMetaRobots(html) {
  const match = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

// /explore/rankings filter → title matrix -------------------------------------

const RANKINGS_TITLE_CASES = [
  {
    name: "bare landing",
    path: "/explore/rankings",
    expected: "Memorable people | Pantheon Rankings",
  },
  {
    name: "occupation filter",
    path: "/explore/rankings?occupation=POLITICIAN",
    expected: "Memorable politicians | Pantheon Rankings",
  },
  {
    name: "country filter",
    path: "/explore/rankings?place=usa",
    expected: "Memorable people born in present day United States | Pantheon Rankings",
  },
  {
    name: "occupation + country",
    path: "/explore/rankings?occupation=POLITICIAN&place=usa",
    expected:
      "Memorable politicians born in present day United States | Pantheon Rankings",
  },
  {
    name: "occupation + year range",
    path: "/explore/rankings?occupation=POLITICIAN&years=1900,2000",
    expected: "Memorable politicians | 1900 - 2000 | Pantheon Rankings",
  },
  {
    name: "gender alone",
    path: "/explore/rankings?gender=F",
    expected: "Memorable women | Pantheon Rankings",
  },
  {
    name: "gender + occupation",
    path: "/explore/rankings?gender=F&occupation=WRITER",
    expected: "Memorable female writers | Pantheon Rankings",
  },
  {
    name: "deathplace + country",
    path: "/explore/rankings?occupation=POLITICIAN&placeType=deathplace&place=usa",
    expected:
      "Memorable politicians who died in United States | Pantheon Rankings",
  },
  {
    name: "hpi cutoff",
    path: "/explore/rankings?hpi=80",
    expected: "Memorable people | HPI ≥ 80 | Pantheon Rankings",
  },
  {
    name: "occupation + hpi",
    path: "/explore/rankings?occupation=ACTOR&hpi=70",
    expected: "Memorable actors | HPI ≥ 70 | Pantheon Rankings",
  },
  {
    name: "languages cutoff",
    path: "/explore/rankings?l=20",
    expected: "Memorable people | 20+ Wikipedia languages | Pantheon Rankings",
  },
  {
    name: "birth month only",
    path: "/explore/rankings?birthMonth=5",
    expected: "Memorable people | Born in May | Pantheon Rankings",
  },
  {
    name: "birth day only",
    path: "/explore/rankings?birthDay=15",
    expected: "Memorable people | Born on the 15th | Pantheon Rankings",
  },
  {
    name: "full birthday",
    path: "/explore/rankings?birthMonth=5&birthDay=15",
    expected: "Memorable people | Born on May 15 | Pantheon Rankings",
  },
  {
    name: "show=places + occupation",
    path: "/explore/rankings?show=places&occupation=POLITICIAN",
    expected: "Birth places of memorable politicians | Pantheon Rankings",
  },
  {
    name: "show=occupations + country",
    path: "/explore/rankings?show=occupations&place=usa",
    expected:
      "Occupations of memorable people born in present day United States | Pantheon Rankings",
  },
  {
    name: "new biographies",
    path: "/explore/rankings?new=true",
    expected: "Memorable people | New biographies | Pantheon Rankings",
  },
  {
    name: "kitchen sink (occupation + gender + years + hpi)",
    path: "/explore/rankings?occupation=ACTOR&years=1800,1900&hpi=60&gender=F",
    expected:
      "Memorable female actors | 1800 - 1900 | HPI ≥ 60 | Pantheon Rankings",
  },
];

for (const {name, path, expected} of RANKINGS_TITLE_CASES) {
  test(`rankings SSR title: ${name}`, async ({request: req}) => {
    const res = await req.get(path);
    expect(res.status(), `${path} returned HTTP ${res.status()}`).toBe(200);
    const html = await res.text();
    expect(extractTitle(html)).toBe(expected);
  });
}

// /explore/rankings self-canonical --------------------------------------------

test("rankings self-canonicalises with active filters", async ({request: req}) => {
  const res = await req.get("/explore/rankings?occupation=POLITICIAN");
  const html = await res.text();
  const canonical = extractCanonical(html);
  expect(canonical).toBeTruthy();
  // Canonical includes the same filter, not the bare landing page.
  expect(canonical).toMatch(/\/explore\/rankings\?occupation=POLITICIAN$/);
});

test("bare rankings canonical points to bare URL", async ({request: req}) => {
  const res = await req.get("/explore/rankings");
  const canonical = extractCanonical(await res.text());
  expect(canonical).toMatch(/\/explore\/rankings$/);
});

// /en/* → 301 redirect --------------------------------------------------------

const EN_REDIRECT_CASES = [
  {path: "/en", expected: "/"},
  {path: "/en/news", expected: "/news"},
  {path: "/en/explore/rankings", expected: "/explore/rankings"},
  {
    path: "/en/profile/person/Marilyn-Monroe",
    expected: "/profile/person/Marilyn-Monroe",
  },
];

for (const {path, expected} of EN_REDIRECT_CASES) {
  test(`/en redirect: ${path} -> ${expected} (301)`, async ({playwright, baseURL}) => {
    // maxRedirects: 0 so we can inspect the redirect response itself, not
    // whatever the final destination renders.
    const ctx = await playwright.request.newContext({
      baseURL,
      maxRedirects: 0,
    });
    try {
      const res = await ctx.get(path);
      expect(res.status(), `${path} expected 301`).toBe(301);
      const location = res.headers()["location"] || "";
      // Location can be absolute or relative; normalise to pathname.
      const locationPath = location.startsWith("http")
        ? new URL(location).pathname
        : location.split("?")[0].split("#")[0];
      expect(locationPath).toBe(expected);
    } finally {
      await ctx.dispose();
    }
  });
}

// /news date metadata ---------------------------------------------------------

test("news with past date: self-canonical, date-specific title", async ({request: req}) => {
  const res = await req.get("/news?date=2025-05-20");
  const html = await res.text();
  expect(extractCanonical(html)).toMatch(/\/news\?date=2025-05-20$/);
  const title = extractTitle(html);
  expect(title).toContain("May 20, 2025");
  expect(extractDescription(html)).toContain("May 20, 2025");
});

test("news with ?model= only drops model from canonical", async ({request: req}) => {
  const res = await req.get("/news?model=gemini");
  const html = await res.text();
  // Both model variants render identical HTML, so canonical must point to
  // the unparameterised URL.
  const canonical = extractCanonical(html);
  expect(canonical).toMatch(/\/news$/);
  expect(canonical).not.toMatch(/model=/);
});

test("bare /news canonicalises to /news", async ({request: req}) => {
  const res = await req.get("/news");
  expect(extractCanonical(await res.text())).toMatch(/\/news$/);
});

test("news has no robots noindex on any variant", async ({request: req}) => {
  for (const path of ["/news", "/news?date=2025-05-20", "/news?model=gemini"]) {
    const res = await req.get(path);
    const robots = extractMetaRobots(await res.text());
    if (robots) {
      expect(robots.toLowerCase(), `${path} unexpectedly noindex`).not.toContain("noindex");
    }
  }
});

// Sitemap routes --------------------------------------------------------------

test("sitemap-index lists the new news/rankings sitemaps for every locale", async ({request: req}) => {
  const res = await req.get("/sitemap-index.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  // Spot-check three locales for both new sitemaps.
  for (const locale of ["en", "fr", "ja"]) {
    expect(xml).toContain(`https://pantheon.world/sitemap/news-${locale}`);
    expect(xml).toContain(`https://pantheon.world/sitemap/rankings-${locale}`);
  }
});

test("news sitemap contains dated URLs", async ({request: req}) => {
  const res = await req.get("/sitemap/news-en");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  // Should contain at least one /news?date=YYYY-MM-DD URL, and the URL must
  // be unprefixed (default locale collapses to no locale prefix).
  expect(xml).toMatch(/<loc>https:\/\/pantheon\.world\/news\?date=\d{4}-\d{2}-\d{2}<\/loc>/);
  // Must NOT emit /en/news (default locale gets no prefix).
  expect(xml).not.toContain("/en/news");
});

test("non-en news sitemap uses locale prefix", async ({request: req}) => {
  const res = await req.get("/sitemap/news-fr");
  const xml = await res.text();
  expect(xml).toMatch(/<loc>https:\/\/pantheon\.world\/fr\/news\?date=\d{4}-\d{2}-\d{2}<\/loc>/);
});

test("rankings sitemap contains occupation and country filter URLs", async ({request: req}) => {
  const res = await req.get("/sitemap/rankings-en");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  // Occupation IDs are uppercase (e.g. POLITICIAN). URL-encoded.
  expect(xml).toMatch(/<loc>[^<]*\/explore\/rankings\?occupation=[A-Z%0-9]+<\/loc>/);
  expect(xml).toMatch(/<loc>[^<]*\/explore\/rankings\?place=[a-z]+<\/loc>/);
});

// Client-side metadata sync -------------------------------------------------

/**
 * Filter changes update the URL via window.history.replaceState, which
 * bypasses Next.js's router so generateMetadata never re-runs. The Explore
 * component compensates with a client-side effect that updates document.title,
 * description, and the canonical link in place. This test drives a real filter
 * change and asserts all three reflect the new state.
 */
test("rankings filter change updates document.title and canonical client-side", async ({page}) => {
  // networkidle ensures hydration + initial data fetch settle before we touch
  // the UI; otherwise the hydration effect dispatches AFTER our selectOption
  // and clobbers the filter back to "all".
  await page.goto("/explore/rankings", {waitUntil: "networkidle"});
  // SSR title with no filters.
  await expect(page).toHaveTitle("Memorable people | Pantheon Rankings");

  const occupationSelect = page
    .locator(".prof-control")
    .filter({hasText: "Working in"})
    .locator("select");
  await occupationSelect.waitFor({state: "visible"});
  await occupationSelect.selectOption({value: "POLITICIAN"});

  // The metadata sync effect runs off redux state, so it updates immediately
  // — independent of the URL replaceState (which awaits the next data fetch).
  await expect(page).toHaveTitle("Memorable politicians | Pantheon Rankings");
  await expect
    .poll(async () =>
      page.locator('link[rel="canonical"]').getAttribute("href"),
    )
    .toMatch(/\/explore\/rankings\?occupation=POLITICIAN$/);
});

// robots.txt ------------------------------------------------------------------

test("robots.txt allows /explore/rankings", async ({request: req}) => {
  const res = await req.get("/robots.txt");
  expect(res.status()).toBe(200);
  const text = await res.text();
  // Verify the previous noindex/disallow was removed.
  expect(text).not.toMatch(/Disallow:\s*\/explore\/rankings/i);
  // Sanity: sitemap pointer present.
  expect(text).toContain("Sitemap:");
});
