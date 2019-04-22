import React from "react";
import PropTypes from "prop-types";
import "pages/profile/common/Header.css";
import "components/common/mouse.css";
import {LinePlot} from "d3plus-react";
import {max as D3Max, min as D3Min} from "d3-array";
import moment from "moment";

import {COLORS_DOMAIN, FORMATTERS} from "types";

const Header = ({person, wikiPageViews}) => {

  // const viewData = pageViews.map(d => {
  //   d.pageview_date = typeof d.pageview_date === "string" ? new Date(d.pageview_date.replace("Z", "")) : d.pageview_date;
  //   return d;
  // }).sort((a, b) => a.pageview_date - b.pageview_date);
  // const dates = viewData.map(d => d.pageview_date);

  // const sparkTicks = [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
  // const sparkNums = sparkTicks.map(Number);
  // const circleData = viewData.filter(d => sparkNums.includes(d.pageview_date.getTime()));
  // const sparkData = viewData.concat([
  //   Object.assign({}, circleData[0], {shape: "Circle", person: "circle"}),
  //   Object.assign({}, circleData[1], {shape: "Circle", person: "circle"})
  // ]);
  let pageViewData = null;
  if (wikiPageViews) {
    if (wikiPageViews.items) {
      pageViewData = wikiPageViews.items.map(pv => ({...pv, date: `${pv.timestamp.substring(0, 4)}/${pv.timestamp.substring(4, 6)}/${pv.timestamp.substring(6, 8)}`}));
      const mostRecentDate = D3Max(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
      const oldestDate = D3Min(pageViewData, d => moment(d.date, "YYYY/MM/DD"));
      pageViewData.push({...pageViewData.find(d => d.date === oldestDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
      pageViewData.push({...pageViewData.find(d => d.date === mostRecentDate.format("YYYY/MM/DD")), shape: "Circle", article: "circle"});
    }
  }

  const backgroundColor = COLORS_DOMAIN[person.occupation.domain],
        backgroundImage = `url('/images/profile/people/${person.wp_id}.jpg')`;

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask person" style={{backgroundColor}}>
          <div className="bg-img bg-img-l" style={{backgroundColor, backgroundImage}}></div>
          <div className="bg-img bg-img-r" style={{backgroundColor, backgroundImage}}></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">{person.occupation.occupation}</h2>
        <h1 className="profile-name">{person.name}</h1>
        {person.birthyear
          ? <p className="date-subtitle">{FORMATTERS.year(person.birthyear)} - {person.deathyear ? `${FORMATTERS.year(person.deathyear)}` : "Today"}</p>
          : null}
        <pre>
          {pageViewData
            ? <LinePlot
              config={{
                data: pageViewData,
                height: 150,
                groupBy: "article",
                legend: false,
                on: {

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
                    fontFamily: () => "Amiko",
                    fontSize: () => 11,
                    stroke: "#4B4A48"
                  }
                },
                y: d => d.views,
                yConfig: {labels: [], ticks: [], title: false}
              }} />
            : null}
        </pre>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
};

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
