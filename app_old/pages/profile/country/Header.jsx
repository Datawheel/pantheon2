import React from "react";
import PropTypes from "prop-types";
import "pages/profile/common/Header.css";
import "components/common/mouse.css";
import {FORMATTERS} from "types/index";
import {nest} from "d3-collection";
import {LinePlot} from "d3plus-react";
import {max as D3Max, min as D3Min} from "d3-array";
import moment from "moment";

const Header = ({country, people, wikiSummary, wikiPageViews}) => {
  let pageViewData = null;
  const countryImg = country.img_link ? `/images/profile/country/${country.slug}.jpg` : "/images/profile/placeholder_place_profile.jpg";

  // wikipedia summary
  // if (wikiSummary) {
  //   if (wikiSummary.originalimage) {
  //     countryImg = wikiSummary.originalimage.source;
  //   }
  // }

  if (wikiPageViews) {
    if (wikiPageViews.items) {
      pageViewData = wikiPageViews.items.map(pv => ({...pv, date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(4, 6)}/${pv.timestamp.substring(6, 8)}`}));
      const mostRecentDate = D3Max(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
      const oldestDate = D3Min(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
      pageViewData.push({...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
      pageViewData.push({...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
    }
  }

  /**
   * OLD CODE FOR SPARK LINES
   */
  // const yearAndCount = nest()
  //   .key(p => p.birthyear)
  //   .rollup(leaves => ({count: leaves.length, birthyear: leaves[0].birthyear}))
  //   .entries(people.filter(p => p.birthyear))
  //   .sort((a, b) => a.value.birthyear - b.value.birthyear)
  //   .map(d => Object.assign({}, d.value, {id: "line", txt: `${d.value.count} birth(s) in ${d.value.birthyear}`}));

  // const sparkData = yearAndCount.concat([
  //   Object.assign({}, yearAndCount[0], {shape: "Circle", id: "circle"}),
  //   Object.assign({}, yearAndCount[yearAndCount.length - 1], {shape: "Circle", id: "circle"})
  // ]);

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask place">
          <div className="bg-img bg-img-t" style={{backgroundImage: `url(${countryImg})`}}></div>
          <div className="bg-img bg-img-b" style={{backgroundImage: `url(${countryImg})`}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>
        <h1 className="profile-name">{country.country}</h1>
        <pre>
          {pageViewData
            ? <LinePlot
              config={{
                data: pageViewData,
                discrete: "x",
                groupBy: "article",
                height: 120,
                legend: false,
                on: {
                  // "click.shape": () => {},
                  // "mouseenter.shape": () => {},
                  // "mousemove.shape": () => {},
                  // "mouseleave.shape": () => {}
                },
                shape: d => d.shape || "Line",
                shapeConfig: {
                  hoverOpacity: 1,
                  Circle: {
                    fill: "#4B4A48",
                    r: () => 3.5
                  },
                  Line: {
                    fill: "none",
                    stroke: "#4B4A48",
                    strokeWidth: 1
                  }
                },
                time: d => d.date,
                timeline: false,
                tooltipConfig: {
                  footer: d => `${FORMATTERS.commas(d.views)} Page Views`,
                  title: d => `<span class="center">${moment(d.date, "YYYY/MM/DD").format("MMMM YYYY")}</span>`,
                  titleStyle: {"text-align": "center"},
                  width: "200px",
                  footerStyle: {
                    "font-size": "12px",
                    "text-transform": "none",
                    "color": "#4B4A48"
                  }
                },
                width: 275,
                x: d => d.date,
                xConfig: {
                  barConfig: {"stroke-width": 0},
                  // labels: sparkTicks,
                  shapeConfig: {
                    fill: "#4B4A48",
                    fontColor: "#4B4A48",
                    fontSize: () => 8,
                    stroke: "#4B4A48"
                  },
                  // ticks: sparkTicks,
                  tickSize: 0,
                  tickFormat: d => {
                    if (typeof d === "number") return new Date(d).getFullYear();
                    return d;
                  },
                  title: "EN.WIKIPEDIA PAGE VIEWS (PV)",
                  titleConfig: {
                    fontColor: "#4B4A48",
                    fontFamily: () => ["Amiko", "Arial Narrow", "sans-serif"],
                    fontSize: () => 11,
                    stroke: "#4B4A48"
                  }
                },
                y: d => d.views,
                yConfig: {labels: [], ticks: [], title: ""}
              }} /> : null}
        </pre>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
};

Header.propTypes = {
  country: PropTypes.object
};

export default Header;
