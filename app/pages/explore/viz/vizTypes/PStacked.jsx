import React, {Component} from "react";
import {StackedArea} from "d3plus-react";
import {COLORS_CONTINENT} from "types";
import {nest} from "d3-collection";
import {calculateYearBucket, groupBy, shapeConfig} from "viz/helpers";

class PStacked extends Component {

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
      <StackedArea
        config={{
          data: stackedData,
          depth,
          groupBy: grouping,
          shapeConfig: shapeConf,
          xConfig: {
            labels: bornTicks,
            tickFormat: d => bornBuckets[d]
          }
        }}
      />
    );
  }

}

export default PStacked;
