import ProfileNav from "/components/common/Nav";
import {cloneElement} from "react";
import Intro from "/components/deaths/Intro";
import Header from "/components/deaths/Header";
import TopPeople from "/components/deaths/TopPeople";
import DeathsByMonth from "/components/deaths/DeathsByMonth";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";

async function getOccupation(occupationId) {
  const res = await fetch(
    `${BASE_API}/occupation?occupation_slug=eq.${occupationId}`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch occupation: ${res.status}`);
  }

  const data = await res.json();

  // Return first item if array has content, otherwise empty object
  return Array.isArray(data) && data.length > 0 ? data[0] : {};
}

async function getPeopleDiedThisYear(yearNum, occupation) {
  const res = await fetch(
    `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&occupation=eq.${occupation}&select=bplace_country(demonym),dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,name,slug,id,hpi,hpi_prev,gender,birthyear,birthdate,deathyear,deathdate,alive&order=deathdate.asc`,
    {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }
  );
  return res.json();
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
  };
}

export default async function Page({params: {id: year, occupationId}}) {
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    return new Response("Not Found", {status: 404});
  }

  const occupation = await getOccupation(occupationId);

  const peopleDiedThisYear = await getPeopleDiedThisYear(
    yearNum,
    occupation.id
  );
  console.log("peopleDiedThisYear", peopleDiedThisYear[0]);

  const sections = [
    {
      slug: "people",
      title: "People",
      content: (
        <TopPeople
          occupation={occupation}
          year={year}
          people={peopleDiedThisYear}
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
          people={peopleDiedThisYear}
        />
      ),
    },
  ];

  return (
    <div className="person">
      <Header occupation={occupation} year={year} people={peopleDiedThisYear} />
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
            href={`/profile/deaths/${parseInt(year) - 1}`}
            className="year-navigation-link"
          >
            &laquo; view {parseInt(year) - 1} deaths
          </a>
        </div>
        {parseInt(year) + 1 < 2025 ? (
          <div>
            <a
              href={`/profile/deaths/${parseInt(year) + 1}`}
              className="year-navigation-link"
            >
              view {parseInt(year) + 1} deaths &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
