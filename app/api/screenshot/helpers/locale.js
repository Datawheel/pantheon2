import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";

export {SUPPORTED_LOCALES, DEFAULT_LOCALE};

export function normalizeLocale(locale) {
  return (locale || DEFAULT_LOCALE).toLowerCase().split("-")[0].split("_")[0];
}

export function getSupportedLocale(locale) {
  const normalized = normalizeLocale(locale);
  return SUPPORTED_LOCALES.includes(normalized) ? normalized : DEFAULT_LOCALE;
}

export function isArabicLocale(locale) {
  return getSupportedLocale(locale) === "ar";
}
