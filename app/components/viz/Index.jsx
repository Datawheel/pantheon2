import React, {Component, PropTypes} from "react";

import {Treemap} from "d3plus-treemap";
const types = {Treemap};

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

class Viz extends Component {

  componentDidMount() {
    const {time} = this.props;
    const attrs = this.props.attrs.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    const groupBy = this.props.groupBy.map(function(g) {
      return function(d) {
        let val;
        if (d[g]) val = d[g];
        else {
          if (d.occupation instanceof Array) {
            val = attrs[d.occupation[0]][g];
          }
          else {
            val = attrs[d.occupation][g];
          }
        }
        return `${val}`;
      }
    });

    const data = this.props.data.filter(time);
    data.forEach(d => {
      d.birthyear = `${d.birthyear}/01/01`;
      d.id = `${d.id}`;
      d.occupation = `${d.occupation}`;
    });

    const viz = new types[this.props.type]()
      .shapeConfig({
        fill: d => {
          let occ = d.occupation;
          if (occ.constructor === Array) occ = occ[0];
          return colors[attrs[occ].domain];
        }
      })
      .data(data)
      .depth(0)
      .groupBy(groupBy)
      .select(this.refs.svg)
      .sum(d => d.values ? void 0 : d.id instanceof Array ? d.id.length : 1)
      .time(time);
    this.setState({viz});
    // this.forceUpdate();
  }

  componentDidUpdate() {
    this.state.viz.render();
  }

  render() {
    const {data} = this.props;

    return (
      <div className="viz">
        <svg ref="svg" style={{width: "100%", height: "500px"}}></svg>
      </div>
    );
  }
};

export default Viz;
