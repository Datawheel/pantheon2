import {Suspense} from "react";
import {max as D3Max, min as D3Min} from "d3-array";
import dayjs from "dayjs";
import HeaderLine from "./HeaderLine";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import "../../styles/Header.css";
import "../../styles/mouse.css";

async function getWikiPageViews(personName) {
  const wikiSlug = personName.replace(/ /g, "_");
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const res = await fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${wikiSlug}/monthly/20110101/${year}${month}01`
  );
  return res.json();
}

async function getIsTrending(personId) {
  const dateobj = new Date();
  dateobj.setDate(dateobj.getDate() - 29);
  const year1monthAgo = dateobj.getFullYear();
  const month1monthAgo = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const day1monthAgo = `${dateobj.getDate()}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const monthAgo = `${year1monthAgo}-${month1monthAgo}-${day1monthAgo}`;
  const res = await fetch(
    `https://api-dev.pantheon.world/trend?date=gte.${monthAgo}&pid=eq.${personId}&rank_pantheon=lte.100`
  );
  return res.json();
}

export default async function Header({person}) {
  const {items: wikiPageViews} = await getWikiPageViews(person.name);
  const isTrendingData = await getIsTrending(person.id);
  const isTrending = !!isTrendingData.length;

  let pageViewData = null;
  if (wikiPageViews) {
    pageViewData = wikiPageViews.map(pv => ({
      ...pv,
      date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(
        4,
        6
      )}/${pv.timestamp.substring(6, 8)}`,
    }));
    const mostRecentDate = D3Max(pageViewData, d =>
      dayjs(d.date, "YYYY/MM/DD")
    );
    const oldestDate = D3Min(pageViewData, d => dayjs(d.date, "YYYY/MM/DD"));
    pageViewData.push({
      ...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
    pageViewData.push({
      ...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
  }

  const backgroundColor = person.occupation
      ? COLORS_DOMAIN[person.occupation.domain_slug]
      : "",
    backgroundImage = `url('/images/profile/people/${person.wp_id}.jpg')`;

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask person" style={{backgroundColor}}>
          <div
            className="bg-img bg-img-l"
            style={{backgroundColor, backgroundImage}}
          ></div>
          <div
            className="bg-img bg-img-r"
            style={{backgroundColor, backgroundImage}}
          ></div>
        </div>
      </div>
      <div className="info">
        {isTrending ? <div className="trending-cont">Trending</div> : null}
        <h2 className="profile-type">
          {person.occupation ? person.occupation.occupation : ""}
        </h2>
        <h1 className="profile-name">{person.name}</h1>
        {person.birthyear ? (
          <p className="date-subtitle">
            {FORMATTERS.year(person.birthyear)} -{" "}
            {person.deathyear
              ? `${FORMATTERS.year(person.deathyear)}`
              : "Today"}
          </p>
        ) : null}
        <pre>
          <Suspense fallback={<div>Loading...</div>}>
            <HeaderLine pageViewData={pageViewData} />
          </Suspense>
        </pre>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
