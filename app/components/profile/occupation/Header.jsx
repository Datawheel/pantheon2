import React, {PropTypes} from "react";
import "css/components/profile/header";
import {COLORS_DOMAIN} from "types";
import {plural} from "pluralize";
import {nest} from "d3-collection";
import {LinePlot} from "d3plus-react";

const Header = ({occupation, people}) => {

  const yearAndCount = nest()
    .key(p => p.bucketyear)
    .rollup(leaves => ({count: leaves.length, bucketyear: leaves[0].bucketyear}))
    .entries(people.filter(p => p.bucketyear))
    .sort((a, b) => a.value.bucketyear - b.value.bucketyear)
    .map(d => Object.assign({}, d.value, {id: "line", txt: `${d.value.count} birth(s) between ${d.value.bucketyear - 49} and ${d.value.bucketyear}`}));

  const sparkData = yearAndCount.concat([
    Object.assign({}, yearAndCount[0], {shape: "Circle", id: "circle"}),
    Object.assign({}, yearAndCount[yearAndCount.length - 1], {shape: "Circle", id: "circle"})
  ]);

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
             data: sparkData,
             height: 100,
             groupBy: "id",
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
             time: d => d.bucketyear,
             timeline: false,
             tooltipConfig: {
               body: d => d.txt,
               title: "Individuals Born"
             },
             width: 275,
             x: d => d.bucketyear,
            //  xConfig: {
            //    barConfig: {"stroke-width": 0},
            //    labels: sparkTicks,
            //    shapeConfig: {
            //      fill: "#4B4A48",
            //      fontColor: "#4B4A48",
            //      fontSize: () => 8,
            //      stroke: "#4B4A48"
            //    },
            //    ticks: sparkTicks,
            //    tickSize: 0,
            //    title: "Count",
            //    titleConfig: {
            //      fontColor: "#4B4A48",
            //      fontFamily: () => "Amiko",
            //      fontSize: () => 10,
            //      stroke: "#4B4A48"
            //    }
            //  },
             y: d => d.count,
             yConfig: {labels: [], ticks: [], title: false}
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
