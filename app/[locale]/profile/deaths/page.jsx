import {redirect} from "next/navigation";
import {DEFAULT_LOCALE} from "@/app/locales";
import {normalizeDeathsLocale} from "@/app/utils/deaths";

export default async function Page(props) {
  const params = await props.params;
  const locale = normalizeDeathsLocale(params.locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  redirect(`${localePrefix}/profile/deaths/${new Date().getFullYear()}`);
}
