import React, { Component } from "react";
import { StackedArea } from "d3plus-react";
import { RESET } from "d3plus-common";
import { COLORS_CONTINENT } from "../../utils/consts";
import { nest } from "d3-collection";
import {
  calculateYearBucket,
  groupTooltip,
  groupBy,
  shapeConfig,
} from "../../utils/vizHelpers";

export default function PStacked({ data, occupations, show, yearType }) {
  let depth = 2;
  let dataFilter = (d) => d.occupation;
  const occsObj = occupations.reduce((obj, d) => ({ ...obj, [d.id]: d }), {});
  let grouping = ["domain", "industry", "occupation_name"].map(
    groupBy(occsObj)
  );
  let shapeConf = shapeConfig(occsObj);

  if (show === "places") {
    dataFilter = (p) =>
      p.occupation &&
      p[yearType] !== null &&
      p.bplace_country &&
      p.bplace_country.country &&
      p.bplace_country.continent;
    grouping = ["borncontinent", "borncountry"];
    shapeConf = { fill: (d) => COLORS_CONTINENT[d.borncontinent] };
    const uniqCountries = nest()
      .key((d) => d.bplace_country.id)
      .entries(data.filter(dataFilter));
    if (uniqCountries.length === 1) {
      grouping = ["borncountry", "bornplace"];
      dataFilter = (p) =>
        p.occupation &&
        p[yearType] !== null &&
        p.bplace_country &&
        p.bplace_country.country &&
        p.bplace_country.continent &&
        p.bplace_geonameid;
    }
    depth = 1;
  }

  const stackedData = data.filter(dataFilter).map((d) => {
    const newData = {
      ...d, // Spread the existing properties of d
      borncountry: d.bplace_country
        ? d.bplace_country.country
        : d.bplace_country,
      bornplace: d.bplace_geonameid
        ? d.bplace_geonameid.place
        : d.bplace_geonameid,
      borncontinent: d.bplace_country
        ? d.bplace_country.continent
        : d.bplace_country,
      occupation_id: `${d.occupation_id}`,
    };

    // Add additional properties based on occupation_id
    const occ = occsObj[newData.occupation_id];
    if (occ) {
      newData.occupation_name = occ.occupation;
      newData.occupation_slug = occ.occupation_slug;
      newData.domain = occ.domain;
      newData.domain_slug = occ.domain_slug;
      newData.industry = occ.industry;
    }

    return newData;
  });

  const [bornBuckets, bornTicks] = calculateYearBucket(
    stackedData,
    (d) => d.birthyear
  );
  // const [deathBuckets, deathTicks] = calculateYearBucket(stackedData, d => d.deathyear);
  console.log("bornBuckets, bornTicks", bornBuckets, bornTicks);
  console.log("stackedData!!!", stackedData);

  return (
    <StackedArea
      config={{
        data: stackedData,
        depth,
        groupBy: grouping,
        height: RESET,
        shapeConfig: shapeConf,
        tooltipConfig: groupTooltip(stackedData),
        xConfig: {
          labels: bornTicks,
          tickFormat: (d) => bornBuckets[d],
        },
      }}
    />
  );
}
