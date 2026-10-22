import {expect, test} from "@playwright/test";
import {firstHref, goto} from "./helpers.js";

/**
 * Trending summaries are markdown rendered with micromark, which emits
 * BLOCK-level HTML (`<p>…</p>`), so they must be injected into a block
 * container. Injecting them into a `<p>` ships `<p><p>…</p></p>`, and the HTML
 * parser is required to close the outer paragraph at the inner one — the
 * summary text lands in a SIBLING node instead of inside the container. The
 * client tree still nests it, so hydration throws
 *   "Hydration failed because the server rendered HTML didn't match the client"
 * (React #418) on /news and on every trending person profile.
 *
 * These run with JavaScript disabled so the assertions see the server-rendered
 * DOM exactly as the browser parses it — that is where the nesting is lost;
 * once React re-renders the subtree on the client the structure looks fine
 * again.
 */
test.describe("server-rendered markdown survives HTML parsing", () => {
  test.use({javaScriptEnabled: false});

  test("trending news summaries render inside their container", async ({page}) => {
    await goto(page, "/news");

    const summary = page
      .locator(".desktop-card-content .trending-news-summary")
      .first();
    await expect(summary).toBeAttached();
    await expect(
      summary.locator("p"),
      "summary container lost its markdown paragraph to the HTML parser",
    ).not.toHaveCount(0);
    await expect(summary).not.toHaveText(/^\s*$/);
  });

  test("no block element opens directly inside a paragraph", async ({page}) => {
    // A trending person profile renders the same summary through WhyTrending,
    // so check both pages. The slug is discovered from /news rather than
    // hardcoded — who is trending changes daily.
    await goto(page, "/news");
    const personHref = await firstHref(page, /\/profile\/person\//);

    const paths = ["/news", ...(personHref ? [personHref] : [])];
    for (const path of paths) {
      const res = await page.request.get(path);
      expect(res.status(), `${path} returned HTTP ${res.status()}`).toBeLessThan(400);
      const html = await res.text();
      expect(
        html,
        `${path} nests a block element inside a <p>`,
      ).not.toMatch(/<p\b[^>]*>\s*<(?:p|div|ul|ol|blockquote|pre|h[1-6])\b/i);
    }
  });
});
