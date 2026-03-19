import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import TrendingGrid from "/components/home/TrendingGrid";
import BornTodayGrid from "/components/home/BornTodayGrid";
import {REVALIDATE_PERIODS} from "/app/constants";
import {SUPPORTED_LOCALES, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import HomeSearch from "/components/home/HomeSearch";
const baseUrl = process.env.URL || "https://pantheon.world";
const apiBaseUrl = process.env.BASE_API || "https://api.pantheon.world";

export default async function Home({params}) {
  const locale = params?.locale || DEFAULT_LOCALE;
  // Validate locale, fallback to default if invalid
  const lang = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const t = getTranslations(lang);
  const currentYear = new Date().getFullYear();
  const deathsPageLabel = (t.home.notableDeathsLink || `Notable Deaths of ${currentYear}`)
    .replace("2025", `${currentYear}`);

  const date30DaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

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
    `https://api.pantheon.world/person?alive=is.false&deathdate=gte.${date30DaysAgo}&select=wd_id,name,slug,birthyear,deathyear,id&order=deathdate.desc&limit=16`,
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
    `${apiBaseUrl}/person_hpi?created_at=gte.${date30DaysAgo}&select=created_at,person:person_id(wd_id,name,slug,birthyear,deathyear,id)&order=created_at.desc&limit=16`,
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

  // Fetch trending reasons for top trending people
  // Use yesterday's date (same as news page logic)
  const now = new Date();
  const easternNow = new Date(
    now.toLocaleString("en-US", {timeZone: "America/Godthab"}),
  );
  easternNow.setDate(easternNow.getDate() - 1);
  const yesterday = `${easternNow.getFullYear()}-${String(easternNow.getMonth() + 1).padStart(2, "0")}-${String(easternNow.getDate()).padStart(2, "0")}`;
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Get slugs from top trending people (first 5 to check for reasons)
  const topTrendingSlugs = trendingAll
    .slice(0, 5)
    .map(p => p.slug)
    .filter(Boolean);

  // Fetch trending reasons for these people
  let trendingWithReasons = [];
  if (topTrendingSlugs.length > 0) {
    try {
      const reasonsData = await fetch(
        `${apiBaseUrl}/trend_news?date=eq.${yesterday}&lang=eq.${lang}&slug=in.(${topTrendingSlugs.join(",")})&select=slug,title,reason,llm_metadata`,
        {
          next: {revalidate: REVALIDATE_PERIODS.SHORT * 2},
        },
      )
        .then(res => res.json())
        .then(data => (Array.isArray(data) ? data : []))
        .catch(error => {
          console.error(`Error fetching trending reasons for ${lang}:`, error);
          return [];
        });

      // Build a map of slug -> reason data
      const reasonsMap = reasonsData.reduce((acc, item) => {
        acc[item.slug] = {
          trending_reason: item.reason || "",
          llm_metadata: item.llm_metadata,
          localized_name: item.title || "",
        };
        return acc;
      }, {});

      // Merge reasons with trending people
      trendingWithReasons = trendingAll
        .filter(person => reasonsMap[person.slug])
        .map(person => ({
          ...person,
          trending_reason: reasonsMap[person.slug].trending_reason,
          llm_metadata: reasonsMap[person.slug].llm_metadata,
          localized_name: reasonsMap[person.slug].localized_name,
        }));
    } catch (error) {
      console.error("Error processing trending reasons:", error);
    }
  }

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
            <HomeSearch lang={lang} />
          </div>

          <div className="home-head-content">
            <h2>{t.home.tagline}</h2>
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
        bios={bornToday}
        currentLang={lang}
      />

      <TrendingGrid
        title={t.home.recentPassings}
        allowLangChange={false}
        initialTrendingAll={recentPassings}
        defaultLang={lang}
        showTrendIndicator={false}
        showDates={true}
        ctaHref={`/${lang}/profile/deaths/${currentYear}`}
        ctaLabel={deathsPageLabel}
      />

      <TrendingGrid
        title={t.home.recentlyAdded}
        allowLangChange={false}
        initialTrendingAll={recentlyAdded}
        defaultLang={lang}
        showTrendIndicator={false}
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
