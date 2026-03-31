import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";

const SITE_URL = "https://pantheon.world";

/**
 * Build a canonical URL for the given locale and path.
 * English (default) gets no prefix; other locales get /{locale}/ prefix.
 *
 * @param {string} locale - Current locale, e.g. "en", "ja"
 * @param {string} path - The path without locale prefix, e.g. "/profile/person/some-slug"
 * @returns {string}
 */
export function buildCanonical(locale, path) {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

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
