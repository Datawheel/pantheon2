// import ProfileNav from "../../../../components/common/Nav";
import {cloneElement} from "react";
import Intro from "/components/country/Intro";
import Header from "/components/country/Header";
import PeopleRanking from "/components/country/sections/PeopleRanking";
import Occupations from "/components/country/sections/Occupations";
import OccupationTrends from "/components/country/sections/OccupationTrends";
import Places from "/components/country/sections/Places";
import Lifespans from "/components/country/sections/Lifespans";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "/components/utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {safeFetchJson, safeFetchFirst} from "/app/utils/safeFetch";

async function getWikiSummary(countryName) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      }
    );
    if (!res.ok) {
      console.error(`[getWikiSummary] HTTP ${res.status} for: ${countryName}`);
      return null;
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getWikiSummary] Got HTML instead of JSON for: ${countryName}`);
      return null;
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getWikiSummary] Error for ${countryName}: ${e.message}`);
    return null;
  }
}

async function getWikiPageViews(countryName) {
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
  try {
    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(countryName)}/monthly/20110101/${year}${month}01`,
      {
        headers: {
          "User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
          "Api-User-Agent": "Pantheon/1.0 (https://pantheon.world; contact@pantheon.world)",
        },
        next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
      }
    );
    if (!res.ok) {
      console.error(`[getWikiPageViews] HTTP ${res.status} for: ${countryName}`);
      return {items: null};
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getWikiPageViews] Got HTML instead of JSON for: ${countryName}`);
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
    console.error(`[getWikiPageViews] Error for ${countryName}: ${e.message}`);
    return {items: null};
  }
}

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getCountry(countryId) {
  const url = `${BASE_API}/country?slug=eq.${countryId}`;
  return await safeFetchFirst(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, {});
}

async function getCountryRanks(countryRankLow, countryRankHigh) {
  const url = `${BASE_API}/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleBornHere(countryId) {
  const url = `${BASE_API}/person?bplace_country=eq.${countryId}&select=bplace_country(id,country,slug),bplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleBornHereHpi(countryId) {
  const url = `${BASE_API}/person_ranks?bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedHere(countryId) {
  const url = `${BASE_API}/person?dplace_country=eq.${countryId}&select=dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedHereHpi(countryId) {
  const url = `${BASE_API}/person_ranks?dplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

export async function generateMetadata({params}, parent) {
  const {id, locale} = params;
  const baseUrl = process.env.URL || "https://pantheon.world";
  const lang = locale || "en";

  // fetch data
  const country = await getCountry(id);

  if (!country || !country.country) {
    return {title: "Country Not Found | Pantheon"};
  }

  // Get count of notable people
  const countRes = await fetch(
    `${BASE_API}/person_ranks?bplace_country=eq.${country.id}&select=id`,
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

  const title = `Famous People from ${country.country} | ${formatNumber(totalCount)} Notable ${country.country} People | Pantheon`;
  const description = `Explore ${formatNumber(totalCount)} historically significant people born in ${country.country}. Discover the most famous ${country.demonym || country.country} celebrities, leaders, artists, scientists, athletes and more throughout history.`;

  return {
    title,
    description,
    keywords: `${country.country} famous people, famous ${country.demonym || country.country} people, ${country.country} celebrities, notable people from ${country.country}, ${country.country} historical figures`,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        `${baseUrl}/api/screenshot/country?id=${id}`,
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://pantheon.world/${lang}/profile/country/${id}`,
    },
  };
}

export default async function Page({params: {id}}) {
  const [country, occupations] = await Promise.all([
    getCountry(id),
    getOccupations(),
  ]);

  const [wikiSummary, wikiPageViewsData] = await Promise.all([
    getWikiSummary(country.country),
    getWikiPageViews(country.country),
  ]);

  const countryRankWindow = getRankWindow(country?.born_rank_unique);
  const countryRanks = countryRankWindow
    ? await getCountryRanks(countryRankWindow.low, countryRankWindow.high)
    : null;

  let [peopleBornHere, peopleDiedHere, peopleBornHereHpi, peopleDiedHereHpi] =
    await Promise.all([
      getPeopleBornHere(country.id),
      getPeopleDiedHere(country.id),
      getPeopleBornHereHpi(country.id),
      getPeopleDiedHereHpi(country.id),
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
          country={country}
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
          country={country}
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
          country={country}
          peopleBorn={peopleBornHere}
          peopleDied={peopleDiedHere}
        />
      ),
    },
    {
      slug: "overlapping-lives",
      title: "Overlapping Lives",
      content: (
        <Lifespans
          attrs={attrs}
          country={country}
          peopleBorn={peopleBornHere}
        />
      ),
    },
    // {slug: "living-people", title: "Living People"}
  ];

  return (
    <div className="person">
      <Header country={country} wikiPageViews={wikiPageViewsData} />
      <div className="about-section">
        {/* <ProfileNav sections={sections} /> */}
        <Intro
          country={country}
          countryRanks={countryRanks}
          peopleBornHere={peopleBornHere}
          peopleDiedHere={peopleDiedHere}
          wikiSummary={wikiSummary}
        />
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
