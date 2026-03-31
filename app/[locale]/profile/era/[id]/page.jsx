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
import {safeFetchJson, safeFetchFirst} from "/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "/app/utils/hreflang";

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getEras() {
  const url = `${BASE_API}/era?order=start_year`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getEra(eraId) {
  const url = `${BASE_API}/era?slug=eq.${eraId}`;
  return await safeFetchFirst(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, {});
}

async function getPeopleBornInEra(startYear, endYear) {
  const url = `${BASE_API}/person?birthyear=gte.${startYear}&birthyear=lte.${endYear}&select=bplace_geonameid(id,place,slug,lat,lon),bplace_country(id,continent,country_code,country,slug),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,*`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleBornInEraHpi(startYear, endYear) {
  const url = `${BASE_API}/person_ranks?birthyear=gte.${startYear}&birthyear=lte.${endYear}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedInEra(startYear, endYear) {
  const url = `${BASE_API}/person?deathyear=gte.${startYear}&deathyear=lte.${endYear}&select=dplace_country(id,continent,country_code,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,*`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedInEraHpi(startYear, endYear) {
  const url = `${BASE_API}/person_ranks?deathyear=gte.${startYear}&deathyear=lte.${endYear}&order=hpi.desc.nullslast&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
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
    alternates: {
      canonical: buildCanonical(params.locale, `/profile/era/${id}`),
      languages: buildLanguageAlternates(`/profile/era/${id}`),
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
