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

async function getPlace(id) {
  const res = await fetch(`${BASE_API}/place?slug=eq.${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch place: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getOccupations() {
  const res = await fetch(
    `${BASE_API}/occupation?order=num_born.desc.nullslast`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getCountry(countryId) {
  const res = await fetch(`${BASE_API}/country?id=eq.${countryId}`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch country: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getPlaceRanks(placeRankLow, placeRankHigh) {
  const res = await fetch(
    `${BASE_API}/place?born_rank_unique=gte.${placeRankLow}&born_rank_unique=lte.${placeRankHigh}&order=born_rank_unique`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleBornHere(placeId) {
  const res = await fetch(
    `${BASE_API}/person?bplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleBornHereHpi(placeId) {
  const res = await fetch(
    `${BASE_API}/person_ranks?bplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleDiedHere(placeId) {
  const res = await fetch(
    `${BASE_API}/person?dplace_geonameid=eq.${placeId}&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,deathyear,alive`
  );
  return res.json();
}

async function getPeopleDiedHereHpi(placeId) {
  const res = await fetch(
    `${BASE_API}/person_ranks?dplace_geonameid=eq.${placeId}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

export async function generateMetadata({params}, parent) {
  // read route params
  const {id} = params;

  // fetch data
  const place = await getPlace(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${place.place} | Pantheon`,
    openGraph: {
      images: [`/api/screenshot/place?id=${id}`, ...previousImages],
    },
  };
}

export default async function Page({params: {id}}) {
  const [place, occupations] = await Promise.all([
    getPlace(id),
    getOccupations(),
  ]);
  const country = await getCountry(place.country);
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
      <Header place={place} country={country} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        {placeRanks && placeRanks.length ? (
          <Intro
            place={place}
            country={country}
            placeRanks={placeRanks}
            peopleBornHere={peopleBornHere}
            peopleDiedHere={peopleDiedHere}
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
