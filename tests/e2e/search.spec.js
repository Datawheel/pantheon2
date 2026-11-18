import {expect, test} from "@playwright/test";
import {attachErrorWatch, goto} from "./helpers.js";

test("search results use entity identity when slugs collide", async ({page}) => {
  const watch = attachErrorWatch(page);
  const collidingResults = [
    {
      "profile_type": "person",
      "entity_id": "58980591",
      name: "Michael",
      slug: "Michael",
      "primary_meta": "SOCCER PLAYER",
      "secondary_meta": "Feira de Santana",
    },
    {
      "profile_type": "person",
      "entity_id": "59434881",
      name: "Michael",
      slug: "Michael",
      "primary_meta": "SOCCER PLAYER",
      "secondary_meta": "Poxoréu",
    },
  ];

  await page.route("**/rpc/search_hybrid*", route =>
    route.fulfill({json: collidingResults}),
  );
  await goto(page, "/data/faq");
  await expect(async () => {
    await page.locator(".navigation .search-btn button").click();
    await expect(page.getByRole("combobox")).toBeVisible({timeout: 1000});
  }).toPass({timeout: 10000});
  await page.getByRole("combobox").fill("mic");

  const resultItems = page.getByRole("option", {name: /Michael/});
  await expect(resultItems).toHaveCount(2);
  await expect(resultItems.last()).toContainText("Poxoréu");
  watch.assertClean();
});

const trends = Array.from({length: 12}, (_, i) => ({
  pid: i + 1, name: `Jo ${i + 1}`, slug: `Jo_${i + 1}`, occupation: "Writer",
}));

async function openSearch(page) {
  await page.route("**/api/wikiTrends?*", route => route.fulfill({json: trends}));
  await goto(page, "/data/faq");
  await expect(page.locator(".navigation .search-btn button")).toBeVisible();
  const input = page.getByRole("combobox");
  await expect(async () => {
    await page.keyboard.press("s");
    await expect(input).toBeFocused({timeout: 1000});
  }).toPass({timeout: 10000});
  await expect(page.getByRole("option")).toHaveCount(12);
  return input;
}

test("keyboard-only selection opens the third result", async ({page}) => {
  const input = await openSearch(page);
  await input.pressSequentially("jo");
  await input.press("Enter");
  await expect(input).toBeFocused();
  for (let i = 0; i < 3; i++) await input.press("ArrowDown");
  const third = page.getByRole("option").nth(2);
  await expect(third).toHaveAttribute("aria-selected", "true");
  await expect(input).toHaveAttribute("aria-activedescendant", await third.getAttribute("id"));
  await page.route("**/profile/person/Jo_3", route => route.fulfill({contentType: "text/html", body: "Selected"}));
  await input.press("Enter");
  await expect(page).toHaveURL(/\/profile\/person\/Jo_3$/);
});

