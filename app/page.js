"use client";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import HomeGrid from "/components/home/Grid";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import Spinner from "/components/Spinner";
import Select from "/components/common/Select";

const LangSelector = ({setTrendingLangEdition, trendingLangEdition}) => (
  <Select
    label=""
    className="home-select"
    fontSize="sm"
    onChange={evt => setTrendingLangEdition(evt.target.value)}
    value={trendingLangEdition}
  >
    <option value="ar">Arabic</option>
    <option value="zh">Chinese</option>
    <option value="nl">Dutch</option>
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="de">German</option>
    <option value="it">Italian</option>
    <option value="ja">Japanese</option>
    <option value="pt">Portuguese</option>
    <option value="ru">Russian</option>
    <option value="es">Spanish</option>
  </Select>
);

export default function Home() {
  const activateSearch = () => false;

  const [loadingTrendingBios, setLoadingTrendingBios] = useState(false);
  const [trendingLangEdition, setTrendingLangEdition] = useState("en");
  const [trendingBiosForGrid, setTrendingBiosForGrid] = useState([]);
  const [trendingSingersForGrid, setTrendingSingersForGrid] = useState([]);
  const [trendingSoccerPlayersForGrid, setTrendingSoccerPlayersForGrid] =
    useState([]);
  const [trendingActorsForGrid, setTrendingActorsForGrid] = useState([]);
  const [recentPassingsForGrid, setRecentPassingsForGrid] = useState([]);

  useEffect(() => {
    setLoadingTrendingBios(true);
    async function fetchMyData() {
      const date30DaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
      const all = await axios.get(
        `/api/wikiTrends?lang=${trendingLangEdition}`
      );
      const singers = await axios.get(
        `/api/wikiTrends?lang=${trendingLangEdition}&occupation=SINGER`
      );
      const soccerPlayers = await axios.get(
        `/api/wikiTrends?lang=${trendingLangEdition}&occupation=SOCCER+PLAYER`
      );
      const actors = await axios.get(
        `/api/wikiTrends?lang=${trendingLangEdition}&occupation=ACTOR`
      );
      const deaths = await axios.get(
        `https://api-dev.pantheon.world/person?alive=is.false&deathdate=gte.${date30DaysAgo}&select=wd_id,name,slug,birthyear,deathyear,id&order=deathdate.desc`
      );
      const trendingData = await axios
        .all([all, singers, soccerPlayers, actors, deaths])
        .then(axios.spread((...responses) => responses.map(r => r.data)))
        .catch(errors => {
          console.log("ERRORS!", errors);
        });
      const [
        trendingAll,
        trendingSingers,
        trendingSoccerPlayers,
        trendingActors,
        recentPassings,
      ] = trendingData;
      setTrendingBiosForGrid(trendingAll);
      setTrendingSingersForGrid(trendingSingers);
      setTrendingSoccerPlayersForGrid(trendingSoccerPlayers);
      setTrendingActorsForGrid(trendingActors);
      setRecentPassingsForGrid(recentPassings);
      setLoadingTrendingBios(false);
    }
    fetchMyData();
  }, [trendingLangEdition]);

  return (
    <div className="container">
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
              <a href="#" onClick={activateSearch}>
                Search people, places, &amp; occupations
              </a>
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

      <div className="profile-grid">
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
      </div>

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

      <div className="profile-grid">
        <div className="grid-title-container">
          <h3 className="grid-title">Recent Passings</h3>
        </div>
        {!loadingTrendingBios ? (
          <HomeGrid
            bios={recentPassingsForGrid.slice(0, 16)}
            showDates={true}
          />
        ) : (
          <div className="loading-trends">
            <Spinner />
          </div>
        )}
      </div>

      <div className="profile-grid">
        <div className="grid-title-container">
          <h3 className="grid-title">Trending Actors Today</h3>
          <p className="grid-subtitle">
            <span className="grid-select-label">
              Top actors by pageviews for the{" "}
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
            bios={trendingActorsForGrid
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 16)}
          />
        ) : (
          <div className="loading-trends">
            <Spinner />
          </div>
        )}
      </div>

      <div className="profile-grid">
        <div className="grid-title-container">
          <h3 className="grid-title">Trending Soccer Players Today</h3>
          <p className="grid-subtitle">
            <span className="grid-select-label">
              Top soccer players by pageviews for the{" "}
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
            bios={trendingSoccerPlayersForGrid
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 16)}
          />
        ) : (
          <div className="loading-trends">
            <Spinner />
          </div>
        )}
      </div>

      <div className="profile-grid">
        <div className="grid-title-container">
          <h3 className="grid-title">Trending Singers Today</h3>
          <p className="grid-subtitle">
            <span className="grid-select-label">
              Top singers by pageviews for the{" "}
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
            bios={trendingSingersForGrid
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 16)}
          />
        ) : (
          <div className="loading-trends">
            <Spinner />
          </div>
        )}
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
