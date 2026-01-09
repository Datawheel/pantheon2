import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import TrendingGrid from "/components/home/TrendingGrid";
import {REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import HomeSearch from "/components/home/HomeSearch";
const baseUrl = process.env.URL || "https://pantheon.world";

export default async function Home({params}) {
  const locale = params?.locale || DEFAULT_LOCALE;
  // Validate locale, fallback to default if invalid
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);

  const date30DaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  // Fetch initial data server-side using the URL locale
  const trendingAll = await fetch(
    `${baseUrl}/api/wikiTrends?lang=${lang}&limit=16`,
    {
      next: {revalidate: REVALIDATE_PERIODS.SHORT * 4}, // Cache for revalidation period
    }
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching trending all data:", error);
      return [];
    });

  const recentPassings = await fetch(
    `https://api.pantheon.world/person?alive=is.false&deathdate=gte.${date30DaysAgo}&select=wd_id,name,slug,birthyear,deathyear,id&order=deathdate.desc&limit=16`,
    {
      next: {revalidate: 3600 * 12}, // Cache for 12 hours
    }
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching recent passings data:", error);
      return [];
    });

  const trendingSingers = await fetch(
    `${baseUrl}/api/wikiTrends?lang=${lang}&limit=16&occupation=SINGER`,
    {
      next: {revalidate: REVALIDATE_PERIODS.SHORT * 4}, // Cache for revalidation period
    }
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching trending singers data:", error);
      return [];
    });

  const trendingActors = await fetch(
    `${baseUrl}/api/wikiTrends?lang=${lang}&limit=16&occupation=ACTOR`,
    {
      next: {revalidate: REVALIDATE_PERIODS.SHORT * 4}, // Cache for revalidation period
    }
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching trending actors data:", error);
      return [];
    });

  return (
    <div className="container">
      <title>Pantheon</title>
      <img
        className="bg-design"
        src="/images/home/printing.png"
        alt="old school printing press"
        width={400}
        height={423}
      />
      <img
        className="bg-design bg-design-r"
        src="/images/home/film.png"
        alt="old school film camera"
        width={230}
        height={290}
      />

      <div className="home-head-container">
        <div className="home-head">
          <div className="home-head-title">
            <h1>
              <Image
                src="/images/logos/logo_pantheon.svg"
                alt="Pantheon logo"
                width={348}
                height={49}
              />
            </h1>
            <HomeSearch />
          </div>

          <div className="home-head-content">
            <h2>{t.home.tagline}</h2>
            <p>
              {t.home.subtitle}
            </p>
            <h3 className="home-explore-links">
              {t.home.explore} <Link href={`/${lang}/profile/person`}>{t.home.people}</Link>,{" "}
              <Link href={`/${lang}/profile/place`}>{t.home.places}</Link>,{" "}
              <Link href={`/${lang}/profile/occupation`}>{t.home.occupations}</Link>, {t.home.and}{" "}
              <Link href={`/${lang}/profile/era`}>{t.home.eras}</Link>
            </h3>
          </div>
        </div>
      </div>

      <TrendingGrid
        title={t.home.trendingProfiles}
        allowLangChange={true}
        initialTrendingAll={trendingAll}
        defaultLang={lang}
        showNewsButton={true}
      />

      <div className="profile-grid">
        <p className="post">
          <strong>Pantheon</strong> {t.home.about}{" "}
          <strong>15 {t.home.languages}</strong> {t.home.aboutContinued} <strong>Pantheon</strong> {t.home.aboutDeveloped}{" "}
          <a
            href="https://datawheel.us/"
            target="_blank"
            rel="noopener noreferrer"
            className="item-link feedback-link"
          >
            {t.home.datawheel}
          </a>
          {t.home.aboutDatawheel}
        </p>
      </div>

      <TrendingGrid
        title={t.home.recentPassings}
        allowLangChange={false}
        initialTrendingAll={recentPassings}
        defaultLang={lang}
        showTrendIndicator={false}
        showDates={true}
      />

      <div className="announcement-block">
        <h2>{t.home.notableDeaths}</h2>
        <p>
          {t.home.notableDeathsText}{" "}
          <Link href={`/${lang}/profile/deaths/2025`}>{t.home.notableDeathsLink}</Link>{" "}
          {t.home.notableDeathsContinued}
        </p>
      </div>

      <TrendingGrid
        title={t.home.trendingSingers}
        allowLangChange={true}
        initialTrendingAll={trendingSingers}
        defaultLang={lang}
        occupation="SINGER"
      />

      <TrendingGrid
        title={t.home.trendingActors}
        allowLangChange={true}
        initialTrendingAll={trendingActors}
        defaultLang={lang}
        occupation="ACTOR"
      />

      <div className="floating-content l-1">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>

      <div className="floating-content l-2">
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box"></div>
      </div>
    </div>
  );
}
