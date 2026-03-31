import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";

const SITE_URL = "https://pantheon.world";

/**
 * Build hreflang alternates for Next.js metadata.
 * Returns an object suitable for `metadata.alternates.languages`.
 *
 * @param {string} path - The path without locale prefix, e.g. "/profile/person/some-slug"
 * @returns {object} - { "x-default": url, "en": url, "fr": url, ... }
 */
export function buildLanguageAlternates(path) {
  const languages = {
    "x-default": `${SITE_URL}${path}`,
  };
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === DEFAULT_LOCALE) {
      languages[locale] = `${SITE_URL}${path}`;
    } else {
      languages[locale] = `${SITE_URL}/${locale}${path}`;
    }
  }
  return languages;
}
