import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';
import Viz from "components/viz/Index";

import {COLORS_DOMAIN, FORMATTERS} from "types";

const Header = ({ pageviews, person }) => {

  const viewData = pageviews.map(d => {
    d.pageview_date = new Date(d.pageview_date);
    return d;
  }).sort((a, b) => a.pageview_date - b.pageview_date);
  const dates = viewData.map(d => d.pageview_date);
  const sparkTicks = [new Date(Math.min(...dates)), new Date(Math.max(...dates))];
  const sparkNums = sparkTicks.map(Number);
  const circleData = viewData.filter(d => sparkNums.includes(d.pageview_date.getTime()));
  const sparkData = viewData.concat([
    Object.assign({}, circleData[0], {shape: "Circle", person: "circle"}),
    Object.assign({}, circleData[1], {shape: "Circle", person: "circle"})
  ]);

  const backgroundColor = COLORS_DOMAIN[person.profession.domain_slug],
        backgroundImage = `url('/people/${person.wiki_id}.jpg')`;

  return (
    <header className='hero'>
      <div className='bg-container'>
        <div className='bg-img-mask person' style={{backgroundColor}}>
          <div className='bg-img bg-img-l' style={{backgroundColor, backgroundImage}}></div>
          <div className='bg-img bg-img-r' style={{backgroundColor, backgroundImage}}></div>
        </div>
      </div>
      <div className='info'>
        <p className='top-desc'>The Cultural Memory of</p>
        <h2 className='profile-type'>{person.profession.name}</h2>
        <h1 className='profile-name'>{person.name}</h1>
        <p className='date-subtitle'>{person.birthyear.name} - {person.deathyear ? `${person.deathyear.name}` : "Present"}</p>
        <pre>
          <Viz type="LinePlot"
               config={{
                 data: sparkData,
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
                 time: d => d.pageview_date,
                 timeline: false,
                 tooltipConfig: {
                   "body": d => `<span class="bold">${FORMATTERS.date(d.pageview_date)}</span>${FORMATTERS.commas(d.num_pageviews)}`,
                   "title": "Page Views (PV)"
                 },
                 width: 275,
                 x: d => d.pageview_date,
                 xConfig: {
                   barConfig: {"stroke-width": 0},
                   gridConfig: {"stroke-width": 0},
                   labels: sparkTicks,
                   shapeConfig: {
                     fill: "#4B4A48",
                     fontColor: "#4B4A48",
                     fontFamily: () => "Amiko",
                     fontSize: () => 8,
                     stroke: "#4B4A48"
                   },
                   tickFormat: d => new Date(d).getFullYear(),
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
                 y: d => d.num_pageviews,
                 yConfig: {
                   barConfig: {"stroke-width": 0},
                   labels: [],
                   title: false,
                   ticks: []
                 }
               }} />
        </pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
