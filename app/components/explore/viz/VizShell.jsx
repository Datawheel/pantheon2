import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import styles from "css/components/explore/rankings";
import Viz from "components/viz/Index";
import { COLORS_CONTINENT } from "types";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {
    const {data, grouping, profession} = this.props.explorer;
    const { occupations } = profession;
    let tmapData, config;

    if(!data.length){
      return (<div>no data yet...</div>)
    }

    if(grouping === "places"){
      tmapData = data
        .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
        .map(d => {
          d.borncountry = d.birthcountry.country_name;
          d.borncontinent = d.birthcountry.continent;
          return d
        })
      config = {
        data: tmapData,
        depth: 1,
        groupBy: ["borncontinent", "borncountry"],
        shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
        time: "birthyear"
      }
    }
    else if(grouping === "professions"){
      tmapData = data
        .filter(p => p.birthyear !== null)
        .map(d => {
          d.profession_name = d.profession.name;
          d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
          d.place = d.birthplace;
          return d
        })
      config = {
        attrs: occupations,
        data: tmapData,
        depth: 2,
        groupBy: ["domain", "industry", "profession_name"],
        time: "birthyear"
      }
    }
    console.log("GROUPING CHANGED", occupations)

    return (
      <div className="viz-shell">
        <h2>Most Globally Remembered People</h2>
        <div>
        viz will go here with ({data.length}) items...
        </div>
        <div>
        <Viz type="Treemap"
          title={`Places of Birth`}
          key="tmap_1"
          config={config} />,
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
