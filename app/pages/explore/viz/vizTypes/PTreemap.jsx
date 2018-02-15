import React, {Component} from "react";
import {Treemap} from "d3plus-react";
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
    let dataFilter = () => true;
    let grouping = ["domain", "industry", "occupation_name"].map(groupBy(occsObj));
    const occsObj = occupations.reduce((obj, d) => ({...obj, [d.id]: d}), {});
    let shapeConf = shapeConfig(occsObj);
    let ttData;

    if (show === "places") {
      dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent;
      grouping = ["borncontinent", "borncountry"];
      shapeConf = {fill: d => COLORS_CONTINENT[d.borncontinent]};
      const uniqCountries = nest().key(d => d.birthcountry.id).entries(data.filter(dataFilter));
      if (uniqCountries.length === 1) {
        grouping = ["borncountry", "bornplace"];
        dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent && p.birthplace;
      }
      depth = 1;
    }

    const tmapData = data
      .filter(dataFilter)
      .map(d => {
        d.borncountry = d.birthcountry ? d.birthcountry.country_name : d.birthcountry;
        d.bornplace = d.birthplace ? d.birthplace.name : d.birthplace;
        d.borncontinent = d.birthcountry ? d.birthcountry.continent : d.birthcountry;
        d.occupation_id = `${d.occupation_id}`;
        const occ = occsObj[d.occupation_id];
        if (occ) {
          d.occupation_name = occ.name;
          d.occupation_slug = occ.slug;
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

    return (
      <Treemap
        config={{
          data: tmapData,
          depth,
          groupBy: grouping,
          height: false,
          shapeConfig: shapeConf,
          time: "birthyear",
          tooltipConfig: groupTooltip(merge(ttData), d => show === "places" ? d.birthcountry.slug : d.occupation.occupation_slug),
          sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
        }}
      />
    );
  }

}

export default PTreemap;
