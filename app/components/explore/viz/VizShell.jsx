import React, {Component} from "react";
import {connect} from "react-redux";
import "css/components/explore/explore";
import {Viz} from "d3plus-react";
import {changeViz} from "actions/explorer";
import {YEAR_BUCKETS} from "types";
import {extent} from "d3-array";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    changeViz("StackedArea");
  }

  render() {
    const {data, grouping, occupation, viz} = this.props.explorer;
    const {occupations} = occupation;
    const {type, config} = viz;
    let attrs, tmapData;

    if (!data.length) {
      return <div className="explore-viz-container">no data yet (or loading...)</div>;
    }

    if (grouping === "places") {
      let birthyearSpan = extent(data, d => d.birthyear);
      birthyearSpan = birthyearSpan[1] - birthyearSpan[0];

      tmapData = data
        .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
        .map(d => {
          d.borncountry = d.birthcountry.country_name;
          d.borncontinent = d.birthcountry.continent;
          d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                       ? d.birthyear
                       : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
          return d;
        });
    }
    else if (grouping === "occupations") {
      attrs = occupations.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {});
      tmapData = data
        .filter(p => p.birthyear !== null && p.occupation_id !== null)
        .map(d => {
          const o = attrs[d.occupation_id];
          if (o) {
            d.occupation_name = o.name;
          }
          else {
            // console.log(d.profession_id, attrs);
          }
          d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
          d.place = d.birthplace;
          return d;
        });
    }

    return (
      <div className="explore-viz-container">
        <h1>How have the occupations of all globally remembered people changed over time?</h1>
        <h3 className="explore-viz-date">4000 BC - 2013</h3>
        <div className="viz-shell">
          <Viz type={type} config={Object.assign(config, {data: tmapData, attrs})} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

export default connect(mapStateToProps)(VizShell);
