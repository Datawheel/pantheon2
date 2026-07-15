import {expect, test} from "@playwright/test";
import {attachErrorWatch, goto} from "./helpers.js";

test("header language selector keeps users on the current page", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  const watch = attachErrorWatch(page);
  await goto(page, "/data/faq?source=header-language#language-selector");

  const trigger = page.getByRole("button", {
    name: "Select language. Current language: English",
  });
  await expect(trigger).toBeVisible();
  await expect(trigger.locator(".language-label")).toBeVisible();
  await expect(trigger.locator(".language-label")).toHaveText("English");
  await expect(trigger.locator("img")).toHaveAttribute(
    "src",
    /\/images\/icons\/icon-language\.svg/,
  );

  await trigger.click();
  const frenchLink = page.locator("#header-language-menu").getByRole("link", {
    name: "Français",
    exact: true,
  });
  await expect(frenchLink).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/fr\/data\/faq\?source=header-language#language-selector$/),
    frenchLink.click(),
  ]);

  const frenchTrigger = page.getByRole("button", {
    name: "Select language. Current language: Français",
  });
  await expect(frenchTrigger).toBeVisible();

  await frenchTrigger.click();
  const englishLink = page.locator("#header-language-menu").getByRole("link", {
    name: "English",
    exact: true,
  });
  await Promise.all([
    page.waitForURL(/\/data\/faq\?source=header-language#language-selector$/),
    englishLink.click(),
  ]);
  await expect(page.getByRole("button", {
    name: "Select language. Current language: English",
  })).toBeVisible();
  watch.assertClean();
});

test("compact header shows the language icon beside search", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  const watch = attachErrorWatch(page);
  await goto(page, "/");

  const languageTrigger = page.getByRole("button", {
    name: "Select language. Current language: English",
  });
  const searchTrigger = page.locator(".navigation .search-btn button");

  await expect(languageTrigger).toBeVisible();
  await expect(languageTrigger.locator(".language-label")).toBeHidden();
  await expect(searchTrigger).toBeVisible();

  const languageBox = await languageTrigger.boundingBox();
  const searchBox = await searchTrigger.boundingBox();
  expect(languageBox).not.toBeNull();
  expect(searchBox).not.toBeNull();
  expect(languageBox.x + languageBox.width).toBeLessThanOrEqual(searchBox.x);

  await languageTrigger.click();
  await expect(page.locator("#header-language-menu a")).toHaveCount(13);
  await expect(
    page.locator("#header-language-menu").getByRole("link", {
      name: "English",
      exact: true,
    }),
  ).toHaveAttribute("aria-current", "page");
  watch.assertClean();
});

test("intermediate header condenses without overlapping controls", async ({
  page,
}) => {
  await page.setViewportSize({width: 805, height: 700});
  const watch = attachErrorWatch(page);
  await goto(page, "/data/faq");

  const newsLink = page.locator(".navigation .news-link");
  const visualizationsLink = page.locator(".navigation .explore-link").first();
  const aboutLink = page.locator(".navigation .about-link");
  const logo = page.locator(".navigation .logo");
  const navigationTrigger = page.locator(".navigation .nav-btn");
  const languageTrigger = page.getByRole("button", {
    name: "Select language. Current language: English",
  });
  const searchTrigger = page.locator(".navigation .search-btn button");

  await expect(newsLink).toBeVisible();
  await expect(navigationTrigger).toBeHidden();
  await expect(languageTrigger).toBeVisible();
  await expect(languageTrigger.locator(".language-label")).toBeHidden();
  await expect(searchTrigger).toBeVisible();

  for (const width of [805, 1000, 1200, 1201]) {
    await page.setViewportSize({width, height: 700});
    const newsBox = await newsLink.boundingBox();
    const visualizationsBox = await visualizationsLink.boundingBox();
    const logoBox = await logo.boundingBox();
    const aboutBox = await aboutLink.boundingBox();
    const languageBox = await languageTrigger.boundingBox();
    const searchBox = await searchTrigger.boundingBox();
    expect(newsBox).not.toBeNull();
    expect(visualizationsBox).not.toBeNull();
    expect(logoBox).not.toBeNull();
    expect(aboutBox).not.toBeNull();
    expect(languageBox).not.toBeNull();
    expect(searchBox).not.toBeNull();
    expect(visualizationsBox.x - 21).toBeGreaterThanOrEqual(0);
    expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(aboutBox.x - 20);
    expect(newsBox.x + newsBox.width).toBeLessThanOrEqual(languageBox.x);
    expect(languageBox.x + languageBox.width).toBeLessThanOrEqual(searchBox.x);
  }

  watch.assertClean();
});
