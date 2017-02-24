import React, {PropTypes} from "react";
import "css/components/profile/header";
import sparklineSvg from "images/sparkline.svg";
import {COLORS_DOMAIN} from "types";
import {plural} from "pluralize";
import {LinePlot} from "d3plus-react";

const Header = ({occupation, people}) => {

  const dates = people.map(d => new Date(`${d.birthyear}`)).sort((a, b) => a - b);
  const sparkTicks = [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
  let count = 1;
  const dateAndPeopleCount = dates.map(y => ({year: y, count: count++}));

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people.slice(0, 4).map(p =>
              <img key={p.id} src={`/people/${p.id}.jpg`} />
            )}
          </div>
          <div className="bg-img bg-img-b">
            {people.slice(5, 9).map(p =>
              <img key={p.id} src={`/people/${p.id}.jpg`} />
            )}
          </div>
          <div style={{backgroundColor: COLORS_DOMAIN[occupation.domain_slug]}} className="bg-img-mask-after"></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production of</p>
        <h2 className="profile-type">Occupation</h2>
        <h1 className="profile-name">{plural(occupation.occupation)}</h1>
        <pre>
          <LinePlot
             config={{
               data: dateAndPeopleCount,
               height: 100,
               groupBy: "person",
               legend: false,
               shape: d => d.shape || "Line",
               shapeConfig: {
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
               time: d => d.year,
               timeline: false,
               width: 275,
               x: d => d.year,
               xConfig: {
                 barConfig: {"stroke-width": 0},
                 labels: sparkTicks,
                 shapeConfig: {
                   fill: "#4B4A48",
                   fontColor: "#4B4A48",
                   fontSize: () => 8,
                   stroke: "#4B4A48"
                 },
                 ticks: sparkTicks,
                 tickSize: 0,
                 title: "PAGE VIEWS (PV)",
                 titleConfig: {
                   fontColor: "#4B4A48",
                   fontFamily: () => "Amiko",
                   fontSize: () => 10,
                   stroke: "#4B4A48"
                 }
               },
               y: d => d.count
             }} />
        </pre>
      </div>
    </header>
  );
};

Header.propTypes = {
  occupation: PropTypes.object
};

export default Header;
