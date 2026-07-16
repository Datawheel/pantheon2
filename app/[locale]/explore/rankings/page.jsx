import {cache} from "react";
import Explore from "@/features/Explore";
import {BASE_API, PUBLIC_API, REVALIDATE_PERIODS} from "@/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {buildCanonical, buildLanguageAlternates} from "@/app/utils/hreflang";
import {safeFetchJson} from "@/app/utils/safeFetch";
import {
  buildNestedOccupations,
  buildNestedPlaces,
  buildRankingsMetadata,
  localizeExploreOccupations,
  localizeExplorePlaces,
  parseRankingsSearchParams,
} from "@/lib/rankings";

const getPlaces = cache(async function getPlaces(locale) {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,localized_country:translations->${locale}->>country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died&num_born=gte.5`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
});

const getOccupations = cache(async function getOccupations(locale) {
  const url = `${BASE_API}/occupation?select=id,occupation,localized_occupation:translations->${locale}->>occupation,industry,localized_industry:translations->${locale}->>industry,domain,localized_domain:translations->${locale}->>domain,group,num_born,num_born_men,num_born_women,hpi,l,occupation_slug,industry_slug,domain_slug,group_slug,hpi_avg&order=num_born.desc.nullslast`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
});

export async function generateMetadata(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = SUPPORTED_LOCALES.includes(params?.locale)
    ? params.locale
    : DEFAULT_LOCALE;

  const [rawPlaces, rawOccupations] = await Promise.all([
    getPlaces(locale),
    getOccupations(locale),
  ]);
  const places = localizeExplorePlaces(rawPlaces, locale);
  const occupations = localizeExploreOccupations(rawOccupations, locale);
  const nestedPlaces = buildNestedPlaces(places);
  const nestedOccupations = buildNestedOccupations(occupations, locale);
  const initialExploreState = parseRankingsSearchParams(searchParams, occupations);
  const metadata = buildRankingsMetadata(
    initialExploreState,
    nestedPlaces,
    nestedOccupations,
    locale,
  );

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: buildCanonical(locale, metadata.canonicalPath),
      languages: buildLanguageAlternates(metadata.canonicalPath),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const locale = SUPPORTED_LOCALES.includes(params?.locale)
    ? params.locale
    : DEFAULT_LOCALE;
  const [rawPlaces, rawOccupations] = await Promise.all([
    getPlaces(locale),
    getOccupations(locale),
  ]);
  const places = localizeExplorePlaces(rawPlaces, locale);
  const occupations = localizeExploreOccupations(rawOccupations, locale);
  const nestedPlaces = buildNestedPlaces(places);
  const initialExploreState = parseRankingsSearchParams(searchParams, occupations);

  return (
    <div className="explore">
      <Explore
        baseApi={PUBLIC_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="rankings"
        locale={locale}
        initialExploreState={initialExploreState}
      />
      <div className="explore-body"></div>
    </div>
  );
}
