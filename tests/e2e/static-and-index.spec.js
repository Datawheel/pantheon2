import {test, expect} from "@playwright/test";
import {attachErrorWatch, goto, expectContent, firstHref} from "./helpers.js";

/**
 * Static pages and entity index/landing pages.
 * Each: loads, renders real content, is not the 404 page, and throws no JS errors.
 */
const STATIC_PAGES = [
  {name: "home", path: "/"},
  {name: "explore rankings", path: "/explore/rankings"},
  {name: "explore viz", path: "/explore/viz"},
  {name: "news", path: "/news"},
  {name: "monthly index", path: "/monthly"},
  {name: "recently added", path: "/profile/recently-added"},
  {name: "game: trivia", path: "/game/trivia"},
  {name: "game: birthle", path: "/game/birthle"},
  {name: "game: yearbook", path: "/game/yearbook"},
  {name: "data: api", path: "/data/api"},
  {name: "data: datasets", path: "/data/datasets"},
  {name: "data: faq", path: "/data/faq"},
  {name: "about: privacy", path: "/about/privacy"},
  {name: "about: terms", path: "/about/terms"},
];

for (const {name, path} of STATIC_PAGES) {
  test(`static: ${name} (${path})`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, path);
    await expectContent(page);
    watch.assertClean();
  });
}

/**
 * Entity index pages. Same checks, plus: each must surface at least one working
 * link to a detail page (so the index→detail navigation isn't broken).
 */
const INDEX_PAGES = [
  {name: "person index", path: "/profile/person", detail: /\/profile\/person\/[^/?#]+$/},
  {name: "occupation index", path: "/profile/occupation", detail: /\/profile\/occupation\/[^/?#]+$/},
  {name: "country index", path: "/profile/country", detail: /\/profile\/country\/[^/?#]+$/},
  {name: "place index", path: "/profile/place", detail: /\/profile\/place\/[^/?#]+$/},
  {name: "era index", path: "/profile/era", detail: /\/profile\/era\/[^/?#]+$/},
  {name: "deaths index", path: "/profile/deaths", detail: /\/profile\/deaths\/[^/?#]+$/},
  {name: "born-on-this-day index", path: "/profile/born-on-this-day", detail: null},
];

for (const {name, path, detail} of INDEX_PAGES) {
  test(`index: ${name} (${path})`, async ({page}) => {
    const watch = attachErrorWatch(page);
    await goto(page, path);
    await expectContent(page);
    if (detail) {
      const href = await firstHref(page, detail);
      expect(href, `${path} has no detail-page links matching ${detail}`).not.toBeNull();
    }
    watch.assertClean();
  });
}
