import {nest} from "d3-collection";
import {mean, sum} from "d3-array";

const dataFormatter = (dataArray, show, placeType) => {
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
        hpi: sum(leaves, d => d.hpi),
        avg_langs: mean(leaves, d => d.l),
        langs: sum(leaves, d => d.l),
        top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
      }))
      .entries(data.filter(d => d.occupation))
      .map(d => d.value);
  }
  else if (show === "places") {
    if (placeType === "deathplace") {
      data = nest()
        .key(d => d.dplace_geonameid.id)
        .rollup(leaves => ({
          id: leaves[0].dplace_geonameid.id,
          name: leaves[0].dplace_geonameid.place,
          slug: leaves[0].dplace_geonameid.slug,
          country_name: leaves[0].dplace_country.country,
          country_slug: leaves[0].dplace_country.slug,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d.dplace_geonameid && d.dplace_country))
        .map(d => d.value);
    }
    else {
      data = nest()
        .key(d => d.bplace_geonameid.id)
        .rollup(leaves => ({
          id: leaves[0].bplace_geonameid.id,
          name: leaves[0].bplace_geonameid.place,
          slug: leaves[0].bplace_geonameid.slug,
          country_name: leaves[0].bplace_country.country,
          country_slug: leaves[0].bplace_country.slug,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d.bplace_geonameid && d.bplace_country))
        .map(d => d.value);
    }
  }
  else {
    data = data.map((d, i) => Object.assign(d, {rank: i + 1}));
  }
  return data;
};

export default dataFormatter;
