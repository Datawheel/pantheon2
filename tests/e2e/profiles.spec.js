import {test, expect} from "@playwright/test";
import {
  attachErrorWatch,
  goto,
  expectProfileLoaded,
  firstHref,
  discoverSlug,
} from "./helpers.js";

const OCC_DETAIL = /\/profile\/occupation\/[^/?#]+$/;
const COUNTRY_DETAIL = /\/profile\/country\/[^/?#]+$/;

/**
 * Entity DETAIL pages — the core content of the site. Each asserts
 * <h1 class="profile-name"> rendered with real (non-empty) data, which proves
 * the server-side fetch actually returned something (safeFetch would otherwise
 * leave a 200 page with an empty shell).
 */

// Known-stable person slugs (from app/not-found.jsx suggestions).
const PEOPLE = [
  {slug: "Isaac_Newton", name: "Isaac Newton"},
  {slug: "Vincent_van_Gogh", name: "Vincent van Gogh"},
];

for (const {slug, name} of PEOPLE) {
  test(`person: ${slug}`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, `/profile/person/${slug}`);
    await expectProfileLoaded(page);
    await expect(page.locator("h1.profile-name")).toHaveText(name, {timeout: 10_000});
    watch.assertClean();
  });
}

test("person carousel uses the film director occupation fallback", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/person/Maizie_Williams");
  await expectProfileLoaded(page);

  const martinBrestCard = page.locator(".rank-list li").filter({
    has: page.getByRole("heading", {name: "Martin Brest", exact: true}),
  }).first();
  const image = martinBrestCard.locator("img");

  await expect(martinBrestCard).toBeVisible();
  await expect(image).toHaveAttribute(
    "src",
    "/images/fallback/fallback-film-director-m.webp",
  );
  await expect(image).toHaveClass(/is-occupation-fallback/);
  watch.assertClean();
});

/**
 * Discover a detail page from each index, then verify it loads with data.
 * Avoids hardcoding slug formats and also validates index→detail links.
 */
const DISCOVERED = [
  {name: "occupation", index: "/profile/occupation", detail: /\/profile\/occupation\/[^/?#]+$/},
  {name: "country", index: "/profile/country", detail: /\/profile\/country\/[^/?#]+$/},
  {name: "place", index: "/profile/place", detail: /\/profile\/place\/[^/?#]+$/},
  {name: "era", index: "/profile/era", detail: /\/profile\/era\/[^/?#]+$/},
];

for (const {name, index, detail} of DISCOVERED) {
  test(`${name}: discovered detail page`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, index);
    const href = await firstHref(page, detail);
    expect(href, `No ${name} detail link found on ${index}`).not.toBeNull();
    await goto(page, href);
    await expectProfileLoaded(page);
    watch.assertClean();
  });
}

// /profile/deaths redirects to the app's canonical year, so this stays correct
// even if that year changes. (Unsupported years 404 — see errors.spec.js.)
test("deaths: canonical year", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/deaths");
  await expectProfileLoaded(page);
  watch.assertClean();
});

// Date segment is MM-DD (app/[locale]/profile/born-on-this-day/[date]).
test("born-on-this-day: 01-15", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/born-on-this-day/01-15");
  await expectProfileLoaded(page);
  watch.assertClean();
});

/**
 * Cascading sub-routes. The `→ country` variants aren't reachable via <a> links
 * (deaths→country is a <select>), so we discover real slugs from the index pages
 * and build the URL directly. Self-skip if a given data combo has no page.
 */
test("cascade: deaths → occupation", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/deaths");
  const href = await firstHref(page, /\/profile\/deaths\/\d+\/occupation\/[^/?#]+$/);
  test.skip(!href, "No deaths→occupation link on the deaths page");
  await goto(page, href);
  await expectProfileLoaded(page);
  watch.assertClean();
});

test("cascade: occupation → country", async ({page}) => {
  const watch = attachErrorWatch(page);
  const occ = await discoverSlug(page, "/profile/occupation", OCC_DETAIL);
  const country = await discoverSlug(page, "/profile/country", COUNTRY_DETAIL);
  expect(occ, "could not discover an occupation slug").toBeTruthy();
  expect(country, "could not discover a country slug").toBeTruthy();
  const res = await page.goto(`/profile/occupation/${occ}/country/${country}`, {
    waitUntil: "domcontentloaded",
  });
  test.skip(res.status() >= 400, `no page for ${occ} × ${country}`);
  await expect(page.locator("h2.error-msg")).toHaveCount(0);
  await expectProfileLoaded(page);
  watch.assertClean();
});

test("occupation-country overlapping lives includes living people", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/occupation/film-director/country/brazil");

  const section = page.locator("section", {
    has: page.locator("#overlapping-lives"),
  });

  await expect(section).toBeVisible();
  await expect(section.locator(".section-body > p")).toContainText(
    "10 most globally memorable Film Directors",
  );
  await expect(
    section.getByRole("img", {name: "Lifespans of the Top 10 Film Directors"}),
  ).toBeVisible();
  watch.assertClean();
});

test("cascade: deaths → country", async ({page}) => {
  const watch = attachErrorWatch(page);
  await goto(page, "/profile/deaths"); // redirects to the canonical year
  const year = page.url().match(/\/deaths\/(\d+)/)?.[1];
  expect(year, "could not determine canonical deaths year").toBeTruthy();
  const country = await discoverSlug(page, "/profile/country", COUNTRY_DETAIL);
  expect(country, "could not discover a country slug").toBeTruthy();
  const res = await page.goto(`/profile/deaths/${year}/country/${country}`, {
    waitUntil: "domcontentloaded",
  });
  test.skip(res.status() >= 400, `no page for deaths ${year} × ${country}`);
  await expect(page.locator("h2.error-msg")).toHaveCount(0);
  await expectProfileLoaded(page);
  watch.assertClean();
});
