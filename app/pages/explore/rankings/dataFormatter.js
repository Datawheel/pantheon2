import {nest} from "d3-collection";
import {mean} from "d3-array";

export default function dataFormatter(dataArray, show) {
  let data = dataArray;
  if (show === "occupations") {
    data = nest()
      .key(d => d.occupation_id)
      .rollup(leaves => ({
        id: leaves[0].occupation.id,
        name: leaves[0].occupation.occupation,
        slug: leaves[0].occupation.occupation_slug,
        count: leaves.length,
        avg_hpi: mean(leaves, d => d.hpi),
        avg_langs: mean(leaves, d => d.langs),
        top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
      }))
      .entries(data)
      .map(d => d.value);
  }
  else if (show === "places") {
    data = nest()
      .key(d => d.birthplace.id)
      .rollup(leaves => ({
        id: leaves[0].birthplace.id,
        name: leaves[0].birthplace.name,
        slug: leaves[0].birthplace.slug,
        country_name: leaves[0].birthplace.country_name,
        count: leaves.length,
        avg_hpi: mean(leaves, d => d.hpi),
        avg_langs: mean(leaves, d => d.langs),
        top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
      }))
      .entries(data.filter(d => d.birthplace))
      .map(d => d.value);
  }
  else {
    data = data.map((d, i) => Object.assign(d, {rank: i + 1}));
  }
  return data;
}
