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
  getDeathsPeople,
  normalizeDeathsLocale,
} from "@/app/utils/deaths";

export async function generateMetadata(props, parent) {
  const params = await props.params;
  const year = params.id;
  const locale = normalizeDeathsLocale(params.locale);
  const t = getDeathsTranslations(locale);
  const formattedYear = formatDeathsYear(year, locale);
  const previousImages = (await parent).openGraph?.images || [];

  const title = t("metaTitle", {year: formattedYear});
  const description = t("metaDescription", {year: formattedYear});
  const ogImageUrl = `${
    process.env.URL || "https://pantheon.world"
  }/api/screenshot/deaths?year=${year}&lang=${locale}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/png",
          alt: title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
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
  const locale = normalizeDeathsLocale(params.locale);
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const t = getDeathsTranslations(locale);
  // Check if year is a valid integer > 2000
  const yearNum = parseInt(year);
  if (isNaN(yearNum) || yearNum < 2000) {
    notFound();
  }

  const peopleDiedThisYear = await getDeathsPeople(yearNum, locale);

  const sections = [
    {
      slug: "people",
      title: t("people"),
      content: (
        <TopPeople
          year={year}
          people={peopleDiedThisYear}
          lang={locale}
        />
      ),
    },
    {
      slug: "deaths-by-month",
      title: t("deathsByMonth"),
      content: (
        <DeathsByMonth
          year={year}
          people={peopleDiedThisYear}
          lang={locale}
        />
      ),
    },
  ];

  return (
    <div className="person">
      <Header year={year} people={peopleDiedThisYear} lang={locale} />
      <div className="about-section">
        <ProfileNav sections={sections} />
        <Intro year={year} people={peopleDiedThisYear} lang={locale} />
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
            href={`${localePrefix}/profile/deaths/${parseInt(year) - 1}`}
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
              href={`${localePrefix}/profile/deaths/${parseInt(year) + 1}`}
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
