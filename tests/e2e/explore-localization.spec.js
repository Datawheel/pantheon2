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

    await goto(page, localePath(locale, "/explore/viz/embed"));
    await expect(page.locator("h1.explore-title")).toHaveText(vizHeading);
    await expect(page.locator(".explore-viz-container")).toContainText(
      t("noDataFound"),
    );

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
