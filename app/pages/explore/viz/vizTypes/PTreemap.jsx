import React, {Component} from "react";
import {Treemap} from "d3plus-react";
import {RESET} from "d3plus-common";
import {COLORS_CONTINENT} from "types";
import {nest} from "d3-collection";
import {merge} from "d3-array";
import {groupBy, groupTooltip, shapeConfig} from "viz/helpers";

class PTreemap extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, occupations, show, yearType} = this.props;

    let depth = 2;
    let dataFilter = d => d.occupation;
    let grouping = ["domain", "industry", "occupation_name"].map(groupBy(occsObj));
    const occsObj = occupations.reduce((obj, d) => ({...obj, [d.id]: d}), {});
    let shapeConf = shapeConfig(occsObj);
    let ttData;

    if (show === "places") {
      dataFilter = p => p.occupation && p[yearType] !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent;
      grouping = ["borncontinent", "borncountry"];
      shapeConf = {fill: d => COLORS_CONTINENT[d.borncontinent]};
      const uniqCountries = nest().key(d => d.bplace_country.id).entries(data.filter(dataFilter));
      if (uniqCountries.length === 1) {
        grouping = ["borncountry", "bornplace"];
        dataFilter = p => p.occupation && p[yearType] !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent && p.bplace_geonameid;
      }
      depth = 1;
    }

    const tmapData = data
      .filter(dataFilter)
      .map(d => {
        d.borncountry = d.bplace_country ? d.bplace_country.country : d.bplace_country;
        d.bornplace = d.bplace_geonameid ? d.bplace_geonameid.place : d.bplace_geonameid;
        d.borncontinent = d.bplace_country ? d.bplace_country.continent : d.bplace_country;
        d.occupation_id = `${d.occupation_id}`;
        const occ = occsObj[d.occupation_id];
        if (occ) {
          d.occupation_name = occ.occupation;
          d.occupation_slug = occ.occupation_slug;
          d.domain = occ.domain;
          d.domain_slug = occ.domain_slug;
          d.industry = occ.industry;
        }
        return d;
      });

    if (show === "occupations") {
      ttData = nest()
        .key(d => occsObj[d.occupation.id].industry)
        .rollup(leaves => leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 4))
        .entries(tmapData)
        .map(d => d.value);
    }
    else if (show === "places") {
      ttData = nest()
        .key(d => d.borncountry)
        .rollup(leaves => leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 4))
        .entries(tmapData)
        .map(d => d.value);
    }
    // return <div>tmap</div>;

    return (
      <Treemap
        config={{
          data: tmapData,
          depth,
          groupBy: grouping,
          height: RESET,
          shapeConfig: shapeConf,
          // time: "birthyear",
          // tooltipConfig: groupTooltip(merge(ttData), d => show === "places" ? d.bplace_country.slug : d.occupation.occupation_slug),
          sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
        }}
      />
    );
  }

}

export default PTreemap;
