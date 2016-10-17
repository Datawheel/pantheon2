import React, {Component, PropTypes} from "react";

import {LinePlot} from "d3plus-plot";
import {Treemap} from "d3plus-treemap";
const types = {LinePlot, Treemap};

const colors = {
  "sports": "#BB3B57",
  "science & technology": "#0E5E5B",
  "public figure": "#67AF8C",
  "institutions": "#B12D11",
  "humanities": "#732945",
  "exploration": "#4C5ED7",
  "business & law": "#4F680A",
  "arts": "#D28629"
};

const uniques = ["birthyear", "id"].reduce((obj, k) => {
  obj[k] = a => {
    const v = Array.from(new Set(a));
    return v.length === 1 ? v[0] : v;
  }
  return obj;
}, {});

class Viz extends Component {

  componentDidMount() {

    // if (this.props.type !== "Treemap") return;

    // Grabs config from props.
    const {config} = this.props;

    // Preps attribute list from config, and removes it when done.
    const attrs = config.attrs ? config.attrs.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {}) : {};
    delete config.attrs;

    // Preps groupBy, using attrs if necessary.
    config.groupBy = config.groupBy ? (config.groupBy instanceof Array ? config.groupBy : [config.groupBy]).map(function(g) {
      return function(d) {

        let val;

        if (d[g]) val = d[g];
        else if (d.profession instanceof Array) val = attrs[d.profession[0]][g];
        else val = attrs[d.profession][g];

        return `${val}`;

      }
    }) : ["id"];

    config.data.forEach(d => {
      if (d.profession !== void 0) d.profession = `${d.profession}`;
    })

    // Filters data by the time filter.
    if (config.time) config.data = config.data.filter(config.time);

    switch(this.props.type) {
      case "Treemap":
        config.sum = d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0;
        break;
    }

    // Draws the visualization!
    const viz = new types[this.props.type]()
      .aggs(uniques)
      .shapeConfig({
        fill: d => {
          if (d.color) return d.color;
          else if (d.profession !== void 0) {
            let occ = d.profession.constructor === Array ? d.profession[0] : d.profession;
            return colors[attrs[occ].domain];
          }
          return "#ccc";
        }
      })
      .depth(0)
      .config(config)
      .select(this.refs.svg);

    setTimeout(() => {
      this.setState({viz});
    }, 500);

  }

  componentDidUpdate() {
    if (this.state) this.state.viz.render();
  }

  render() {
    const {height, width} = this.props.config;
    return (
      <div className="viz">
        <svg ref="svg" style={{width: width || "100%", height: height || 500}}></svg>
      </div>
    );
  }
};

export default Viz;
