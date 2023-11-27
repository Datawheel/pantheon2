import { Treemap } from "d3plus-react";
import { RESET } from "d3plus-common";
import { nest } from "d3-collection";
import { merge } from "d3-array";
import { COLORS_CONTINENT } from "../../utils/consts";
import { groupBy, groupTooltip, shapeConfig } from "../../utils/vizHelpers";

export default function PTreemap({ data, occupations, show, yearType }) {
  let depth = 2;
  let dataFilter = (d) => d.occupation;
  const occsObj = occupations.reduce((obj, d) => ({ ...obj, [d.id]: d }), {});
  let grouping = ["domain", "industry", "occupation_name"].map(
    groupBy(occsObj)
  );
  let shapeConf = shapeConfig(occsObj);
  let ttData;

  if (show.type === "places") {
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

  const tmapData = data.filter(dataFilter).map((d) => {
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

  if (show.type === "occupations") {
    ttData = nest()
      .key((d) => occsObj[d.occupation.id].industry)
      .rollup((leaves) => leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 4))
      .entries(tmapData)
      .map((d) => d.value);
  } else if (show.type === "places") {
    ttData = nest()
      .key((d) => d.borncountry)
      .rollup((leaves) => leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 4))
      .entries(tmapData)
      .map((d) => d.value);
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
        tooltipConfig: groupTooltip(merge(ttData), (d) =>
          show.type === "places"
            ? d.bplace_country.slug
            : d.occupation.occupation_slug
        ),
        sum: (d) => (d.id ? (d.id instanceof Array ? d.id.length : 1) : 0),
      }}
    />
  );
}
