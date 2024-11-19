import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import TrendingGrid from "/components/home/TrendingGrid";
// import {useSearchVisibility} from "/contexts/SearchContext";

export const revalidate = 3600 * 4; // Cache the page for 4 hours

const baseUrl = process.env.URL || "https://pantheon.world";

// export default function Home() {
//   const {isSearchVisible, setSearchVisible} = useSearchVisibility();
//   const activateSearch = () => setSearchVisible(!isSearchVisible);

//   const [loadingTrendingBios, setLoadingTrendingBios] = useState(false);
//   const [trendingLangEdition, setTrendingLangEdition] = useState("en");
//   const [trendingBiosForGrid, setTrendingBiosForGrid] = useState([]);
export default async function Home() {
  const date30DaysAgo = new Date();
  date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
  const formattedDate = date30DaysAgo.toISOString().split("T")[0];

  // Fetch initial data server-side (default language: "en")
  const trendingAll = await fetch(
    `${baseUrl}/api/wikiTrends?lang=en&limit=16`,
    {
      next: {revalidate}, // Cache for revalidation period
    }
  ).then(res => res.json());

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
            <div className="home-search">
              <Image
                src="/images/icons/icon-search.svg"
                alt="search icon"
                width={22}
                height={22}
              />
              {/* <a href="#" onClick={activateSearch}> */}
              <a href="#">Search people, places, &amp; occupations</a>
            </div>
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

      {/* <div className="profile-grid">
        <div className="grid-title-container">
          <h3 className="grid-title">Trending Profiles Today</h3>
          <p className="grid-subtitle">
            <span className="grid-select-label">
              Top profiles by pageviews for the{" "}
            </span>
            <LangSelector
              setTrendingLangEdition={setTrendingLangEdition}
              trendingLangEdition={trendingLangEdition}
            />
            <span className="grid-select-label"> wikipedia edition</span>
          </p>
        </div>
        {!loadingTrendingBios ? (
          <HomeGrid
            bios={trendingBiosForGrid
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 16)}
          />
        ) : (
          <div className="loading-trends">
            <Spinner />
          </div>
        )}
      </div> */}
      <TrendingGrid
        initialTrendingAll={trendingAll}
        defaultLang="en"
        date30DaysAgo={formattedDate}
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
