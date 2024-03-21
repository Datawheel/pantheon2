import {Suspense} from "react";
import {max as D3Max, min as D3Min} from "d3-array";
import dayjs from "dayjs";
import HeaderLine from "./HeaderLine";
import "../../styles/Header.css";
import "../../styles/mouse.css";

async function getWikiPageViews(countryName) {
  const dateobj = new Date();
  const year = dateobj.getFullYear();
  const month = `${dateobj.getMonth() + 1}`.replace(
    /(^|\D)(\d)(?!\d)/g,
    "$10$2"
  );
  const res = await fetch(
    `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${countryName}/monthly/20110101/${year}${month}01`
  );
  return res.json();
}

export default async function Header({country}) {
  const {items: wikiPageViews} = await getWikiPageViews(country.country);

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

  const countryImg = country.img_link
    ? `/images/profile/country/${country.slug}.jpg`
    : "/images/profile/placeholder_place_profile.jpg";

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
