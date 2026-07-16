import {expect, test} from "@playwright/test";
import {getExploreTranslations} from "../../app/exploreTranslations.js";
import {attachErrorWatch, goto} from "./helpers.js";

const LOCALES = [
  "ar", "zh", "nl", "en", "fr", "de", "hu",
  "it", "ja", "pl", "pt", "ru", "es",
];

test.describe.configure({mode: "serial"});

function localePath(locale, path) {
  return locale === "en" ? path : `/${locale}${path}`;
}

async function assertSocialImage(page, {kind, locale, title}) {
  const ogImage = page.locator('meta[property="og:image"]').first();
  await expect(ogImage).toHaveAttribute("content", /\/api\/screenshot\/explore\?/);
  const content = await ogImage.getAttribute("content");
  const url = new URL(content);
  expect(url.origin).toBe("https://pantheon.world");
  expect(url.searchParams.get("locale")).toBe(locale);
  expect(url.searchParams.get("kind")).toBe(kind);
  expect(url.searchParams.get("title")).toBe(title);
  await expect(page.locator('meta[property="og:image:width"]').first())
    .toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]').first())
    .toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:type"]').first())
    .toHaveAttribute("content", "image/png");
  await expect(page.locator('meta[property="og:image:alt"]').first())
    .toHaveAttribute("content", title);
  await expect(page.locator('meta[name="twitter:card"]'))
    .toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:image"]').first())
    .toHaveAttribute("content", content);
}

for (const locale of LOCALES) {
  test(`explore pages use the ${locale} locale`, async ({page}) => {
    const t = getExploreTranslations(locale);
    const subject = locale === "en" ? "people" : t("people");
    const heading = t("memorableSubject", {
      subject,
      location: "",
    }).replace(/\s+/g, " ").trim();
    const vizHeading = t("occupationsOf", {
      subject,
      location: "",
    }).replace(/\s+/g, " ").trim();
    const watch = attachErrorWatch(page);

    await page.route("https://api.pantheon.world/person_ranks**", route =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {"content-range": "0-0/0"},
        body: "[]",
      })
    );

    await goto(page, localePath(locale, "/explore/rankings"));
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      locale === "ar" ? "rtl" : "ltr",
    );
    await expect(page.locator("h1.explore-title")).toHaveText(heading);
    await expect(page.locator(".explore-controls")).toContainText(
      t("groupPeopleBy"),
    );
    await expect(page).toHaveTitle(`${heading} | ${t("pantheonRankings")}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://pantheon.world${localePath(locale, "/explore/rankings")}`,
    );
    await assertSocialImage(page, {
      kind: "rankings",
      locale,
      title: heading,
    });

    await goto(page, localePath(locale, "/explore/viz"));
    await expect(page.locator("h1.explore-title")).toHaveText(vizHeading);
    await expect(page.locator(".explore-controls")).toContainText(t("makeA"));
    await expect(page.locator(".explore-viz-container")).toContainText(
      t("noDataFound"),
    );
    await expect(page).toHaveTitle(t("vizMetaTitle"));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://pantheon.world${localePath(locale, "/explore/viz")}`,
    );
    await assertSocialImage(page, {
      kind: "viz",
      locale,
      title: t("vizMetaTitle"),
    });

    await goto(page, localePath(locale, "/explore/viz/embed"));
    await expect(page.locator("h1.explore-title")).toHaveText(vizHeading);
    await expect(page.locator(".explore-viz-container")).toContainText(
      t("noDataFound"),
    );
    await expect(page.locator('meta[name="robots"]'))
      .toHaveAttribute("content", /noindex/i);
    await assertSocialImage(page, {
      kind: "viz",
      locale,
      title: t("vizMetaTitle"),
    });

    watch.assertClean();
  });
}

test("explore selectors use localized API taxonomy labels", async ({page}) => {
  await page.route("https://api.pantheon.world/person_ranks**", route =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {"content-range": "0-0/0"},
      body: "[]",
    })
  );
  await goto(page, "/es/explore/rankings");

  await expect(page.locator(".prof-control select")).toContainText("Compositor");
  await expect(page.locator(".place-control select").first()).toContainText(
    "Arabia Saudí",
  );
});

for (const locale of ["es", "ru", "zh", "ja", "ar"]) {
  test(`explore OG image renders localized ${locale} text`, async ({request, baseURL}) => {
    const t = getExploreTranslations(locale);
    const imageUrl = new URL("/api/screenshot/explore", baseURL);
    imageUrl.searchParams.set("locale", locale);
    imageUrl.searchParams.set("kind", "viz");
    imageUrl.searchParams.set("title", t("vizMetaTitle"));
    imageUrl.searchParams.set("subtitle", t("vizMetaDescription"));

    const response = await request.get(`${imageUrl.pathname}${imageUrl.search}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect(response.headers()["cache-control"]).toContain("s-maxage");
    expect(response.headers()["x-og-locale"]).toBe(locale);
    expect(response.headers()["x-og-kind"]).toBe("viz");
    expect((await response.body()).byteLength).toBeGreaterThan(5_000);
  });
}
