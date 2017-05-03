import React, {PropTypes} from "react";
import "css/components/profile/header";
import "css/components/utils/mouse";
import {FORMATTERS} from "types";
import {nest} from "d3-collection";
import {LinePlot} from "d3plus-react";

const Header = ({country, people, place}) => {
  const placeImg = place.img_link ? `/place/${place.id}.jpg` : country.img_link ? `/place/${country.id}.jpg` : placeholderImg;

  const yearAndCount = nest()
    .key(p => p.birthyear)
    .rollup(leaves => ({count: leaves.length, birthyear: leaves[0].birthyear}))
    .entries(people.filter(p => p.birthyear))
    .sort((a, b) => a.value.birthyear - b.value.birthyear)
    .map(d => Object.assign({}, d.value, {id: "line", txt: `${d.value.count} birth(s) in ${d.value.birthyear}`}));

  const sparkData = yearAndCount.concat([
    Object.assign({}, yearAndCount[0], {shape: "Circle", id: "circle"}),
    Object.assign({}, yearAndCount[yearAndCount.length - 1], {shape: "Circle", id: "circle"})
  ]);

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
        <p className="date-subtitle">{ FORMATTERS.year(country.soverign_date) === 0 ? "1AD" : FORMATTERS.year(country.soverign_date) } - Present</p>
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
               time: d => d.birthyear,
               timeline: false,
               tooltipConfig: {
                 body: d => d.txt,
                 title: "Individuals Born"
               },
               width: 275,
               x: d => d.birthyear,
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
