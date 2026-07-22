// import ProfileNav from "../../../../components/common/Nav";
import {cloneElement} from "react";
import {notFound} from "next/navigation";
import Intro from "@/components/country/Intro";
import Header from "@/components/country/Header";
import PeopleRanking from "@/components/country/sections/PeopleRanking";
import Occupations from "@/components/country/sections/Occupations";
import Places from "@/components/country/sections/Places";
import Lifespans from "@/components/country/sections/Lifespans";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "@/components/utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {
  safeFetchArrayPaged,
  safeFetchJson,
  safeFetchFirst,
} from "@/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {getLocationTranslations} from "@/app/locationTranslations";
import {
  buildLocalizedOccupationMap,
  formatLocationNumber,
  getLocalizedPlaceNameMap,
  localizeCountry,
  localizePeople,
  localizePersonPlaces,
  localizePlace,
  normalizeLocationLocale,
} from "@/app/utils/locationLocalization";

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getCountry(countryId) {
  if (!countryId) {
    return {};
  }
  const url = `${BASE_API}/country?slug=eq.${countryId}`;
  return await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
}

async function getCountryRanks(countryRankLow, countryRankHigh) {
  if (
    !Number.isFinite(Number(countryRankLow)) ||
    !Number.isFinite(Number(countryRankHigh))
  ) {
    return [];
  }
  const url = `${BASE_API}/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleBornHere(countryId, locale) {
  if (!countryId) {
    return [];
  }
  // Paged with a stable id order: big countries (US ~17MB) blow past Next's
  // 2MB data-cache limit as a single fetch and would re-hit PostgREST on
  // every request.
  const url = `${BASE_API}/person?bplace_country=eq.${countryId}&order=id.asc&select=bplace_country(id,country,slug),bplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,localized_name:translations->>${locale},slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchArrayPaged(url, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
}

async function getPeopleBornHereHpi(countryId) {
  if (!countryId) {
    return [];
  }
  const url = `${BASE_API}/person_ranks?bplace_country=eq.${countryId}&order=hpi.desc.nullslast,id.asc&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchArrayPaged(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    12000,
  );
}

async function getPeopleDiedHere(countryId, locale) {
  if (!countryId) {
    return [];
  }
  const url = `${BASE_API}/person?dplace_country=eq.${countryId}&order=id.asc&select=dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,localized_name:translations->>${locale},slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchArrayPaged(url, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
}

async function getPeopleDiedHereHpi(countryId) {
  if (!countryId) {
    return [];
  }
  const url = `${BASE_API}/person_ranks?dplace_country=eq.${countryId}&order=hpi.desc.nullslast,id.asc&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchArrayPaged(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    12000,
  );
}

function getRankWindow(rankValue) {
  const rank = parseInt(rankValue, 10);
  if (!Number.isFinite(rank)) {
    return null;
  }

  return {
    low: Math.max(1, rank - NUM_RANKINGS_PRE),
    high: Math.max(NUM_RANKINGS, rank + NUM_RANKINGS_POST),
  };
}

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const {id, locale} = params;
  const baseUrl = process.env.URL || "https://pantheon.world";
  const lang = normalizeLocationLocale(locale);
  const t = getLocationTranslations(lang);

  // fetch data
  const country = localizeCountry(await getCountry(id), lang);

  if (!country || !country.country) {
    return {title: t("countryNotFound")};
  }

  // Get count of notable people
  const countRes = await fetch(
    `${BASE_API}/person_ranks?bplace_country=eq.${country.id}&select=id`,
    {
      headers: {"Prefer": "count=exact"},
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    },
  );
  const contentRange = countRes.headers.get("content-range");
  let totalCount = 0;
  if (contentRange) {
    const match = contentRange.match(/\/(\d+)/);
    if (match) {
      totalCount = parseInt(match[1], 10);
    }
  }

  const previousImages = (await parent).openGraph?.images || [];

  const count = formatLocationNumber(totalCount, lang);
  const title = t("countryMetaTitle", {count, location: country.country});
  const description = t("countryMetaDescription", {
    count,
    location: country.country,
  });

  return {
    title,
    description,
    keywords: t("countryMetaKeywords", {location: country.country}),
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/screenshot/country?id=${id}&lang=${lang}`,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/api/screenshot/country?id=${id}&lang=${lang}`],
    },
    alternates: {
      canonical: buildCanonical(lang, `/profile/country/${id}`),
      languages: buildLanguageAlternates(`/profile/country/${id}`),
    },
  };
}

async function getTopCities(countryId) {
  if (!countryId) return [];
  const url = `${BASE_API}/place?country=eq.${countryId}&select=id,place,slug,num_born&order=num_born.desc.nullslast&limit=5&num_born=gt.0`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

export default async function Page(props) {
  const params = await props.params;
  const {id, locale} = params;
  const lang = normalizeLocationLocale(locale);
  const t = getLocationTranslations(lang);
  const [rawCountry, occupations] = await Promise.all([
    getCountry(id),
    getOccupations(),
  ]);
  const country = localizeCountry(rawCountry, lang);

  if (!country?.id || !country?.country) {
    notFound();
  }

  // TODO: re-enable once Wikipedia stops 429ing us
  // const [wikiSummary, wikiPageViewsData] = await Promise.all([
  //   getWikiSummary(country.country),
  //   getWikiPageViews(country.country),
  // ]);
  const wikiSummary = null;
  const wikiPageViewsData = [];

  const countryRankWindow = getRankWindow(country?.born_rank_unique);
  const countryRanks = countryRankWindow
    ? await getCountryRanks(countryRankWindow.low, countryRankWindow.high)
    : null;

  let [
    peopleBornHere,
    peopleDiedHere,
    peopleBornHereHpi,
    peopleDiedHereHpi,
    topCities,
  ] = await Promise.all([
    getPeopleBornHere(country.id, lang),
    getPeopleDiedHere(country.id, lang),
    getPeopleBornHereHpi(country.id),
    getPeopleDiedHereHpi(country.id),
    getTopCities(country.id),
  ]);
  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  peopleBornHere = (peopleBornHere || [])
    .map((d, i) => {
      const hpiData = peopleBornHereHpi.find(hpi => hpi.id === d.id);
      return {
        ...d,
        ...(hpiData || {}),
      };
    })
    .sort((personA, personB) => personB.hpi - personA.hpi)
    .map((d, i) => ({
      ...d,
      bplace_country_rank_unique: i + 1,
    }));
  peopleDiedHere = (peopleDiedHere || [])
    .map((d, i) => {
      const hpiData = peopleDiedHereHpi.find(hpi => hpi.id === d.id);
      return {
        ...d,
        ...(hpiData || {}),
      };
    })
    .sort((personA, personB) => personB.hpi - personA.hpi)
    .map((d, i) => ({
      ...d,
      dplace_country_rank_unique: i + 1,
    }));

  const localizedOccupationById = buildLocalizedOccupationMap(
    occupations,
    lang,
  );
  peopleBornHere = localizePeople(
    peopleBornHere,
    lang,
    localizedOccupationById,
  );
  peopleDiedHere = localizePeople(
    peopleDiedHere,
    lang,
    localizedOccupationById,
  );

  const visiblePlaces = [
    ...(topCities || []),
    ...peopleBornHere
      .filter(person =>
        person.birthyear !== null
        && person.bplace_geonameid?.lat != null
        && person.bplace_geonameid?.lon != null,
      )
      .slice(0, 500)
      .map(person => person.bplace_geonameid),
    ...peopleDiedHere
      .filter(person =>
        person.deathyear !== null
        && person.occupation
        && person.dplace_geonameid?.lat != null
        && person.dplace_geonameid?.lon != null,
      )
      .slice(0, 500)
      .map(person => person.dplace_geonameid),
  ];
  const localizedPlaceNames = await getLocalizedPlaceNameMap(
    visiblePlaces,
    lang,
  );
  topCities = (topCities || []).map(place =>
    localizePlace(place, localizedPlaceNames),
  );
  peopleBornHere = localizePersonPlaces(peopleBornHere, localizedPlaceNames);
  peopleDiedHere = localizePersonPlaces(peopleDiedHere, localizedPlaceNames);

  const localizedCountryRanks = countryRanks
    ? countryRanks.map(rankCountry => localizeCountry(rankCountry, lang))
    : null;

  const attrs = [...localizedOccupationById.values()].reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const sections = [
    {
      slug: "people",
      title: t("people"),
      content: (
        <PeopleRanking
          country={country}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
          lang={lang}
        />
      ),
    },
    {
      slug: "occupations",
      title: t("occupations"),
      content: (
        <Occupations
          attrs={attrs}
          country={country}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
          lang={lang}
        />
      ),
    },
    {
      slug: "places",
      title: t("places"),
      content: (
        <Places
          country={country}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
          lang={lang}
        />
      ),
    },
    {
      slug: "overlapping-lives",
      title: t("overlappingLives"),
      content: (
        <Lifespans
          attrs={attrs}
          country={country}
          peopleBorn={peopleBornHere}
          lang={lang}
        />
      ),
    },
    // {slug: "living-people", title: "Living People"}
  ];

  return (
    <div className="person">
      <Header country={country} wikiPageViews={wikiPageViewsData} lang={lang} />
      <div className="about-section">
        {/* <ProfileNav sections={sections} /> */}
        <Intro
          country={country}
          countryRanks={localizedCountryRanks}
          peopleBornHere={peopleBornHere}
          peopleDiedHere={peopleDiedHere}
          topCities={topCities}
          wikiSummary={wikiSummary}
          lang={lang}
        />
      </div>
      {sections.map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        }),
      )}
    </div>
  );
}
