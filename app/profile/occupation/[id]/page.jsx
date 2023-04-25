import React from "react";
// import ProfileNav from "../../../../components/common/Nav";
import Intro from "../../../../components/occupation/Intro";
import Header from "../../../../components/occupation/Header";
import People from "../../../../components/occupation/sections/People";
import Places from "../../../../components/occupation/sections/Places";
import PlacesOverTime from "../../../../components/occupation/sections/PlacesOverTime";
import Lifespans from "../../../../components/occupation/sections/Lifespans";
import OccupationTrends from "../../../../components/country/sections/OccupationTrends";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../../../../components/utils/consts";

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug"
  );
  return res.json();
}

async function getOccupation(occupationId) {
  const res = await fetch(
    `https://api.pantheon.world/occupation?occupation_slug=eq.${occupationId}`,
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

async function getPeople(occupationId) {
  const res = await fetch(
    `https://api.pantheon.world/person?occupation=eq.${occupationId}&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,hpi,gender,birthyear,deathyear,alive,hpi_prev`
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
  const [occupation, occupations] = await Promise.all([
    getOccupation(id),
    getOccupations(),
  ]);

  const people = await getPeople(occupation.id);
  // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // we calculate and add them...
  // peopleBornHere =
  //   !peopleBornHere ||
  //   peopleBornHere
  //     .sort((personA, personB) => personB.hpi - personA.hpi)
  //     .map((d, i) => ({ ...d, bplace_country_rank_unique: i + 1 }));
  // peopleDiedHere =
  //   !peopleDiedHere ||
  //   peopleDiedHere
  //     .sort((personA, personB) => personB.hpi - personA.hpi)
  //     .map((d, i) => ({ ...d, dplace_country_rank_unique: i + 1 }));

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const sections = [
    // {slug: "people", title: "People"},
    // {slug: "places", title: "Places"},
    // {slug: "places-over-time", title: "Places Over Time"},
    // {slug: "overlapping-lives", title: "Overlapping Lives"},
    // {slug: "related-occupations", title: "Related Occupations"}
    {
      slug: "people",
      title: "People",
      content: <People occupation={occupation} people={people} />,
    },
    {
      slug: "places",
      title: "Places",
      content: <Places occupation={occupation} people={people} />,
    },
    {
      slug: "places-over-time",
      title: "Places Over Time",
      content: <PlacesOverTime occupation={occupation} people={people} />,
    },
    {
      slug: "lifespans",
      title: "Lifespans",
      content: (
        <Lifespans attrs={attrs} occupation={occupation} people={people} />
      ),
    },
  ];

  return (
    <div className="person">
      <Header occupation={occupation} people={people} />
      <div className="about-section">
        {/* <ProfileNav sections={sections} /> */}
        <Intro occupation={occupation} occupations={occupations} />
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