test("scrolling, dismissal and tab order preserve the query", async ({page}) => {
  await page.setViewportSize({width: 390, height: 640});
  const input = await openSearch(page);
  await input.fill("jo");
  for (let i = 0; i < 10; i++) await input.press("ArrowDown");
  const list = page.getByRole("listbox");
  await expect.poll(() => list.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  const visibleRow = await page.getByRole("option").nth(9).boundingBox();
  const bounds = await list.boundingBox();
  expect(visibleRow.y).toBeGreaterThanOrEqual(bounds.y);
  expect(visibleRow.y + visibleRow.height).toBeLessThanOrEqual(bounds.y + bounds.height + 1);
  await input.press("Escape");
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("jo");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await input.press("ArrowUp");
  await expect(page.getByRole("option").last()).toHaveAttribute("aria-selected", "true");
  await input.press("Shift+Tab");
  await expect(page.getByRole("button", {name: "Close search"})).toBeFocused();
  await expect(list).toBeHidden();
  await expect(input).toHaveValue("jo");
  await page.keyboard.press("Tab");
  await expect(input).toBeFocused();
  await input.press("ArrowDown");
  await input.press("Tab");
  await expect(page.locator(".search-overlay")).toBeHidden();
  await expect(page).toHaveURL(/\/data\/faq$/);
});

test("hover leaves keyboard selection intact and click follows the pointed option", async ({page}) => {
  const input = await openSearch(page);
  await input.press("ArrowDown");
  const second = page.getByRole("option").nth(1);
  await second.hover();
  await expect(page.getByRole("option").first()).toHaveAttribute("aria-selected", "true");
  await page.route("**/profile/person/Jo_2", route => route.fulfill({contentType: "text/html", body: "Selected"}));
  await second.click();
  await expect(page).toHaveURL(/\/profile\/person\/Jo_2$/);
});

test("query edits reset selection and announce loading, empty, and failed requests", async ({page}) => {
  const input = await openSearch(page);
  await page.route("**/rpc/search_hybrid*", route => {
    const query = new URL(route.request().url()).searchParams.get("q");
    return query === "none" ? route.fulfill({json: []}) : route.abort();
  });
  const status = page.locator(".search").getByRole("status");
  await input.press("ArrowDown");
  await input.fill("none");
  await expect(input).not.toHaveAttribute("aria-activedescendant", /.+/);
  await expect(status).toContainText("Loading");
  await expect(status).toContainText("No results");
  await input.press("Backspace");
  await expect(status).toContainText("could not load");
  await page.route("**/rpc/search_hybrid*", route => route.fulfill({json: []}));
  await input.press("Tab");
  const retry = page.getByRole("button", {name: "Try again"});
  await expect(retry).toBeFocused();
  await retry.press("Enter");
  await expect(input).toBeFocused();
  await expect(status).toContainText("No results");
  await input.press("Backspace");
  await expect(status).toContainText("12 suggestions");
  await expect(page.getByRole("option", {selected: true})).toHaveCount(0);
  await page.mouse.click(3, 600);
  await expect(input).toBeHidden();
});

test.describe("touch search", () => {
  test.use({hasTouch: true, isMobile: true, viewport: {width: 375, height: 667}});

  test("tapping a suggestion follows its localized profile link", async ({page}) => {
    await page.route("**/api/wikiTrends?*", route => route.fulfill({json: trends}));
    await goto(page, "/fr/data/faq");
    await expect(async () => {
      await page.locator(".navigation .search-btn button").tap();
      await expect(page.getByRole("combobox")).toBeFocused({timeout: 1000});
    }).toPass({timeout: 10000});
    const panel = await page.locator(".search").boundingBox();
    expect(panel.x).toBeGreaterThanOrEqual(8);
    expect(panel.x + panel.width).toBeLessThanOrEqual(375 - 8);
    const option = page.getByRole("option").nth(4);
    const name = await option.locator(".search-name").boundingBox();
    const meta = await option.locator(".search-meta").boundingBox();
    expect(meta.y).toBeGreaterThanOrEqual(name.y + name.height - 1);
    expect(meta.x).toBeCloseTo(name.x, 0);
    await expect(option).toHaveAttribute("href", "/fr/profile/person/Jo_5");
    await page.route("**/fr/profile/person/Jo_5", route =>
      route.fulfill({contentType: "text/html", body: "Selected"}),
    );
    await option.tap();
    await expect(page).toHaveURL(/\/fr\/profile\/person\/Jo_5$/);
  });
});

test("desktop search is wide, centered and backed by a dismissible overlay", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await openSearch(page);
  const panel = await page.locator(".search").boundingBox();
  expect(panel.width).toBeGreaterThanOrEqual(760);
  expect(panel.x + panel.width / 2).toBeCloseTo(720, 0);
  expect(panel.y).toBeGreaterThan(60);
  const list = page.getByRole("listbox");
  const tall = await list.boundingBox();
  expect(tall.height).toBeGreaterThan(440);
  await page.setViewportSize({width: 1440, height: 600});
  const short = await list.boundingBox();
  expect(short.height).toBeLessThan(tall.height);
  await page.setViewportSize({width: 1440, height: 900});
  const overlay = page.locator(".search-overlay");
  expect(await overlay.boundingBox()).toEqual({x: 0, y: 0, width: 1440, height: 900});
  await overlay.click({position: {x: 30, y: 30}});
  await expect(overlay).toBeHidden();
});
