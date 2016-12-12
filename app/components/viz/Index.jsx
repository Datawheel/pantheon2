import React, {Component, PropTypes} from "react";

import tooltipCSS from "css/components/viz/tooltip.css";
import vizCSS from "css/components/viz/viz.css";

import {default as axesStyle} from "css/components/viz/axes.js";
import {default as legendStyle} from "css/components/viz/legend.js";
import {default as shapeStyle} from "css/components/viz/shape.js";
import {default as timelineStyle} from "css/components/viz/timeline.js";
import {default as tooltipStyle} from "css/components/viz/tooltip.js";

import {strip} from "d3plus-text";

import {Geomap} from "d3plus-geomap";
import {Treemap} from "d3plus-hierarchy";
import {LinePlot, StackedArea} from "d3plus-plot";
import {Priestley} from "d3plus-priestley";
const types = {Geomap, LinePlot, Priestley, StackedArea, Treemap};

import {default as topojson} from "json/world-50m.json";

import {COLORS_DOMAIN} from "types";


const uniques = ["birthyear", "deathyear", "id", "profession_id"].reduce((obj, k) => {
  obj[k] = a => {
    const v = Array.from(new Set(a));
    return v.length === 1 ? v[0] : v;
  }
  return obj;
}, {});

class Viz extends Component {

  constructor() {
    super();
    this.state = {
      layout: "none"
    };
  }

  componentDidMount() {

    // Grabs config from props.
    const {config, type} = this.props;

    // Preps attribute list from config, and removes it when done.
    const attrs = config.attrs ? config.attrs.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {}) : false;
    delete config.attrs;

    // Preps groupBy, using attrs if necessary.
    config.groupBy = config.groupBy ? attrs ? (config.groupBy instanceof Array ? config.groupBy : [config.groupBy]).map(function(g) {
      return function(d) {

        let val;

        if (d[g]) val = d[g];
        else if (d.profession_id instanceof Array) val = attrs[d.profession_id[0]][g];
        else val = attrs[d.profession_id][g];

        return val;

      }
    }) : config.groupBy : ["id"];

    config.data.forEach(d => {
      if (d.profession_id !== void 0) d.profession_id = `${d.profession_id}`;
    });

    if (config.time) config.timeFilter = () => true;

    switch(this.props.type) {
      case "Treemap":
        config.sum = d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0;
        break;
      case "Priestley":
        if (!config.shapeConfig) config.shapeConfig = {};
        config.shapeConfig.labelPadding = 2;
        break;
      case "Geomap":
        config.ocean = false;
        config.pointSizeMax = 35;
        config.pointSizeMin = 8;
        config.shapeConfig = {
          fill: d => d.event.toLowerCase().indexOf("birth") > 0 ? "rgba(76, 94, 215, 0.4)" : "rgba(95, 1, 22, 0.4)",
          stroke: () => "#4A4948",
          strokeWidth: 1,
          Path: {
            fill: "transparent",
            stroke: "#4A4948",
            strokeWidth: 0.75
          }
        };
        config.tiles = false;
        config.topojson = topojson;
        config.zoom = false;
      default:
        break;
    }

    // Draws the visualization!
    const viz = new types[type]()
      .aggs(uniques)
      .depth(0)
      .config(axesStyle)
      .shapeConfig(shapeStyle)
      .legendConfig(legendStyle)
      .timelineConfig(timelineStyle)
      .tooltipConfig(tooltipStyle)
      .shapeConfig({
        fill: d => {
          if (d.color) return d.color;
          else if (attrs && d.profession_id !== void 0) {
            let occ = d.profession_id.constructor === Array ? d.profession_id[0] : d.profession_id;
            return COLORS_DOMAIN[attrs[occ].domain_slug];
          }
          return "#ccc";
        }
      })
      .tooltipConfig({
        body: d => {
          if (!(d.name instanceof Array) && viz.groupBy()[viz.depth()](d) === d.name) {
            const age = d.deathyear !== null
                      ? d.deathyear - d.birthyear
                      : new Date().getFullYear() - d.birthyear;
            return d.deathyear !== null
                 ? `<span class="center">${d.birthyear} - ${d.deathyear}, ${age} years old</span>`
                 : `<span class="center">Born ${d.birthyear}, ${age} years old</span>`;
          }
          const names = d.name instanceof Array ? d.name.slice(0, 3) : [d.name];
          let txt = `<span class='sub'>Notable ${names.length === 1 ? "Person" : "People"}</span>`;
          let people = config.data.filter(d => names.includes(d.name));
          const peopleNames = people.map(d => d.name);
          people.filter((d, i) => peopleNames.indexOf(d.name) === i).slice(0, 3).forEach(n => {
            txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
          });
          return txt;
        }
      })
      .select(this.refs.svg)
      .config(config);

    setTimeout(() => {
      this.setState({viz});
    }, 500);

  }

  componentDidUpdate() {

    const {viz} = this.state;
    if (viz) viz.render();

  }

  handleLayout(e) {
    const layout = e.currentTarget.dataset.value;
    this.state.viz.stackOffset(layout);
    this.setState({layout});
  }

  render() {
    const {title, type} = this.props;
    const {height, width} = this.props.config;
    return (
      <div className="viz">
        { title ?
          <div className="rank-title">
            <h3>{ title }</h3>
            <a href="#">Keep Exploring</a>
          </div>
        : null }
        { type === "StackedArea"
          ? <div className="controls">
              <span className="title">Y-Axis:</span>
              <span onClick={this.handleLayout.bind(this)} data-value="none" className={`toggle ${this.state.layout === "none" ? "active" : ""}`}>Number of People</span>
              <span onClick={this.handleLayout.bind(this)} data-value="expand" className={`toggle ${this.state.layout === "expand" ? "active" : ""}`}>Share</span>
            </div>
        : null }
        <svg ref="svg" style={{width: width || "100%", height: height || 600}}></svg>
      </div>
    );
  }
};

export default Viz;
