import React, {Component} from "react";
import {LinePlot} from "d3plus-react";
import {RESET} from "d3plus-common";
import {COLORS_CONTINENT} from "types";
import {nest} from "d3-collection";
import {calculateYearBucket, groupBy, groupTooltip} from "viz/helpers";
import {COLORS_DOMAIN} from "types/index";

class PLine extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, occupations, show, yearType} = this.props;

    let depth = 2;
    let dataFilter = d => d.occupation;
    let grouping = ["domain", "industry", "occupation_name"].map(groupBy(occsObj));
    const occsObj = occupations.reduce((obj, d) => ({...obj, [d.id]: d}), {});

    let shapeConf = {
      Line: {
        strokeWidth: 2,
        stroke: d => {
          if (d.color) return d.color;
          else if (d.occupation_id !== undefined) {
            let occ = d.occupation_id.constructor === Array ? d.occupation_id[0] : d.occupation_id;
            if (occ instanceof Array) occ = occ[0];
            return COLORS_DOMAIN[occsObj[occ].domain_slug];
          }
          return "#ccc";
        }
      }
    };

    if (show === "places") {
      dataFilter = p => p.occupation && p[yearType] !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent;
      grouping = ["borncontinent", "borncountry"];
      shapeConf = {Line: {strokeWidth: 2, stroke: d => COLORS_CONTINENT[d.borncontinent]}};
      const uniqCountries = nest().key(d => d.bplace_country.id).entries(data.filter(dataFilter));
      if (uniqCountries.length === 1) {
        grouping = ["borncountry", "bornplace"];
        dataFilter = p => p.occupation && p[yearType] !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent && p.bplace_geonameid;
      }
      depth = 1;
    }

    const stackedData = data
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

    const [bornBuckets, bornTicks] = calculateYearBucket(stackedData, d => d.birthyear);
    // const [deathBuckets, deathTicks] = calculateYearBucket(stackedData, d => d.deathyear);

    return (
      <LinePlot
        config={{
          data: stackedData,
          depth,
          discrete: "x",
          groupBy: grouping,
          height: RESET,
          shapeConfig: shapeConf,
          tooltipConfig: groupTooltip(stackedData),
          xConfig: {
            labels: bornTicks,
            tickFormat: d => bornBuckets[d]
          }
          // y: d => {
          //   console.log("y!!", d.id ? d.id instanceof Array ? d.id.length : 1 : 0);
          //   d.id ? d.id instanceof Array ? d.id.length : 1 : 0;
          // }
        }}
      />
    );
  }

}

export default PLine;
