import {test, expect} from "@playwright/test";
import {getTranslations} from "@/app/translations";
import {
  getLocationLocaleMessages,
  getLocationMessageKeys,
} from "@/app/locationTranslations";
import {
  getDeathsLocaleMessages,
  getDeathsMessageKeys,
  getDeathsTranslations,
} from "@/app/deathsTranslations";
import {SUPPORTED_LOCALES} from "@/app/locales";
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

test("Chinese person landing page localizes featured and domain names", async ({
  page,
  request,
}) => {
  const locale = "zh";
  const t = getTranslations(locale);
  const watch = attachErrorWatch(page);
  await goto(page, `/${locale}/profile/person`);

  const featuredSection = page.locator(".sp-section").filter({
    has: page.locator(".sp-section-title", {hasText: t.selectPerson.featuredPeople}),
  });
  const cards = [
    featuredSection.locator(".sp-card").first(),
    page.locator(".sp-domain-item").first(),
  ];
  let translatedNames = 0;

  for (const card of cards) {
    await expect(card).toBeVisible();
    const href = await card.getAttribute("href");
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
    await expect(card.locator(".sp-card-name, .sp-domain-name"))
      .toHaveText(expectedName);
    await expect(card.getByRole("img"))
      .toHaveAttribute("alt", expectedName);
  }

  expect(
    translatedNames,
    "Test data should include at least one Chinese name translation",
  ).toBeGreaterThan(0);
  watch.assertClean();
});

test("location profile copy covers every supported locale", () => {
  const requiredKeys = getLocationMessageKeys();

  for (const locale of SUPPORTED_LOCALES) {
    const localeMessages = getLocationLocaleMessages(locale);
    expect(localeMessages, `${locale} must have location profile messages`)
      .toBeTruthy();
    const missing = requiredKeys.filter(key => !localeMessages[key]);
    expect(missing, `${locale} is missing: ${missing.join(", ")}`).toEqual([]);
  }
});

test("deaths page copy covers every supported locale", () => {
  const requiredKeys = getDeathsMessageKeys();

  for (const locale of SUPPORTED_LOCALES) {
    const localeMessages = getDeathsLocaleMessages(locale);
    expect(localeMessages, `${locale} must have deaths page messages`)
      .toBeTruthy();
    const missing = requiredKeys.filter(key => !localeMessages[key]);
    expect(missing, `${locale} is missing: ${missing.join(", ")}`).toEqual([]);
  }
});

test("Chinese deaths page localizes copy, entities, dates, links, and metadata", async ({
  page,
  request,
}) => {
  const locale = "zh";
  const year = "2026";
  const t = getDeathsTranslations(locale);
  const watch = attachErrorWatch(page);
  await goto(page, `/${locale}/profile/deaths/${year}`);

  await expect(page).toHaveTitle(t("metaTitle", {year}));
  await expect(page.locator(".hero .profile-type")).toHaveText(t("header"));
  await expect(page.locator(".profile-nav-link-title"))
    .toHaveText([t("people"), t("deathsByMonth")]);
  await expect(page.locator("label[for='occupation-select']"))
    .toHaveText(t("filterOccupation"));
  await expect(page.locator("#occupation-select option").first())
    .toHaveText(t("allOccupations"));
  await expect(page.locator("label[for='country-select']"))
    .toHaveText(t("filterCountry"));
  await expect(page.locator("#country-select option").first())
    .toHaveText(t("allCountries"));

  const firstCard = page.locator(".profile-section .person-card").first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard).toHaveAttribute("href", /^\/zh\/profile\/person\//);
  await expect(firstCard.locator(".person-card__dates"))
    .toContainText(`${year}年`);
  await expect(firstCard.locator(".person-card__age")).toContainText("享年");

  const personHref = await firstCard.getAttribute("href");
  const slug = decodeURIComponent(personHref.split("/").filter(Boolean).pop());
  const personUrl = new URL("https://api.pantheon.world/person");
  personUrl.searchParams.set("slug", `eq.${slug}`);
  personUrl.searchParams.set("select", "name,translations");
  const personResponse = await request.get(personUrl.toString());
  expect(personResponse.ok()).toBe(true);
  const [person] = await personResponse.json();
  expect(person).toBeTruthy();
  await expect(firstCard.locator(".person-card__name"))
    .toHaveText(person.translations?.[locale] || person.name);

  await expect(page.locator(".month-section h3").first())
    .toContainText(`${year}年`);
  await expect(page.locator("meta[name='description']"))
    .toHaveAttribute("content", t("metaDescription", {year}));
  const ogImage = page.locator("meta[property='og:image']");
  await expect(ogImage)
    .toHaveAttribute("content", /\/api\/screenshot\/deaths\?year=2026&lang=zh/);
  const ogResponse = await request.get(await ogImage.getAttribute("content"));
  expect(ogResponse.ok()).toBe(true);
  expect(ogResponse.headers()["content-type"]).toContain("image/png");

  const body = await page.locator("body").innerText();
  expect(body).not.toContain("Celebrity Deaths");
  expect(body).not.toContain("Deaths by Month");
  expect(body).not.toContain("Filter by Occupation");
  expect(body).not.toContain("All Countries");
  watch.assertClean();
});

