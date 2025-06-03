import {cloneElement} from "react";
// import ProfileNav from "../../../../components/common/Nav";
import Intro from "/components/era/Intro";
import Header from "/components/era/Header";
import PeopleRanking from "/components/era/sections/PeopleRanking";
import Occupations from "/components/era/sections/Occupations";
// import OccupationTrends from "/components/era/sections/OccupationTrends";
// import Places from "/components/era/sections/Places";
// import Lifespans from "/components/era/sections/Lifespans";
// import {
//   NUM_RANKINGS,
//   NUM_RANKINGS_PRE,
//   NUM_RANKINGS_POST,
// } from "/components/utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";

async function getOccupations() {
  const res = await fetch(
    `${BASE_API}/occupation?order=num_born.desc.nullslast`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getEras() {
  const res = await fetch(`${BASE_API}/era?order=start_year`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });
  return res.json();
}

async function getEra(eraId) {
  const res = await fetch(`${BASE_API}/era?slug=eq.${eraId}`, {
    next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch era: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

// async function getCountryRanks(countryRankLow, countryRankHigh) {
//   const res = await fetch(
//     `https://api.pantheon.world/country?born_rank_unique=gte.${countryRankLow}&born_rank_unique=lte.${countryRankHigh}&order=born_rank_unique`
//   );
//   return res.json();
// }

async function getPeopleBornInEra(startYear, endYear) {
  const res = await fetch(
    `${BASE_API}/person?birthyear=gte.${startYear}&birthyear=lte.${endYear}&select=bplace_geonameid(id,place,slug,lat,lon),bplace_country(id,continent,country_code,country,slug),occupation(*),occupation_id:occupation,*`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleBornInEraHpi(startYear, endYear) {
  const res = await fetch(
    `${BASE_API}/person_ranks?birthyear=gte.${startYear}&birthyear=lte.${endYear}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleDiedInEra(startYear, endYear) {
  const res = await fetch(
    `${BASE_API}/person?deathyear=gte.${startYear}&deathyear=lte.${endYear}&select=dplace_country(id,continent,country_code,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

async function getPeopleDiedInEraHpi(startYear, endYear) {
  const res = await fetch(
    `${BASE_API}/person_ranks?deathyear=gte.${startYear}&deathyear=lte.${endYear}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
}

export async function generateMetadata({params}, parent) {
  // read route params
  const id = params.id;

  // fetch data
  const era = await getEra(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${era.name} | Pantheon`,
    openGraph: {
      images: [
        `https://pantheon.world/api/screenshot/era?id=${id}`,
        ...previousImages,
      ],
    },
  };
}

export default async function Page({params: {id}}) {
  const [era, eras, occupations] = await Promise.all([
    getEra(id),
    getEras(),
    getOccupations(),
  ]);

  const [
    peopleBornInEraAttrs,
    peopleDiedInEraAttrs,
    peopleBornInEraHpi,
    peopleDiedInEraHpi,
  ] = await Promise.all([
    getPeopleBornInEra(era.start_year, era.end_year),
    getPeopleDiedInEra(era.start_year, era.end_year),
    getPeopleBornInEraHpi(era.start_year, era.end_year),
    getPeopleDiedInEraHpi(era.start_year, era.end_year),
  ]);

  const peopleBornInEra = peopleBornInEraAttrs.map(person => {
    const hpiData = peopleBornInEraHpi.find(hpi => hpi.id === person.id);
    return {
      ...person,
      ...(hpiData || {}),
    };
  });

  const peopleDiedInEra = peopleDiedInEraAttrs.map(person => {
    const hpiData = peopleDiedInEraHpi.find(hpi => hpi.id === person.id);
    return {
      ...person,
      ...(hpiData || {}),
    };
  });

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
    <div className="era">
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
