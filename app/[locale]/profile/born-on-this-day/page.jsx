import {redirect} from "next/navigation";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";

export async function generateMetadata(props) {
  const params = await props.params;
  const {locale} = params;
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  return {
    title: t.bornOnThisDay?.famousBirthdaysTodayTitle || "Famous Birthdays Today | Pantheon",
    description:
      t.bornOnThisDay?.famousBirthdaysTodayDescription ||
      "Discover which famous people were born on this day in history. Explore birthdays of celebrities, historical figures, scientists, artists, and more.",
    alternates: {
      canonical: buildCanonical(lang, "/profile/born-on-this-day"),
      languages: buildLanguageAlternates("/profile/born-on-this-day"),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {locale} = params;
  // Get today's date in MM-DD format
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayStr = `${month}-${day}`;

  // Redirect to today's date page
  const localePrefix = locale && locale !== "en" ? `/${locale}` : "";
  redirect(`${localePrefix}/profile/born-on-this-day/${todayStr}`);
}
