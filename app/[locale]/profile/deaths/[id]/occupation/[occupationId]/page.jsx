import ProfileNav from "@/components/common/Nav";
import {cloneElement} from "react";
import Intro from "@/components/deaths/Intro";
import Header from "@/components/deaths/Header";
import TopPeople from "@/components/deaths/TopPeople";
import DeathsByMonth from "@/components/deaths/DeathsByMonth";
import {buildLanguageAlternates, buildCanonical} from "@/app/utils/hreflang";
import {notFound} from "next/navigation";
import {
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";
import {
  getDeathsOccupation,
  getDeathsPeople,
  normalizeDeathsLocale,
} from "@/app/utils/deaths";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const year = params.id;
  const locale = normalizeDeathsLocale(params.locale);
  const occupation = await getDeathsOccupation(params.occupationId, locale);
  if (!occupation?.id) notFound();
  const t = getDeathsTranslations(locale);
  const formattedYear = formatDeathsYear(year, locale);
  const previousImages = (await parent).openGraph?.images || [];
  const title = `${t("topPeopleOccupationTitle", {
    occupation: occupation.occupation,
    year: formattedYear,
  })} | Pantheon`;
  const description = t("metaDescription", {year: formattedYear});
  const image = `${
    process.env.URL || "https://pantheon.world"
  }/api/screenshot/deaths?year=${year}&lang=${locale}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        image,
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: buildCanonical(locale, `/profile/deaths/${year}/occupation/${params.occupationId}`),
      languages: buildLanguageAlternates(`/profile/deaths/${year}/occupation/${params.occupationId}`),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {id: year, occupationId} = params;
  const locale = normalizeDeathsLocale(params.locale);
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const t = getDeathsTranslations(locale);
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    notFound();
  }

  const [occupation, peopleDiedThisYear] = await Promise.all([
    getDeathsOccupation(occupationId, locale),
    getDeathsPeople(yearNum, locale),
  ]);
  if (!occupation?.id) {
    notFound();
  }

  const peopleDiedThisYearFiltered = peopleDiedThisYear.filter(
    person => person.occupation_id === occupation.id
  );

  const sections = [
    {
      slug: "people",
      title: t("people"),
      content: (
        <TopPeople
          occupation={occupation}
          year={year}
          people={peopleDiedThisYearFiltered}
          lang={locale}
        />
      ),
    },
    {
      slug: "deaths-by-month",
      title: t("deathsByMonth"),
      content: (
        <DeathsByMonth
          occupation={occupation}
          year={year}
          people={peopleDiedThisYearFiltered}
          lang={locale}
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
        lang={locale}
      />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro
          occupation={occupation}
          year={year}
          people={peopleDiedThisYear}
          lang={locale}
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
            href={`${localePrefix}/profile/deaths/${parseInt(year) - 1}/occupation/${occupationId}`}
            className="year-navigation-link"
          >
            &laquo; {t("previousYear", {
              year: formatDeathsYear(parseInt(year) - 1, locale),
            })}
          </a>
        </div>
        {parseInt(year) + 1 <= new Date().getFullYear() ? (
          <div>
            <a
              href={`${localePrefix}/profile/deaths/${parseInt(year) + 1}/occupation/${occupationId}`}
              className="year-navigation-link"
            >
              {t("nextYear", {
                year: formatDeathsYear(parseInt(year) + 1, locale),
              })} &raquo;
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