test("Chinese place profile localizes entities, copy, links, and metadata", async ({
  page,
  request,
}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/zh/profile/place/washington-dc");
  await expectProfileLoaded(page);

  await expect(page.locator("h1.profile-name"))
    .toContainText("华盛顿哥伦比亚特区");
  await expect(page.locator(".top-desc")).toHaveText("文化产出地");
  await expect(page.locator(".profile-type")).toHaveText("现今");
  await expect(page).toHaveTitle(/来自华盛顿哥伦比亚特区/);
  await expect(page.locator(".rank-title h3").first())
    .toContainText("出生于现今华盛顿哥伦比亚特区境内的人物");
  await expect(page.locator(".rank-list h2").first()).toHaveText("阿尔·戈尔");
  await expect(page.locator("a[href^='/zh/profile/person/']").first())
    .toHaveAttribute("href", /^\/zh\/profile\/person\//);
  await expect(page.locator(".rank-title a[href^='/zh/explore/rankings']").first())
    .toHaveText("查看全部排名");

  const ogUrl = await page.locator("meta[property='og:image']")
    .getAttribute("content");
  expect(ogUrl).toContain("/api/screenshot/place?id=washington-dc&lang=zh");
  const ogResponse = await request.get(ogUrl);
  expect(ogResponse.ok()).toBe(true);
  expect(ogResponse.headers()["content-type"]).toContain("image/png");
  watch.assertClean();
});

test("Dutch country profile localizes entities, copy, links, and metadata", async ({
  page,
  request,
}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/nl/profile/country/france");
  await expectProfileLoaded(page);

  await expect(page.locator("h1.profile-name")).toHaveText("Frankrijk");
  await expect(page.locator(".top-desc")).toHaveText("Culturele productie in");
  await expect(page.locator(".profile-type")).toHaveText("Heden");
  await expect(page).toHaveTitle(/beroemde mensen uit Frankrijk/);
  await expect(page.locator(".rank-title h3").first())
    .toHaveText("Mensen geboren in het huidige Frankrijk");
  await expect(page.locator(".rank-list h2").first())
    .toHaveText("Napoleon Bonaparte");
  await expect(page.locator("a[href^='/nl/profile/person/']").first())
    .toHaveAttribute("href", /^\/nl\/profile\/person\//);
  await expect(page.locator(".rank-title a[href^='/nl/explore/rankings']").first())
    .toHaveText("Bekijk alle ranglijsten");

  const ogUrl = await page.locator("meta[property='og:image']")
    .getAttribute("content");
  expect(ogUrl).toContain("/api/screenshot/country?id=france&lang=nl");
  const ogResponse = await request.get(ogUrl);
  expect(ogResponse.ok()).toBe(true);
  expect(ogResponse.headers()["content-type"]).toContain("image/png");
  watch.assertClean();
});

test("Arabic location profiles and social cards render localized RTL text", async ({
  page,
  request,
}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/ar/profile/place/washington-dc");
  await expectProfileLoaded(page);

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1.profile-name")).toContainText("واشنطن العاصمة");
  await expect(page.locator(".top-desc")).toHaveText("الإنتاج الثقافي في");
  await expect(page.locator(".intro-section a[href='/ar/profile/place/boston']"))
    .toHaveText("بوسطن");
  await expect(page).toHaveTitle(/مشاهير واشنطن العاصمة/);

  for (const screenshotPath of [
    "/api/screenshot/place?id=washington-dc&lang=ar",
    "/api/screenshot/country?id=france&lang=ar",
  ]) {
    const response = await request.get(screenshotPath);
    expect(response.ok(), `${screenshotPath} should render`).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  watch.assertClean();
});
