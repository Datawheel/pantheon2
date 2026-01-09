"use client";

// import {Suspense} from "react";
import {max as D3Max, min as D3Min} from "d3-array";
import dayjs from "dayjs";
import {Tooltip} from "@blueprintjs/core";
// import HeaderLine from "./HeaderLine";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {LOCALE_NAMES} from "/app/locales";
import {getTranslations} from "/app/translations";
import "../../styles/Header.css";
import "../../styles/mouse.css";

// async function getWikiPageViews(personName) {
//   const wikiSlug = personName.replace(/ /g, "_");
//   const dateobj = new Date();
//   const year = dateobj.getFullYear();
//   // need to add 1 since getMonth is zero based
//   const month = `${dateobj.getMonth() + 1}`.replace(
//     /(^|\D)(\d)(?!\d)/g,
//     "$10$2"
//   );
//   const res = await fetch(
//     `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${wikiSlug}/monthly/20110101/${year}${month}01`
//   );
//   return res.json();
// }

// async function getIsTrending(personId) {
//   const dateobj = new Date();
//   dateobj.setDate(dateobj.getDate() - 29);
//   const year1monthAgo = dateobj.getFullYear();
//   // need to add 1 since getMonth is zero based
//   const month1monthAgo = `${dateobj.getMonth() + 1}`.replace(
//     /(^|\D)(\d)(?!\d)/g,
//     "$10$2"
//   );
//   const day1monthAgo = `${dateobj.getDate()}`.replace(
//     /(^|\D)(\d)(?!\d)/g,
//     "$10$2"
//   );
//   const monthAgo = `${year1monthAgo}-${month1monthAgo}-${day1monthAgo}`;
//   const res = await fetch(
//     `https://api.pantheon.world/trend?date=gte.${monthAgo}&pid=eq.${personId}&rank_pantheon=lte.100`
//   );
//   return res.json();
// }

export default function Header({person, trendingData = {}, currentLang = "en"}) {
  const t = getTranslations(currentLang);

  // const {items: wikiPageViews} = await getWikiPageViews(person.name);
  const wikiPageViews = null;
  // const isTrendingData = await getIsTrending(person.id);
  // const isTrending = !!isTrendingData.length;

  let pageViewData = null;
  if (wikiPageViews) {
    // Need to chop off the last month since it is incomplete
    pageViewData = wikiPageViews.slice(0, wikiPageViews.length - 1).map(pv => ({
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
    backgroundImage = `url('https://static.pantheon.world/profile/people/${person.wp_id}.jpg')`;

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
        {/* Language rank badges */}
        {trendingData.isTrending && trendingData.ranksByLang && (
          <div className="language-rank-badges-header">
            {Object.entries(trendingData.ranksByLang)
              .sort(([langA, rankA], [langB, rankB]) => {
                if (langA === currentLang) return -1;
                if (langB === currentLang) return 1;
                return rankA - rankB;
              })
              .slice(0, 5)
              .map(([langCode, rank]) => (
                <Tooltip
                  key={langCode}
                  content={`Rank #${rank} in ${LOCALE_NAMES[langCode]}`}
                >
                  <div
                    className={`lang-rank-badge ${langCode === currentLang ? 'current-lang' : ''}`}
                  >
                    <span className="lang-code">{langCode.toUpperCase()}</span>
                    <span className="lang-rank">{rank}</span>
                  </div>
                </Tooltip>
              ))}
          </div>
        )}

        {/* {isTrending ? <div className="trending-cont">Trending</div> : null} */}
        <h2 className="profile-type">
          {person.occupation ? person.occupation.occupation : ""}
        </h2>
        <h1 className="profile-name">{person.name}</h1>
        {person.birthyear ? (
          <p className="date-subtitle">
            {FORMATTERS.year(person.birthyear)} -{" "}
            {person.deathyear
              ? `${FORMATTERS.year(person.deathyear)}`
              : t.stillAlive}
          </p>
        ) : null}
        {/* <pre>
          <Suspense fallback={<div>Loading...</div>}>
            <HeaderLine pageViewData={pageViewData} />
          </Suspense>
        </pre> */}
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
