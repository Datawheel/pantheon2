import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import styles from "css/components/explore/explore";
import Viz from "components/viz/Index";
import { COLORS_CONTINENT, YEAR_BUCKETS } from "types";
import {extent} from "d3-array";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    const {data, grouping, profession, viz} = this.props.explorer;
    const { occupations } = profession;
    const { type, config } = viz;
    let tmapData, attrs;

    if(!data.length){
      return (<div className="viz-shell">no data yet (or loading...)</div>)
    }

    if(grouping === "places"){
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
          return d
        })
    }
    else if(grouping === "professions"){
      attrs = occupations.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {})
      tmapData = data
        .filter(p => p.birthyear !== null && p.profession_id !== null)
        .map(d => {
          const o = attrs[d.profession_id];
          if(o)
            d.profession_name = o.name;
          else {
            console.log(d.profession_id, attrs)
          }
          d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
          d.place = d.birthplace;
          return d
        })
    }

    return (
      <div className="viz-shell">
        <h2>Most Globally Remembered People</h2>
        <div>
          <Viz type={type}
            key={`explorer_viz_${type}`}
            config={Object.assign(config, {data:tmapData, attrs})} />,
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

export default connect(mapStateToProps)(VizShell);
