import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import TrendingGrid from "@/components/home/TrendingGrid";
import BornTodayGrid from "@/components/home/BornTodayGrid";
import {REVALIDATE_PERIODS} from "@/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import HomeSearch from "@/components/home/HomeSearch";
import {localizePersonGroups} from "@/app/utils/personLocalization";
import {fetchTrendReasons} from "@/app/utils/trendReasons";
import {getEditionHeroImage} from "@/components/monthly/data/editions";
const baseUrl = process.env.URL || "https://pantheon.world";
const apiBaseUrl = process.env.BASE_API || "https://api.pantheon.world";

export default async function Home(props) {
  const params = await props.params;
  const locale = params?.locale || DEFAULT_LOCALE;
  // Validate locale, fallback to default if invalid
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);
  const currentYear = new Date().getFullYear();
  const deathsPageLabel = (
    t.home.notableDeathsLink || `Notable Deaths of ${currentYear}`
  ).replace("2025", `${currentYear}`);

  const date30DaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  // Latest Pantheon Monthly edition promoted on the homepage
  const latestEditionHero = await getEditionHeroImage("2026-10");

  // Fetch initial data server-side using the URL locale
  const trendingAll = await fetch(
    `${baseUrl}/api/wikiTrends?lang=${lang}&limit=16`,
    {
      next: {revalidate: REVALIDATE_PERIODS.SHORT * 4}, // Cache for revalidation period
    },
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching trending all data:", error);
      return [];
    });

  const recentPassings = await fetch(
    `https://api.pantheon.world/person?alive=is.false&deathdate=gte.${date30DaysAgo}&select=wd_id,name,slug,birthyear,deathyear,id,gender,occupation(occupation,occupation_slug)&order=deathdate.desc&limit=16`,
    {
      next: {revalidate: 3600 * 12}, // Cache for 12 hours
    },
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching recent passings data:", error);
      return [];
    });

  const recentlyAdded = await fetch(
    `${apiBaseUrl}/person_hpi?created_at=gte.${date30DaysAgo}&select=created_at,person:person_id(wd_id,name,slug,birthyear,deathyear,id,gender,occupation(occupation,occupation_slug))&order=created_at.desc&limit=16`,
    {
      next: {revalidate: 3600 * 12}, // Cache for 12 hours
    },
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .then(data =>
      data
        .map(d => ({...d.person, created_at: d.created_at}))
        .filter(d => d.slug),
    )
    .catch(error => {
      console.error("Error fetching recently added data:", error);
      return [];
    });

  // Fetch born on this day data
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const bornToday = await fetch(
    `${apiBaseUrl}/rpc/born_on_day?m=${todayMonth}&d=${todayDay}&lang=${lang}`,
    {
      next: {revalidate: 3600 * 6}, // Cache for 6 hours
    },
  )
    .then(res => res.json())
    .then(data => (Array.isArray(data) ? data : []))
    .catch(error => {
      console.error("Error fetching born today data:", error);
      return [];
    });

  // The homepage RPC/ranking feeds expose English person names even when the
  // surrounding content is localized. Enrich only the cards rendered outside
  // the trends block, and cap birthdays to the 12 cards shown by the grid.
  const [localizedRecentPassings, localizedRecentlyAdded, localizedBornToday] =
    await localizePersonGroups(
      [recentPassings, recentlyAdded, bornToday.slice(0, 12)],
      lang,
      {baseApi: apiBaseUrl},
    );

  const now = new Date();
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Fetch reasons for every profile shown in the trending grid. The grid is
  // capped at 16, so the excerpt carousel can cover the complete visible set.
  const topTrendingSlugs = trendingAll
    .slice(0, 16)
    .map(p => p.slug)
    .filter(Boolean);
  const trendingWithReasons = await fetchTrendReasons({
    slugs: topTrendingSlugs,
    lang,
    baseApi: apiBaseUrl,
  });

  return (
    <div className="container">
      <title>
        Pantheon — Explore the Most Memorable People in History | 85,000+
        Biographies
      </title>
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
            <div>
              <Image
                src="/images/logos/logo_pantheon.svg"
                alt="Pantheon logo"
                width={348}
                height={49}
              />
            </div>
            <HomeSearch lang={lang} />
          </div>

          <div className="home-head-content">
            <h1>{t.home.tagline}</h1>
            <p>{t.home.subtitle}</p>
            <h3 className="home-explore-links">
              {t.home.explore}{" "}
              <Link href={`/${lang}/profile/person`}>{t.home.people}</Link>,{" "}
              <Link href={`/${lang}/profile/place`}>{t.home.places}</Link>,{" "}
              <Link href={`/${lang}/profile/occupation`}>
                {t.home.occupations}
              </Link>
              , {t.home.and}{" "}
              <Link href={`/${lang}/profile/era`}>{t.home.eras}</Link>
            </h3>
          </div>
        </div>
      </div>

      {/* Pantheon Monthly callout. Late in the month, comment this block and
          the getEditionHeroImage call above out to hide it. */}
      <Link href={`/${lang}/monthly/2026/october`} className="monthly-callout">
        {latestEditionHero && (
          <div className="monthly-callout-image">
            <img src={latestEditionHero} alt="October 2026 Pantheon Monthly" />
          </div>
        )}
        <div className="monthly-callout-body">
          <span className="monthly-callout-badge">New Edition</span>
          <h2 className="monthly-callout-title">
            Pantheon Monthly: October 2026
          </h2>
          <p className="monthly-callout-description">
            The Nobel Effect &mdash; Nobel week sent Navi Pillay up nearly
            400-fold and brought most of this year&apos;s laureates into Pantheon,
            while RJ Mitte and Patrick Stewart had the month&apos;s biggest gains
            and Brazil and Israel went to the polls.
          </p>
          <span className="monthly-callout-link">
            Read the October Edition &rarr;
          </span>
        </div>
      </Link>

      <TrendingGrid
        title={t.home.trendingProfiles}
        allowLangChange={true}
        initialTrendingAll={trendingAll}
        defaultLang={lang}
        showTrendingExcerpt={true}
        trendingWithReasons={trendingWithReasons}
        ctaHref={`/${lang}/news?date=${todayString}`}
        ctaLabel={t.trending.viewMoreTrending}
      />

      <BornTodayGrid
        title={t.home?.bornTodayTitle || "Born Today"}
        bios={localizedBornToday}
        currentLang={lang}
      />

      <TrendingGrid
        title={t.home.recentPassings}
        allowLangChange={false}
        initialTrendingAll={localizedRecentPassings}
        defaultLang={lang}
        showTrendIndicator={false}
        showDates={true}
        ctaHref={`/${lang}/profile/deaths/${currentYear}`}
        ctaLabel={deathsPageLabel}
      />

      <TrendingGrid
        title={t.home.recentlyAdded}
        allowLangChange={false}
        initialTrendingAll={localizedRecentlyAdded}
        defaultLang={lang}
        showTrendIndicator={false}
        ctaHref={`${lang === DEFAULT_LOCALE ? "" : `/${lang}`}/profile/recently-added`}
        ctaLabel={t.recentlyAdded.viewMore}
      />

      <div className="profile-grid">
        <p className="post">
          <strong>Pantheon</strong> {t.home.about}{" "}
          <strong>15 {t.home.languages}</strong> {t.home.aboutContinued}{" "}
          <strong>Pantheon</strong> {t.home.aboutDeveloped}{" "}
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
