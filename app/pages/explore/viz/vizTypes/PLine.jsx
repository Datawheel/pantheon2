import React, {Component} from "react";
import {LinePlot} from "d3plus-react";
import {COLORS_CONTINENT} from "types";
import {nest} from "d3-collection";
import {calculateYearBucket, groupBy} from "viz/helpers";
import {COLORS_DOMAIN} from "types/index";

class PLine extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, occupations, show, yearType} = this.props;

    let depth = 2;
    let dataFilter = () => true;
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
      dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent;
      grouping = ["borncontinent", "borncountry"];
      shapeConf = {Line: {strokeWidth: 2, stroke: d => COLORS_CONTINENT[d.borncontinent]}};
      const uniqCountries = nest().key(d => d.birthcountry.id).entries(data.filter(dataFilter));
      if (uniqCountries.length === 1) {
        grouping = ["borncountry", "bornplace"];
        dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent && p.birthplace;
      }
      depth = 1;
    }

    const stackedData = data
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

    const [bornBuckets, bornTicks] = calculateYearBucket(stackedData, d => d.birthyear);
    const [deathBuckets, deathTicks] = calculateYearBucket(stackedData, d => d.deathyear);

    return (
      <LinePlot
        config={{
          data: stackedData,
          depth,
          groupBy: grouping,
          shapeConfig: shapeConf,
          // x: birthyear,
          xConfig: {
            labels: bornTicks,
            tickFormat: d => bornBuckets[d]
          },
          // y: d => {
          //   console.log("d!!", d)
          //   return d.id ? d.id instanceof Array ? d.id.length : 1 : 0;
          // }
        }}
      />
    );
  }

}

export default PLine;
