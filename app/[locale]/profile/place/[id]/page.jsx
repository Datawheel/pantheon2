import {cloneElement} from "react";
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
import OccupationTrends from "../../../../../components/place/sections/OccupationTrends";
import Lifespans from "../../../../../components/place/sections/Lifespans";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {safeFetchJson, safeFetchFirst} from "/app/utils/safeFetch";

async function getWikiSummary(placeName) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      }
    );
    if (!res.ok) {
      console.error(`[getWikiSummary] HTTP ${res.status} for: ${placeName}`);
      return null;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getWikiSummary] Got HTML instead of JSON for: ${placeName}`);
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
  const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  try {
    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(placeName)}/monthly/20110101/${year}${month}01`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      }
    );
    if (!res.ok) {
      console.error(`[getWikiPageViews] HTTP ${res.status} for: ${placeName}`);
      return {items: null};
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getWikiPageViews] Got HTML instead of JSON for: ${placeName}`);
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
  return await safeFetchFirst(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, {});
}

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getCountry(countryId) {
  const url = `${BASE_API}/country?id=eq.${countryId}`;
  return await safeFetchFirst(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, {});
}

async function getPlaceRanks(placeRankLow, placeRankHigh) {
  const url = `${BASE_API}/place?born_rank_unique=gte.${placeRankLow}&born_rank_unique=lte.${placeRankHigh}&order=born_rank_unique`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleBornHere(placeId) {
  const url = `${BASE_API}/person?bplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleBornHereHpi(placeId) {
  const url = `${BASE_API}/person_ranks?bplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedHere(placeId) {
  const url = `${BASE_API}/person?dplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedHereHpi(placeId) {
  const url = `${BASE_API}/person_ranks?dplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function generateMetadata({params}, parent) {
  const {id, locale} = params;
  const baseUrl = process.env.URL || "https://pantheon.world";
  const lang = locale || "en";

  // fetch data
  const place = await getPlace(id);

  if (!place || !place.place) {
    return {title: "Place Not Found | Pantheon"};
  }

  // Get country info
  const country = await getCountry(place.country);

  // Get count of notable people born here
  const countRes = await fetch(
    `${BASE_API}/person_ranks?bplace_geonameid=eq.${place.id}&select=id`,
    {
      headers: {"Prefer": "count=exact"},
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
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
  const title = `Famous People from ${place.place}${countryName ? `, ${countryName}` : ""} | ${formatNumber(totalCount)} Notable People | Pantheon`;
  const description = `Explore ${formatNumber(totalCount)} historically significant people born in ${place.place}${countryName ? `, ${countryName}` : ""}. Discover famous celebrities, leaders, artists, scientists, athletes and more from this city throughout history.`;

  return {
    title,
    description,
    keywords: `${place.place} famous people, famous people from ${place.place}, ${place.place} celebrities, notable people born in ${place.place}, ${place.place} historical figures${countryName ? `, ${countryName} famous people` : ""}`,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        `${baseUrl}/api/screenshot/place?id=${id}`,
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://pantheon.world/${lang}/profile/place/${id}`,
    },
  };
}

export default async function Page({params: {id}}) {
  const [place, occupations] = await Promise.all([
    getPlace(id),
    getOccupations(),
  ]);
  const [country, wikiSummary, wikiPageViewsData] = await Promise.all([
    getCountry(place.country),
    getWikiSummary(place.place),
    getWikiPageViews(place.place),
  ]);
  const placeRankLow = Math.max(
    1,
    parseInt(place.born_rank_unique, 10) - NUM_RANKINGS_PRE
  );
  const placeRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(place.born_rank_unique, 10) + NUM_RANKINGS_POST
  );
  const placeRanks = await getPlaceRanks(placeRankLow, placeRankHigh);

  let [peopleBornHere, peopleDiedHere, peopleBornHereHpi, peopleDiedHereHpi] =
    await Promise.all([
      getPeopleBornHere(place.id),
      getPeopleDiedHere(place.id),
      getPeopleBornHereHpi(place.id),
      getPeopleDiedHereHpi(place.id),
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

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const sections = [
    {
      slug: "people",
      title: "People",
      content: (
        <PeopleRanking
          country={country}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "occupations",
      title: "Occupations",
      content: (
        <Occupations
          attrs={attrs}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "occupational-trends",
      title: "Occupational Trends",
      content: (
        <OccupationTrends
          attrs={attrs}
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
          occupations={occupations}
        />
      ),
    },
    {
      slug: "places",
      title: "Places",
      content: (
        <Places
          place={place}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "overlapping-lives",
      title: "Overlapping Lives",
      content: (
        <Lifespans attrs={attrs} place={place} peopleBorn={peopleBornHere} />
      ),
    },
    // {slug: "living-people", title: "Living People"}
  ];

  return (
    <div className="person">
      <Header place={place} country={country} wikiSummary={wikiSummary} wikiPageViews={wikiPageViewsData} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        {placeRanks && placeRanks.length ? (
          <Intro
            place={place}
            country={country}
            placeRanks={placeRanks}
            peopleBornHere={peopleBornHere}
            peopleDiedHere={peopleDiedHere}
            wikiSummary={wikiSummary}
          />
        ) : null}
      </div>
      {sections.map((section, key) =>
        cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        })
      )}
    </div>
  );
}
