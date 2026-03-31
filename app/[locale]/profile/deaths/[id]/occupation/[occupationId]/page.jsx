import ProfileNav from "/components/common/Nav";
import {cloneElement} from "react";
import Intro from "/components/deaths/Intro";
import Header from "/components/deaths/Header";
import TopPeople from "/components/deaths/TopPeople";
import DeathsByMonth from "/components/deaths/DeathsByMonth";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {safeFetchJson, safeFetchFirst} from "/app/utils/safeFetch";
import {buildLanguageAlternates} from "/app/utils/hreflang";

async function getOccupation(occupationId) {
  const url = `${BASE_API}/occupation?occupation_slug=eq.${occupationId}`;
  return await safeFetchFirst(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, {});
}

async function getPeopleDiedThisYear(yearNum) {
  const url = `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&select=bplace_country(id,country,slug,demonym),dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,birthdate,deathyear,deathdate,alive&order=deathdate.asc`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

async function getPeopleDiedThisYearHpi(yearNum) {
  const url = `${BASE_API}/person_ranks?deathyear=eq.${yearNum}&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchJson(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}}, []);
}

export async function generateMetadata({params}, parent) {
  // read route params
  const year = params.id;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${year} Celebrity Deaths | Pantheon`,
    openGraph: {
      images: [
        `https://static.pantheon.world/profile/deaths/deaths-${year}.jpg`,
        ...previousImages,
      ],
    },
    alternates: {
      canonical: `https://pantheon.world/profile/deaths/${year}/occupation/${params.occupationId}`,
      languages: buildLanguageAlternates(`/profile/deaths/${year}/occupation/${params.occupationId}`),
    },
  };
}

export default async function Page({params: {id: year, occupationId}}) {
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    return new Response("Not Found", {status: 404});
  }

  const occupation = await getOccupation(occupationId);

  // Fetch both person data and HPI data in parallel
  const [peopleDiedThisYearAttrs, peopleDiedThisYearHpi] = await Promise.all([
    getPeopleDiedThisYear(yearNum),
    getPeopleDiedThisYearHpi(yearNum),
  ]);

  // Merge the results
  const peopleDiedThisYear = peopleDiedThisYearAttrs.map(person => {
    const hpiData = peopleDiedThisYearHpi.find(hpi => hpi.id === person.id);
    return {
      ...person,
      ...(hpiData || {}),
    };
  });

  const peopleDiedThisYearFiltered = peopleDiedThisYear.filter(
    person => person.occupation_id === occupation.id
  );

  const sections = [
    {
      slug: "people",
      title: "People",
      content: (
        <TopPeople
          occupation={occupation}
          year={year}
          people={peopleDiedThisYearFiltered}
        />
      ),
    },
    {
      slug: "deaths-by-month",
      title: "Deaths by Month",
      content: (
        <DeathsByMonth
          occupation={occupation}
          year={year}
          people={peopleDiedThisYearFiltered}
        />
      ),
    },
  ];

  return (
    <div className="person">
      <Header
        occupation={occupation}
        year={year}
        people={peopleDiedThisYearFiltered}
      />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro
          occupation={occupation}
          year={year}
          people={peopleDiedThisYear}
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
      <div className="year-navigation">
        <div>
          <a
            href={`/profile/deaths/${parseInt(year) - 1}/occupation/${occupationId}`}
            className="year-navigation-link"
          >
            &laquo; view {parseInt(year) - 1} deaths ({occupation.occupation?.toLowerCase()})
          </a>
        </div>
        {parseInt(year) + 1 <= new Date().getFullYear() ? (
          <div>
            <a
              href={`/profile/deaths/${parseInt(year) + 1}/occupation/${occupationId}`}
              className="year-navigation-link"
            >
              view {parseInt(year) + 1} deaths ({occupation.occupation?.toLowerCase()}) &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
