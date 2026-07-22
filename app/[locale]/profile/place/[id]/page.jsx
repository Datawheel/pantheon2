import {cloneElement} from "react";
import {notFound} from "next/navigation";
import ProfileNav from "../../../../../components/common/Nav";
import Intro from "../../../../../components/place/Intro";
import Header from "../../../../../components/place/Header";
import PeopleRanking from "../../../../../components/place/sections/PeopleRanking";
import Occupations from "../../../../../components/place/sections/Occupations";
import Places from "../../../../../components/place/sections/Places";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../../../../../components/utils/consts";
import Lifespans from "../../../../../components/place/sections/Lifespans";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchJson, safeFetchFirst} from "@/app/utils/safeFetch";
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

async function getWikiSummary(placeName) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`,
      {
        headers: {
          "User-Agent":
            "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent":
            "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      },
    );
    if (!res.ok) {
      console.error(`[getWikiSummary] HTTP ${res.status} for: ${placeName}`);
      return null;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(
        `[getWikiSummary] Got HTML instead of JSON for: ${placeName}`,
      );
      return null;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getWikiSummary] Error for ${placeName}: ${e.message}`);
    return null;
  }
}

async function getWikiPageViews(placeName) {
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2",
  );
  try {
    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(placeName)}/monthly/20110101/${year}${month}01`,
      {
        headers: {
          "User-Agent":
            "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent":
            "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      },
    );
    if (!res.ok) {
      console.error(`[getWikiPageViews] HTTP ${res.status} for: ${placeName}`);
      return {items: null};
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(
        `[getWikiPageViews] Got HTML instead of JSON for: ${placeName}`,
      );
      return {items: null};
    }
    const data = JSON.parse(text);
    if (data.items) {
      const currentYearMonth = `${year}${month}`;
      data.items = data.items.filter(item => {
        const itemYearMonth = item.timestamp.substring(0, 6);
        return itemYearMonth !== currentYearMonth;
      });
    }
    return data;
  } catch (e) {
    console.error(`[getWikiPageViews] Error for ${placeName}: ${e.message}`);
    return {items: null};
  }
}

async function getPlace(id) {
  const url = `${BASE_API}/place?slug=eq.${id}`;
  return await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
}

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
  const url = `${BASE_API}/country?id=eq.${countryId}`;
  return await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
}

async function getPlaceRanks(placeRankLow, placeRankHigh) {
  if (
    !Number.isFinite(Number(placeRankLow)) ||
    !Number.isFinite(Number(placeRankHigh))
  ) {
    return [];
  }
  const url = `${BASE_API}/place?born_rank_unique=gte.${placeRankLow}&born_rank_unique=lte.${placeRankHigh}&order=born_rank_unique`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleBornHere(placeId, locale) {
  if (!placeId) {
    return [];
  }
  const url = `${BASE_API}/person?bplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,localized_name:translations->>${locale},slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleBornHereHpi(placeId) {
  if (!placeId) {
    return [];
  }
  const url = `${BASE_API}/person_ranks?bplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleDiedHere(placeId, locale) {
  if (!placeId) {
    return [];
  }
  const url = `${BASE_API}/person?dplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,localized_name:translations->>${locale},slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
  );
}

