import {defineRouting} from "next-intl/routing";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "../app/locales";

export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
});
