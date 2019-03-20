import React from "react";
import PropTypes from "prop-types";
import "pages/profile/common/Header.css";
import "components/common/mouse.css";
import {FORMATTERS} from "types/index";
import {nest} from "d3-collection";
import {LinePlot} from "d3plus-react";

const Header = ({country, people, place, wikiSummary, wikiPageViews}) => {
  let pageViewData = null;
  let placeImg = place.img_link ? `/images/profile/place/${place.id}.jpg` : country.img_link ? `/images/profile/place/${country.id}.jpg` : "/images/profile/placeholder_place_profile.jpg";
  // wikipedia summary
  if (wikiSummary) {
    if (wikiSummary.originalimage) {
      placeImg = wikiSummary.originalimage.source;
    }
  }

  if (wikiPageViews) {
    if (wikiPageViews.items) {
      pageViewData = wikiPageViews.items.map(pv => ({...pv, date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(4, 6)}/${pv.timestamp.substring(6, 8)}`}));
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
          <div className="bg-img bg-img-t" style={{backgroundImage: `url(${placeImg})`}}></div>
          <div className="bg-img bg-img-b" style={{backgroundImage: `url(${placeImg})`}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>
        <h1 className="profile-name">{place.name}</h1>
        { place.name !== place.country_name ? <p className="date-subtitle"><a href={`/profile/place/${country.slug}`}>{place.country_name}</a></p> : null}
        {/* <p className="date-subtitle">{ FORMATTERS.year(country.soverign_date) === 0 ? "1AD" : FORMATTERS.year(country.soverign_date) } - Today</p> */}
        <pre>
          {pageViewData
            ? <LinePlot
              config={{
                data: pageViewData,
                height: 120,
                groupBy: "article",
                legend: false,
                on: {
                  "click.shape": () => {},
                  "mouseenter.shape": () => {},
                  "mousemove.shape": () => {},
                  "mouseleave.shape": () => {}
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
                  body: d => d.views,
                  title: "Page Views"
                },
                width: 275,
                x: d => d.date,
                xConfig: {
                // barConfig: {"stroke-width": 0},
                // labels: sparkTicks,
                // shapeConfig: {
                //   fill: "#4B4A48",
                //   fontColor: "#4B4A48",
                //   fontSize: () => 8,
                //   stroke: "#4B4A48"
                // },
                // ticks: sparkTicks,
                // tickSize: 0,
                // title: "Count",
                  titleConfig: {
                    fontColor: "#4B4A48",
                    fontFamily: () => "Amiko",
                    fontSize: () => 10,
                    stroke: "#4B4A48"
                  },
                  tickFormat: d => {
                    if (typeof d === "number") return new Date(d).getFullYear();
                    return d;
                  },
                  title: "page views"
                },
                y: d => d.views,
                yConfig: {labels: [], ticks: [], title: "page views"}
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
  country: PropTypes.object,
  place: PropTypes.object
};

export default Header;
