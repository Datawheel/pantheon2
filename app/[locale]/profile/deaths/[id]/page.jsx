import ProfileNav from "@/components/common/Nav";
import {cloneElement} from "react";
import Intro from "@/components/deaths/Intro";
import Header from "@/components/deaths/Header";
import TopPeople from "@/components/deaths/TopPeople";
import DeathsByMonth from "@/components/deaths/DeathsByMonth";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchArray} from "@/app/utils/safeFetch";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {notFound} from "next/navigation";

async function getPeopleDiedThisYear(yearNum) {
  const url = `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&select=bplace_country(id,country,slug,demonym),dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,occupation_slug,domain_slug,industry,domain),occupation_id:occupation,name,slug,id,gender,birthyear,birthdate,deathyear,deathdate,alive&order=deathdate.asc`;
  return await safeFetchArray(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}});
}

async function getPeopleDiedThisYearHpi(yearNum) {
  const url = `${BASE_API}/person_ranks?deathyear=eq.${yearNum}&select=id,hpi,hpi_prev,non_en_page_views`;
  return await safeFetchArray(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}});
}

export async function generateMetadata(props, parent) {
  const params = await props.params;
  // read route params
  const year = params.id;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${year} Celebrity Deaths | Pantheon`,
    openGraph: {
      images: [
        `${
          process.env.URL || "https://pantheon.world"
        }/api/screenshot/deaths?year=${year}`,
        ...previousImages,
      ],
    },
    alternates: {
      canonical: buildCanonical(params.locale, `/profile/deaths/${year}`),
      languages: buildLanguageAlternates(`/profile/deaths/${year}`),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {id: year} = params;
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    notFound();
  }

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

  const sections = [
    {
      slug: "people",
      title: "People",
      content: <TopPeople year={year} people={peopleDiedThisYear} />,
    },
    {
      slug: "deaths-by-month",
      title: "Deaths by Month",
      content: <DeathsByMonth year={year} people={peopleDiedThisYear} />,
    },
  ];

  return (
    <div className="person">
      <Header year={year} people={peopleDiedThisYear} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro year={year} people={peopleDiedThisYear} />
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
