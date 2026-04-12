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
  parseRankingsSearchParams,
} from "@/lib/rankings";

const getPlaces = cache(async function getPlaces() {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
});

const getOccupations = cache(async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
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

  const [places, occupations] = await Promise.all([
    getPlaces(),
    getOccupations(),
  ]);
  const nestedPlaces = buildNestedPlaces(places);
  const nestedOccupations = buildNestedOccupations(occupations);
  const initialExploreState = parseRankingsSearchParams(searchParams, occupations);
  const metadata = buildRankingsMetadata(
    initialExploreState,
    nestedPlaces,
    nestedOccupations,
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
  const searchParams = await props.searchParams;
  const [places, occupations] = await Promise.all([
    getPlaces(),
    getOccupations(),
  ]);
  const nestedPlaces = buildNestedPlaces(places);
  const initialExploreState = parseRankingsSearchParams(searchParams, occupations);

  return (
    <div className="explore">
      <Explore
        baseApi={PUBLIC_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="rankings"
        initialExploreState={initialExploreState}
      />
      <div className="explore-body"></div>
    </div>
  );
}
