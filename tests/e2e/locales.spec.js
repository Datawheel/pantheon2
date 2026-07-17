import {test, expect} from "@playwright/test";
import {getTranslations} from "@/app/translations";
import {attachErrorWatch, goto, expectProfileLoaded, expectContent} from "./helpers.js";

/**
 * i18n spot-check. localePrefix is "as-needed" (i18n/routing.js): English has
 * no prefix; other locales are prefixed (/fr, /es, ...). These catch broken
 * next-intl message loading and locale routing on a few representative pages.
 */
const PROFILE_LOCALES = [
  {locale: "fr", path: "/fr/profile/person/Isaac_Newton"},
  {locale: "de", path: "/de/profile/deaths/2024"},
  {locale: "es", path: "/es/profile/person/Michael_Ronda"},
];

for (const {locale, path} of PROFILE_LOCALES) {
  test(`locale ${locale}: profile loads (${path})`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, path);
    await expectProfileLoaded(page);
    watch.assertClean();
  });
}

const CONTENT_LOCALES = [
  {locale: "es", path: "/es"},
  {locale: "ja", path: "/ja/profile/occupation"},
];

for (const {locale, path} of CONTENT_LOCALES) {
  test(`locale ${locale}: page loads (${path})`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, path);
    await expectContent(page);
    watch.assertClean();
  });
}

test("Japanese homepage localizes person names outside trends", async ({
  page,
  request,
}) => {
  const locale = "ja";
  const t = getTranslations(locale);
  const watch = attachErrorWatch(page);
  await goto(page, `/${locale}`);

  const sectionTitles = [
    t.home.bornTodayTitle,
    t.home.recentPassings,
    t.home.recentlyAdded,
  ];
  let translatedNames = 0;

  for (const sectionTitle of sectionTitles) {
    const section = page.locator(".profile-grid").filter({
      has: page.locator(".grid-title", {hasText: sectionTitle}),
    });
    const card = section.locator(".grid-row > .grid-box").first();
    await expect(card, `${sectionTitle} should show at least one person`).toBeVisible();

    const href = await card.locator("a").getAttribute("href");
    const slug = decodeURIComponent(
      new URL(href, "https://pantheon.world").pathname.split("/").pop(),
    );
    const personUrl = new URL("https://api.pantheon.world/person");
    personUrl.searchParams.set("slug", `eq.${slug}`);
    personUrl.searchParams.set("select", "name,translations");
    const response = await request.get(personUrl.toString());
    expect(response.ok(), `Person lookup failed for ${slug}`).toBe(true);
    const [person] = await response.json();
    expect(person, `No person returned for ${slug}`).toBeTruthy();

    const expectedName = person.translations?.[locale] || person.name;
    if (expectedName !== person.name) translatedNames += 1;
    await expect(card.locator(".grid-box-title-container"))
      .toContainText(expectedName);
    await expect(card.getByRole("img"))
      .toHaveAttribute("alt", `Photo of ${expectedName}`);
  }

  expect(
    translatedNames,
    "Test data should include at least one Japanese name translation",
  ).toBeGreaterThan(0);
  watch.assertClean();
});
