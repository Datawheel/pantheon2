import {nest} from "d3-collection";
import Explore from "@/features/Explore";
import {PUBLIC_API} from "@/app/constants";
import {getExploreTranslations} from "@/app/exploreTranslations";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {buildCanonical, buildLanguageAlternates} from "@/app/utils/hreflang";
import {
  localizeExploreOccupations,
  localizeExplorePlaces,
} from "@/lib/rankings";
import {getPlaces, getOccupations} from "./data";

export async function generateMetadata({params}) {
  const {locale: requestedLocale} = await params;
  const locale = SUPPORTED_LOCALES.includes(requestedLocale)
    ? requestedLocale
    : DEFAULT_LOCALE;
  const t = getExploreTranslations(locale);
  const canonicalPath = "/explore/viz";
  return {
    title: t("vizMetaTitle"),
    description: t("vizMetaDescription"),
    alternates: {
      canonical: buildCanonical(locale, canonicalPath),
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title: t("vizMetaTitle"),
      description: t("vizMetaDescription"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("vizMetaTitle"),
      description: t("vizMetaDescription"),
    },
  };
}

export default async function Page({params}) {
  const {locale: requestedLocale} = await params;
  const locale = SUPPORTED_LOCALES.includes(requestedLocale)
    ? requestedLocale
    : DEFAULT_LOCALE;
  const [rawPlaces, rawOccupations] = await Promise.all([
    getPlaces(locale),
    getOccupations(locale),
  ]);
  const places = localizeExplorePlaces(rawPlaces, locale);
  const occupations = localizeExploreOccupations(rawOccupations, locale);
  const nestedPlaces = nest()
    .key(d => d.country_id)
    .entries(places)
    .map(countryData => ({
      country: countryData.values[0].country,
      cities: countryData.values,
    }))
    .filter(countryData => countryData.country);

  return (
    <div className="explore">
      <Explore
        baseApi={PUBLIC_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="viz"
        locale={locale}
      />
      <div className="explore-body"></div>
    </div>
  );
}
