import {test} from "@playwright/test";
import {attachErrorWatch, goto, expectProfileLoaded, expectContent} from "./helpers.js";

/**
 * i18n spot-check. localePrefix is "as-needed" (i18n/routing.js): English has
 * no prefix; other locales are prefixed (/fr, /es, ...). These catch broken
 * next-intl message loading and locale routing on a few representative pages.
 */
const PROFILE_LOCALES = [
  {locale: "fr", path: "/fr/profile/person/Isaac_Newton"},
  {locale: "de", path: "/de/profile/deaths/2024"},
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
