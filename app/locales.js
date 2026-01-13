// Supported language/locale codes
// Used across the application for i18n, Wikipedia language editions, etc.
export const SUPPORTED_LOCALES = [
  "ar", // Arabic
  "zh", // Chinese
  "nl", // Dutch
  "en", // English
  "fr", // French
  "de", // German
  "hu", // Hungarian
  "it", // Italian
  "ja", // Japanese
  "pl", // Polish
  "pt", // Portuguese
  "ru", // Russian
  "es", // Spanish
];

// Language display names for UI (in English)
export const LOCALE_NAMES = {
  ar: "Arabic",
  zh: "Chinese",
  nl: "Dutch",
  en: "English",
  fr: "French",
  de: "German",
  hu: "Hungarian",
  it: "Italian",
  ja: "Japanese",
  pl: "Polish",
  pt: "Portuguese",
  ru: "Russian",
  es: "Spanish",
};

// Native language names (endonyms)
export const LOCALE_NATIVE_NAMES = {
  ar: "العربية",
  zh: "中文",
  nl: "Nederlands",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  hu: "Magyar",
  it: "Italiano",
  ja: "日本語",
  pl: "Polski",
  pt: "Português",
  ru: "Русский",
  es: "Español",
};

export const DEFAULT_LOCALE = "en";

/**
 * Get localized language name using Intl.DisplayNames API
 * @param {string} langCode - The language code to translate (e.g., "en", "fr")
 * @param {string} displayLang - The language to display the name in (e.g., "pt" for Portuguese)
 * @returns {string} - The translated language name
 *
 * Examples:
 *   getLocalizedLanguageName("en", "pt") => "inglês"
 *   getLocalizedLanguageName("fr", "es") => "francés"
 *   getLocalizedLanguageName("ja", "en") => "Japanese"
 */
export function getLocalizedLanguageName(langCode, displayLang = "en") {
  try {
    const displayNames = new Intl.DisplayNames([displayLang], { type: "language" });
    return displayNames.of(langCode);
  } catch (error) {
    // Fallback to native name if Intl fails
    return LOCALE_NATIVE_NAMES[langCode] || LOCALE_NAMES[langCode] || langCode;
  }
}