async function getPeopleDiedHereHpi(placeId) {
  if (!placeId) {
    return [];
  }
  const url = `${BASE_API}/person_ranks?dplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    [],
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
  const rawPlace = await getPlace(id);

  if (!rawPlace || !rawPlace.place) {
    return {title: t("placeNotFound")};
  }

  const localizedPlaceNames = await getLocalizedPlaceNameMap([rawPlace], lang);
  const place = localizePlace(rawPlace, localizedPlaceNames);

  // Get country info
  const country = localizeCountry(await getCountry(place.country), lang);

  // Get count of notable people born here
  const countRes = await fetch(
    `${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&select=id`,
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

  const countryName = country?.country || "";
  const location = `${place.place}${countryName ? `, ${countryName}` : ""}`;
  const count = formatLocationNumber(totalCount, lang);
  const title = t("placeMetaTitle", {count, location});
  const description = t("placeMetaDescription", {count, location});

  return {
    title,
    description,
    keywords: t("placeMetaKeywords", {location}),
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `${baseUrl}/api/screenshot/place?id=${id}&lang=${lang}`,
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
      images: [`${baseUrl}/api/screenshot/place?id=${id}&lang=${lang}`],
    },
    alternates: {
      canonical: buildCanonical(lang, `/profile/place/${id}`),
      languages: buildLanguageAlternates(`/profile/place/${id}`),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {id, locale} = params;
  const lang = normalizeLocationLocale(locale);
  const t = getLocationTranslations(lang);
  const [rawPlace, occupations] = await Promise.all([
    getPlace(id),
    getOccupations(),
  ]);

  if (!rawPlace?.id || !rawPlace?.place) {
    notFound();
  }

  // TODO: re-enable once Wikipedia stops 429ing us
  // const [country, wikiSummary, wikiPageViewsData] = await Promise.all([
  //   getCountry(place.country),
  //   getWikiSummary(place.place),
  //   getWikiPageViews(place.place),
  // ]);
  const country = localizeCountry(await getCountry(rawPlace.country), lang);
  const wikiSummary = null;
  const wikiPageViewsData = [];
  const placeRankWindow = getRankWindow(rawPlace?.born_rank_unique);
  const placeRanks = placeRankWindow
    ? await getPlaceRanks(placeRankWindow.low, placeRankWindow.high)
    : null;

  let [peopleBornHere, peopleDiedHere, peopleBornHereHpi, peopleDiedHereHpi] =
    await Promise.all([
      getPeopleBornHere(rawPlace.id, lang),
      getPeopleDiedHere(rawPlace.id, lang),
      getPeopleBornHereHpi(rawPlace.id),
      getPeopleDiedHereHpi(rawPlace.id),
    ]);
  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  peopleBornHere =
    peopleBornHere && peopleBornHere.length
      ? peopleBornHere
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
            bplace_name_rank: i + 1,
          }))
      : [];
  peopleDiedHere =
    peopleDiedHere && peopleDiedHere.length
      ? peopleDiedHere
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
            dplace_name_rank: i + 1,
          }))
      : [];

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

  const primaryPlaceNames = await getLocalizedPlaceNameMap([rawPlace], lang);
  const visiblePlaces = [
    ...(placeRanks || []),
    ...peopleBornHere
      .filter(person =>
        person.deathyear !== null
        && person.dplace_geonameid?.lat != null
        && person.dplace_geonameid?.lon != null,
      )
      .slice(0, 100)
      .map(person => person.dplace_geonameid),
    ...peopleDiedHere
      .filter(person =>
        person.deathyear !== null
        && person.bplace_geonameid?.lat != null
        && person.bplace_geonameid?.lon != null,
      )
      .slice(0, 100)
      .map(person => person.bplace_geonameid),
  ];
  const relatedPlaceNames = await getLocalizedPlaceNameMap(
    visiblePlaces,
    lang,
  );
  const localizedPlaceNames = new Map([
    ...relatedPlaceNames,
    ...primaryPlaceNames,
  ]);
  const place = localizePlace(rawPlace, localizedPlaceNames);
  const localizedPlaceRanks = placeRanks
    ? placeRanks.map(rankPlace => localizePlace(rankPlace, localizedPlaceNames))
    : null;
  peopleBornHere = localizePersonPlaces(peopleBornHere, localizedPlaceNames);
  peopleDiedHere = localizePersonPlaces(peopleDiedHere, localizedPlaceNames);

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
          place={place}
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
          place={place}
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
          place={place}
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
          place={place}
          peopleBorn={peopleBornHere}
          lang={lang}
        />
      ),
    },
    // {slug: "living-people", title: "Living People"}
  ];

  return (
    <div className="person">
      <Header
        place={place}
        country={country}
        wikiSummary={wikiSummary}
        wikiPageViews={wikiPageViewsData}
        lang={lang}
      />
      <div className="about-section">
        <ProfileNav sections={sections} />
        {localizedPlaceRanks && localizedPlaceRanks.length ? (
          <Intro
            place={place}
            country={country}
            placeRanks={localizedPlaceRanks}
            peopleBornHere={peopleBornHere}
            peopleDiedHere={peopleDiedHere}
            wikiSummary={wikiSummary}
            lang={lang}
          />
        ) : null}
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
