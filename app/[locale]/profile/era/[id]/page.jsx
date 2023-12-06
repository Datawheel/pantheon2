import { cloneElement } from "react";
// import ProfileNav from "../../../../components/common/Nav";
import Intro from "/components/era/Intro";
import Header from "/components/era/Header";
import PeopleRanking from "/components/era/sections/PeopleRanking";
import Occupations from "/components/era/sections/Occupations";
import OccupationTrends from "/components/era/sections/OccupationTrends";
import Places from "/components/era/sections/Places";
import Lifespans from "/components/era/sections/Lifespans";
import {
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "/components/utils/consts";

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast"
  );
  return res.json();
}

async function getEras() {
  const res = await fetch("https://api.pantheon.world/era?order=start_year");
  return res.json();
}

async function getEra(eraId) {
  const res = await fetch(`https://api.pantheon.world/era?slug=eq.${eraId}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.pgrst.object+json",
    },
  });
  return res.json();
}

async function getCountryRanks(countryRankLow, countryRankHigh) {
  const res = await fetch(
    `https://api.pantheon.world/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`
  );
  return res.json();
}

async function getPeopleBornInEra(startYear, endYear) {
  const res = await fetch(
    `https://api.pantheon.world/person?birthyear=gte.${startYear}&birthyear=lte.${endYear}&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),bplace_country(id,continent,country_code,country,slug),occupation(*),occupation_id:occupation,*`
  );
  return res.json();
}

async function getPeopleDiedInEra(startYear, endYear) {
  const res = await fetch(
    `https://api.pantheon.world/person?deathyear=gte.${startYear}&deathyear=lte.${endYear}&order=hpi.desc.nullslast&select=dplace_country(id,continent,country_code,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*`
  );
  return res.json();
}

export default async function Page({ params: { id } }) {
  const [era, eras, occupations] = await Promise.all([
    getEra(id),
    getEras(),
    getOccupations(),
  ]);

  let [peopleBornInEra, peopleDiedInEra] = await Promise.all([
    getPeopleBornInEra(era.start_year, era.end_year),
    getPeopleDiedInEra(era.start_year, era.end_year),
  ]);
  // // since bplace_country_rank_unique and bplace_country_rank_unique no longer exist
  // // we calculate and add them...
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
    {
      slug: "people",
      title: "People",
      content: (
        <PeopleRanking
          era={era}
          peopleBorn={peopleBornInEra}
          peopleDied={peopleDiedInEra}
        />
      ),
    },
    {
      slug: "occupations",
      title: "Occupations",
      content: (
        <Occupations
          era={era}
          peopleBorn={peopleBornInEra}
          peopleDied={peopleDiedInEra}
          attrs={attrs}
        />
      ),
    },
    // {
    //   slug: "occupations-trends",
    //   title: "Occupations Over Time",
    //   content: (
    //     <OccupationTrends
    //       peopleBorn={peopleBornInEra}
    //       peopleDied={peopleDiedInEra}
    //       attrs={attrs}
    //     />
    //   ),
    // },
    // {
    //   slug: "places",
    //   title: "Places",
    //   content: (
    //     <Places
    //       era={era}
    //       peopleBorn={peopleBornInEra}
    //       peopleDied={peopleDiedInEra}
    //     />
    //   ),
    // },
    // {
    //   slug: "lifespans",
    //   title: "Lifespans",
    //   content: <Lifespans era={era} attrs={attrs} people={peopleBornInEra} />,
    // },
  ];

  return (
    <div className="person">
      <Header era={era} />
      <div className="about-section">
        {/* <ProfileNav sections={this.sections} /> */}
        <Intro
          era={era}
          eras={eras}
          peopleBorn={peopleBornInEra}
          peopleDied={peopleDiedInEra}
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
