import React from "react";
// import ProfileNav from "../../../../components/common/Nav";
import Intro from "../../../../components/country/Intro";
import Header from "../../../../components/country/Header";
import PeopleRanking from "../../../../components/country/sections/PeopleRanking";
import Occupations from "../../../../components/country/sections/Occupations";
import OccupationTrends from "../../../../components/country/sections/OccupationTrends";
import Places from "../../../../components/country/sections/Places";
import Lifespans from "../../../../components/country/sections/Lifespans";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../../../../components/utils/consts";

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast"
  );
  return res.json();
}

async function getCountry(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/country?slug=eq.${countryId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/vnd.pgrst.object+json",
      },
    }
  );
  return res.json();
}

async function getCountryRanks(countryRankLow, countryRankHigh) {
  const res = await fetch(
    `https://api.pantheon.world/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`
  );
  return res.json();
}

async function getPeopleBornHere(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/person?bplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=bplace_country(id,country,slug),bplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,deathyear,alive`
  );
  return res.json();
}

async function getPeopleDiedHere(countryId) {
  const res = await fetch(
    `https://api.pantheon.world/person?dplace_country=eq.${countryId}&order=hpi.desc.nullslast&select=dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,deathyear,alive`
  );
  return res.json();
}

export default async function Page({ params: { id } }) {
  const [country, occupations] = await Promise.all([
    getCountry(id),
    getOccupations(),
  ]);

  const countryRankLow = Math.max(
    1,
    parseInt(country.born_rank_unique, 10) - NUM_RANKINGS_PRE
  );
  const countryRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(country.born_rank_unique, 10) + NUM_RANKINGS_POST
  );
  const countryRanks = await getCountryRanks(countryRankLow, countryRankHigh);

  let [peopleBornHere, peopleDiedHere] = await Promise.all([
    getPeopleBornHere(country.id),
    getPeopleDiedHere(country.id),
  ]);
  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  peopleBornHere =
    !peopleBornHere ||
    peopleBornHere
      .sort((personA, personB) => personB.hpi - personA.hpi)
      .map((d, i) => ({ ...d, bplace_country_rank_unique: i + 1 }));
  peopleDiedHere =
    !peopleDiedHere ||
    peopleDiedHere
      .sort((personA, personB) => personB.hpi - personA.hpi)
      .map((d, i) => ({ ...d, dplace_country_rank_unique: i + 1 }));

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
      <Header country={country} />
      <div className="about-section">
        {/* <ProfileNav sections={sections} /> */}
        <Intro
          country={country}
          countryRanks={countryRanks}
          peopleBornHere={peopleBornHere}
          peopleDiedHere={peopleDiedHere}
        />
      </div>
      {sections.map((section, key) =>
        React.cloneElement(section.content, {
          key,
          id: key + 1,
          slug: section.slug,
          title: section.title,
        })
      )}
    </div>
  );
}
