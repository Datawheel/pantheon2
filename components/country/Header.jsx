import {Suspense} from "react";
import {max as D3Max, min as D3Min} from "d3-array";
import dayjs from "dayjs";
import HeaderLine from "./HeaderLine";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({country, wikiPageViews}) {
  const wikiPageViewItems = wikiPageViews?.items || null;

  let pageViewData = null;
  if (wikiPageViewItems) {
    pageViewData = wikiPageViewItems.map(pv => ({
      ...pv,
      date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(
        4,
        6,
      )}/${pv.timestamp.substring(6, 8)}`,
    }));
    const mostRecentDate = D3Max(pageViewData, d =>
      dayjs(d.date, "YYYY/MM/DD"),
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

  const countryImg = country.img_link
    ? `https://static.pantheon.world/profile/country/${country.slug}.jpg`
    : "https://static.pantheon.world/profile/placeholder_place_profile.jpg";

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask place">
          <div
            className="bg-img bg-img-t"
            style={{backgroundImage: `url(${countryImg})`}}
          ></div>
          <div
            className="bg-img bg-img-b"
            style={{backgroundImage: `url(${countryImg})`}}
          ></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>
        <h1 className="profile-name">{country.country}</h1>
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
