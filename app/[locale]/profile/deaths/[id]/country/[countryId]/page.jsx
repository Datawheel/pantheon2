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
  getDeathsCountry,
  getDeathsPeople,
  normalizeDeathsLocale,
} from "@/app/utils/deaths";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const year = params.id;
  const countryId = params.countryId;
  const locale = normalizeDeathsLocale(params.locale);
  const country = await getDeathsCountry(countryId, locale);
  if (!country?.id) {
    notFound();
  }
  const t = getDeathsTranslations(locale);
  const formattedYear = formatDeathsYear(year, locale);
  const previousImages = (await parent).openGraph?.images || [];
  const title = `${t("topPeopleCountryTitle", {
    country: country.country,
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
      canonical: buildCanonical(locale, `/profile/deaths/${year}/country/${countryId}`),
      languages: buildLanguageAlternates(`/profile/deaths/${year}/country/${countryId}`),
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const {id: year, countryId} = params;
  const locale = normalizeDeathsLocale(params.locale);
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const t = getDeathsTranslations(locale);
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    notFound();
  }

  const [country, peopleDiedThisYear] = await Promise.all([
    getDeathsCountry(countryId, locale),
    getDeathsPeople(yearNum, locale),
  ]);
  if (!country?.id) {
    notFound();
  }

  // Filter by birth country (nationality)
  const peopleDiedThisYearFiltered = peopleDiedThisYear.filter(
    person => person.bplace_country?.id === country.id
  );

  const sections = [
    {
      slug: "people",
      title: t("people"),
      content: (
        <TopPeople
          country={country}
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
          country={country}
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
        country={country}
        year={year}
        people={peopleDiedThisYearFiltered}
        lang={locale}
      />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro
          country={country}
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
            href={`${localePrefix}/profile/deaths/${parseInt(year) - 1}/country/${countryId}`}
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
              href={`${localePrefix}/profile/deaths/${parseInt(year) + 1}/country/${countryId}`}
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
