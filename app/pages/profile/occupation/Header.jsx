import React from "react";
import PropTypes from "prop-types";
import "pages/profile/common/Header.css";
import "components/common/mouse.css";
import {COLORS_DOMAIN} from "types";
import {plural} from "pluralize";
import {LinePlot} from "d3plus-react";
import {min, histogram} from "d3-array";
import {FORMATTERS} from "types";
import {ckmeans} from "d3plus-legend";

const Header = ({occupation, people}) => {
  // determine number of buckets based on count of people
  let numBuckets = 20;
  if (people.length < 40) {
    numBuckets = 10;
  }
  if (people.length < 10) {
    numBuckets = people.length;
  }

  // create histogram using ckmeans
  const b2 = histogram().thresholds(data => ckmeans(data, numBuckets).map(l => min(l)))(people.map(d => d.birthyear));

  // get max top 3 people to show in tooltip
  const lineChartDataFormat = b2.map(bin => {
    const topPeople = people
      .filter(p => (p.birthyear >= bin.x0 || 0) && (p.birthyear < bin.x1 || 0))
      .sort((a, b) => b.hpi - a.hpi)
      .slice(0, 3);
    return {
      y: bin.length,
      x: bin.x0 || 0,
      binName: `${bin.x0 || 0} - ${bin.x1 - 1 || 0}`,
      topPeople
    };
  });

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people.slice(0, 4).map(p =>
              <img key={p.id} src={`/images/profile/people/${p.id}.jpg`} />
            )}
          </div>
          <div className="bg-img bg-img-b">
            {people.slice(5, 9).map(p =>
              <img key={p.id} src={`/images/profile/people/${p.id}.jpg`} />
            )}
          </div>
          <div style={{backgroundColor: COLORS_DOMAIN[occupation.domain_slug]}} className="bg-img-mask-after"></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">Occupation</h2>
        <h1 className="profile-name">{plural(occupation.occupation)}</h1>
        <pre>
          <LinePlot
            config={{
              data: lineChartDataFormat,
              discrete: "x",
              height: 100,
              // groupBy: "binName",
              legend: false,
              shape: "Line",
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
              timeline: false,
              tooltipConfig: {
                body: d => {
                  const topPeople = d.topPeople instanceof Array ? d.topPeople : [d.topPeople];
                  let txt = `<span class='sub'>Top Ranked ${topPeople.length === 1 ? "Person" : "People"}</span>`;
                  // const peopleNames = d.topPeople.map(d => d.name);
                  topPeople.forEach(n => {
                    txt += `<br /><span class="bold">${n.name}</span> b.${FORMATTERS.year(n.birthyear)}`;
                  });
                  return txt;
                },
                footer: d => `${FORMATTERS.commas(d.y)} Total Births`,
                title: d => `<span class="center">${d.binName}</span>`,
                titleStyle: {"text-align": "center"},
                width: "200px",
                footerStyle: {
                  "font-size": "12px",
                  "text-transform": "none",
                  "color": "#4B4A48"
                }
              },
              width: 275,
              // groupBy: () => "line",
              xConfig: {
                tickFormat: s => `${s}`
              },
              y: d => d.y,
              x: d => `${d.x}`,
              // time: d => d.x,
              yConfig: {labels: [], ticks: [], title: "Births"}
            }} />
        </pre>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
};

Header.propTypes = {
  occupation: PropTypes.object
};

export default Header;
