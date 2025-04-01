import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import TrendingGrid from "/components/home/TrendingGrid";
import {REVALIDATE_PERIODS} from "/app/constants";
import HomeSearch from "/components/home/HomeSearch";
const baseUrl = process.env.URL || "https://pantheon.world";

export default async function Home() {
  const date30DaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  // Fetch initial data server-side (default language: "en")
  const trendingAll = await fetch(
    `${baseUrl}/api/wikiTrends?lang=en&limit=16`,
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
    `${baseUrl}/api/wikiTrends?lang=en&limit=16&occupation=SINGER`,
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
    `${baseUrl}/api/wikiTrends?lang=en&limit=16&occupation=ACTOR`,
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
      <Image
        className="bg-design"
        src="/images/home/printing.png"
        alt="old school printing press"
        width={400}
        height={423}
      />
      <Image
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
            <h2>Explore human collective memory!</h2>
            <p>
              Pantheon helps you discover the geography and dynamics of our
              planet&apos;s history.
            </p>
            <h3 className="home-explore-links">
              Explore <Link href="/profile/person">People</Link>,{" "}
              <Link href="/profile/place">Places</Link>,{" "}
              <Link href="/profile/occupation">Occupations</Link>, and{" "}
              <Link href="/profile/era">Eras</Link>
            </h3>
          </div>
        </div>
      </div>

      <TrendingGrid
        title="Trending Profiles Today"
        allowLangChange={true}
        initialTrendingAll={trendingAll}
        defaultLang="en"
      />

      <div className="profile-grid">
        <p className="post">
          <strong>Pantheon</strong> is an observatory of collective memory
          focused on biographies with a presence in at least{" "}
          <strong>15 languages</strong> in Wikipedia. We have data on more than
          85,000 biographies, organized by countries, cities, occupations, and
          eras. Explore this data to learn about the characters that shape human
          culture. <strong>Pantheon</strong> began as a project at the
          Collective Learning group at MIT. Today it is developed by{" "}
          <a
            href="https://datawheel.us/"
            target="_blank"
            rel="noopener noreferrer"
            className="item-link feedback-link"
          >
            Datawheel
          </a>
          , a company specialized in the creation of data distribution and
          visualization solutions.
        </p>
      </div>

      <TrendingGrid
        title="Recent Passings"
        allowLangChange={false}
        initialTrendingAll={recentPassings}
        defaultLang="en"
      />

      <div className="announcement-block">
        <h2>Notable Deaths of 2025</h2>
        <p>
          Want to see the complete list of notable figures we&apos;ve lost in
          2025? Visit our{" "}
          <Link href="/en/profile/deaths/2025">Notable Deaths of 2025</Link>{" "}
          page for a comprehensive collection of biographies featuring
          influential personalities, including celebrities, artists, leaders,
          and cultural icons who have passed away this year.
        </p>
      </div>

      <TrendingGrid
        title="Trending Singers Today"
        allowLangChange={true}
        initialTrendingAll={trendingSingers}
        defaultLang="en"
        occupation="SINGER"
      />

      <TrendingGrid
        title="Trending Actors Today"
        allowLangChange={true}
        initialTrendingAll={trendingActors}
        defaultLang="en"
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
