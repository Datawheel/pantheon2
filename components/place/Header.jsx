import { Suspense } from "react";
import { max as D3Max, min as D3Min } from "d3-array";
import dayjs from "dayjs";
import HeaderLine from "./HeaderLine";
import "../../styles/Header.css";
import "../../styles/mouse.css";

async function getWikiPageViews(placeName) {
  const wikiSlug = placeName;
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

async function getWikiSummary(placeName) {
  const wikiSlug = placeName;
  const res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`
  );
  return res.json();
}

export default async function Header({ place, country }) {
  const { items: wikiPageViews } = await getWikiPageViews(place.place);
  const wikiSummary = await getWikiSummary(place.place);

  let pageViewData = null;
  if (wikiPageViews) {
    pageViewData = wikiPageViews.map((pv) => ({
      ...pv,
      date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(
        4,
        6
      )}/${pv.timestamp.substring(6, 8)}`,
    }));
    const mostRecentDate = D3Max(pageViewData, (d) =>
      dayjs(d.date, "YYYY/MM/DD")
    );
    const oldestDate = D3Min(pageViewData, (d) => dayjs(d.date, "YYYY/MM/DD"));
    pageViewData.push({
      ...pageViewData.find((d) => d.date === oldestDate.format("YYYY/MM/DD")),
      shape: "Circle",
      article: "circle",
    });
    pageViewData.push({
      ...pageViewData.find(
        (d) => d.date === mostRecentDate.format("YYYY/MM/DD")
      ),
      shape: "Circle",
      article: "circle",
    });
  }

  let placeImg = place.img_link
    ? `/images/profile/place/${place.id}.jpg`
    : country && country.img_link
    ? `/images/profile/place/${country.id}.jpg`
    : "/images/profile/placeholder_place_profile.jpg";
  if (wikiSummary?.originalimage) {
    placeImg = wikiSummary.originalimage.source;
  }
  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask place">
          <div
            className="bg-img bg-img-t"
            style={{ backgroundImage: `url(${placeImg})` }}
          ></div>
          <div
            className="bg-img bg-img-b"
            style={{ backgroundImage: `url(${placeImg})` }}
          ></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>

        {country && country.country_code ? (
          <h1 className="profile-name">
            {place.place} ({country.country_code})
          </h1>
        ) : (
          <h1 className="profile-name">{place.place}</h1>
        )}

        {country ? (
          <p className="date-subtitle">
            <a href={`/profile/country/${country.slug}`}>{country.country}</a>
          </p>
        ) : null}
        {/* <p className="date-subtitle">{ FORMATTERS.year(country.soverign_date) === 0 ? "1AD" : FORMATTERS.year(country.soverign_date) } - Today</p> */}
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

// import React from "react";
// import PropTypes from "prop-types";
// import "pages/profile/common/Header.css";
// import "components/common/mouse.css";
// import {FORMATTERS} from "types/index";
// import {nest} from "d3-collection";
// import {LinePlot} from "d3plus-react";
// import {max as D3Max, min as D3Min} from "d3-array";
// import moment from "moment";

// const Header = ({country, people, place, wikiSummary, wikiPageViews}) => {
//   let pageViewData = null;
//   let placeImg = place.img_link ? `/images/profile/place/${place.id}.jpg` : country && country.img_link ? `/images/profile/place/${country.id}.jpg` : "/images/profile/placeholder_place_profile.jpg";
//   // wikipedia summary
//   if (wikiSummary) {
//     if (wikiSummary.originalimage) {
//       placeImg = wikiSummary.originalimage.source;
//     }
//   }

//   if (wikiPageViews) {
//     if (wikiPageViews.items) {
//       pageViewData = wikiPageViews.items.map(pv => ({...pv, date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(4, 6)}/${pv.timestamp.substring(6, 8)}`}));
//       const mostRecentDate = D3Max(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
//       const oldestDate = D3Min(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
//       pageViewData.push({...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
//       pageViewData.push({...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
//     }
//   }

//   return (
//     <header className="hero">
//       <div className="bg-container">
//         <div className="bg-img-mask place">
//           <div className="bg-img bg-img-t" style={{backgroundImage: `url(${placeImg})`}}></div>
//           <div className="bg-img bg-img-b" style={{backgroundImage: `url(${placeImg})`}}></div>
//         </div>
//       </div>
//       <div className="info">
//         <p className="top-desc">Cultural Production in</p>
//         <h2 className="profile-type">Present Day</h2>

//         {country && country.country_code
//           ? <h1 className="profile-name">{place.place} ({country.country_code})</h1>
//           : <h1 className="profile-name">{place.place}</h1>
//         }

//         {country ? <p className="date-subtitle"><a href={`/profile/country/${country.slug}`}>{country.country}</a></p> : null}
//         {/* <p className="date-subtitle">{ FORMATTERS.year(country.soverign_date) === 0 ? "1AD" : FORMATTERS.year(country.soverign_date) } - Today</p> */}
//         <pre>
//           {pageViewData
//             ? <LinePlot
//               config={{
//                 data: pageViewData,
//                 discrete: "x",
//                 height: 120,
//                 groupBy: "article",
//                 legend: false,
//                 shape: d => d.shape || "Line",
//                 shapeConfig: {
//                   hoverOpacity: 1,
//                   Circle: {
//                     fill: "#4B4A48",
//                     r: () => 3.5
//                   },
//                   Line: {
//                     fill: "none",
//                     stroke: "#4B4A48",
//                     strokeWidth: 1
//                   }
//                 },
//                 time: d => d.date,
//                 timeline: false,
//                 tooltipConfig: {
//                   footer: d => `${FORMATTERS.commas(d.views)} Page Views`,
//                   title: d => `<span class="center">${moment(d.date, "YYYY/MM/DD").format("MMMM YYYY")}</span>`,
//                   titleStyle: {"text-align": "center"},
//                   width: "200px",
//                   footerStyle: {
//                     "font-size": "12px",
//                     "text-transform": "none",
//                     "color": "#4B4A48"
//                   }
//                 },
//                 width: 275,
//                 x: d => d.date,
//                 xConfig: {
//                   barConfig: {"stroke-width": 0},
//                   // labels: sparkTicks,
//                   shapeConfig: {
//                     fill: "#4B4A48",
//                     fontColor: "#4B4A48",
//                     fontSize: () => 8,
//                     stroke: "#4B4A48"
//                   },
//                   // ticks: sparkTicks,
//                   tickSize: 0,
//                   tickFormat: d => {
//                     if (typeof d === "number") return new Date(d).getFullYear();
//                     return d;
//                   },
//                   title: "EN.WIKIPEDIA PAGE VIEWS (PV)",
//                   titleConfig: {
//                     fontColor: "#4B4A48",
//                     fontFamily: () => ["Amiko", "Arial Narrow", "sans-serif"],
//                     fontSize: () => 11,
//                     stroke: "#4B4A48"
//                   }
//                 },
//                 y: d => d.views,
//                 yConfig: {labels: [], ticks: [], title: ""}
//               }} /> : null}
//         </pre>
//       </div>
//       <div className="mouse">
//         <span className="mouse-scroll"></span>
//       </div>
//     </header>
//   );
// };

// Header.propTypes = {
//   country: PropTypes.object,
//   place: PropTypes.object
// };

// export default Header;
