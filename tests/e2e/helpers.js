import {expect} from "@playwright/test";

/**
 * Console errors that are noise rather than real breakage. If the first run
 * trips a test on a benign third-party error, add its substring/RegExp here.
 *
 * Uncaught JS exceptions (`pageerror`) are ALWAYS treated as failures and are
 * not filtered — those indicate the page actually broke.
 */
export const IGNORED_CONSOLE_PATTERNS = [
  /favicon/i,
  /ResizeObserver loop/i,
  // Sub-resource (image/asset) network failures. The page itself is still
  // functional — the navigation's HTTP status and rendered-content checks
  // already gate that. Remove this line if you want to police asset 404s.
  /Failed to load resource/i,
  // 3rd-party analytics / tag managers
  /googletagmanager|google-analytics|gtag|doubleclick/i,
  /facebook\.net|connect\.facebook/i,
  // Browser extension / devtools noise
  /Download the React DevTools/i,
  // Next.js dev-only hydration/HMR chatter (harmless in dev runs)
  /\[Fast Refresh\]/i,
];

function isIgnoredConsole(text) {
  return IGNORED_CONSOLE_PATTERNS.some((p) =>
    typeof p === "string" ? text.includes(p) : p.test(text),
  );
}

/**
 * Attach listeners that collect uncaught exceptions and (non-ignored) console
 * errors. Returns `assertClean()` to call at the end of a test.
 */
export function attachErrorWatch(page) {
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (err) => {
    pageErrors.push(err.message || String(err));
  });
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (!isIgnoredConsole(text)) consoleErrors.push(text);
  });

  return {
    pageErrors,
    consoleErrors,
    assertClean() {
      expect(pageErrors, `Uncaught JS error(s):\n${pageErrors.join("\n")}`).toEqual([]);
      expect(
        consoleErrors,
        `Console error(s):\n${consoleErrors.join("\n")}`,
      ).toEqual([]);
    },
  };
}

/**
 * Navigate to `path`, assert the response status is < 400, and assert the
 * custom 404 page (`h2.error-msg` in app/not-found.jsx) did NOT render.
 * Returns the navigation response.
 */
export async function goto(page, path) {
  const res = await page.goto(path, {waitUntil: "domcontentloaded"});
  expect(res, `No response for ${path}`).not.toBeNull();
  expect(
    res.status(),
    `${path} returned HTTP ${res.status()}`,
  ).toBeLessThan(400);
  await expect(
    page.locator("h2.error-msg"),
    `${path} rendered the 404 page`,
  ).toHaveCount(0);
  return res;
}

/**
 * Navigate to a route that should 404 and assert it does so GRACEFULLY:
 * HTTP 404 (not 500) and the custom not-found UI renders. Guards against pages
 * that crash on invalid input — e.g. returning a `Response` from a Server
 * Component, which throws "Only plain objects... can be passed to Client
 * Components" and yields a 500 instead of a clean 404.
 */
export async function expectNotFound(page, path) {
  const res = await page.goto(path, {waitUntil: "domcontentloaded"});
  expect(res, `No response for ${path}`).not.toBeNull();
  expect(res.status(), `${path} should return 404, got HTTP ${res.status()}`).toBe(404);
  await expect(page.locator("h2.error-msg")).toBeVisible();
}

/**
 * Assert an entity profile page loaded WITH data: every entity Header renders
 * <h1 class="profile-name"> with the entity's name/year. Empty fallbacks (from
 * safeFetch swallowing a failed fetch) would leave it blank.
 */
export async function expectProfileLoaded(page) {
  const name = page.locator("h1.profile-name");
  await expect(name).toBeVisible();
  await expect(name).not.toHaveText(/^\s*$/);
}

/**
 * Assert a non-profile page rendered real content: visible body text.
 * (goto() already ruled out the 404 page and non-2xx/3xx responses.)
 * Note: we don't assert on <title> — several real pages (games, data, about)
 * legitimately render without setting a document title.
 */
export async function expectContent(page) {
  const bodyText = (await page.locator("body").innerText()).trim();
  expect(bodyText.length, "Page body has no visible text").toBeGreaterThan(20);
}

/**
 * Find the first in-app link whose href matches `hrefPattern` (RegExp).
 * Used to DISCOVER detail URLs from index pages instead of hardcoding fragile
 * slugs. Waits for at least one match to appear. Returns the href (string) or
 * null if none show up before `timeout`.
 */
export async function firstHref(page, hrefPattern, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const hrefs = await page.locator("a[href]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href")),
    );
    const match = hrefs.find((h) => h && hrefPattern.test(h));
    if (match) return match;
    await page.waitForTimeout(250);
  }
  return null;
}

/**
 * Open `indexPath` and return the last path segment (slug) of the first link
 * matching `detailPattern`, or null if none found. Lets cascading-route tests
 * build URLs from real, current data instead of hardcoding slugs.
 */
export async function discoverSlug(page, indexPath, detailPattern) {
  await goto(page, indexPath);
  const href = await firstHref(page, detailPattern);
  if (!href) return null;
  return href.split(/[?#]/)[0].replace(/\/$/, "").split("/").pop();
}
