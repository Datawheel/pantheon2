import {nest} from "d3-collection";
import {mean, sum} from "d3-array";

const dataFormatter = (dataArray, showType, showDepth, placeType) => {
  let data = dataArray;
  if (showType === "occupations") {
    if (showDepth === "occupations") {
      data = nest()
        .key(d => d.occupation_id)
        .rollup(leaves => ({
          id: leaves[0].occupation.id,
          name: leaves[0].occupation.occupation,
          slug: leaves[0].occupation.occupation_slug,
          industry: leaves[0].occupation.industry,
          domain: leaves[0].occupation.domain,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
    else if (showDepth === "industries") {
      data = nest()
        .key(d => d.occupation.industry)
        .rollup(leaves => ({
          id: leaves[0].occupation.industry,
          industry: leaves[0].occupation.industry,
          domain: leaves[0].occupation.domain,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
    else if (showDepth === "domains") {
      data = nest()
        .key(d => d.occupation.domain)
        .rollup(leaves => ({
          id: leaves[0].occupation.domain,
          domain: leaves[0].occupation.domain,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
  }
  else if (showType === "places") {
    let dataKey;
    if (showDepth === "places") {
      dataKey = placeType === "deathplace" ? "dplace_geonameid" : "bplace_geonameid";
      data = nest()
        .key(d => d[dataKey].id)
        .rollup(leaves => ({
          id: leaves[0][dataKey].id,
          name: leaves[0][dataKey].place,
          slug: leaves[0][dataKey].slug,
          country_name: leaves[0].bplace_country.country,
          country_slug: leaves[0].bplace_country.slug,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d[dataKey] && d.bplace_country))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
    if (showDepth === "countries") {
      dataKey = placeType === "deathplace" ? "dplace_country" : "bplace_country";
      data = nest()
        .key(d => d[dataKey].id)
        .rollup(leaves => ({
          id: leaves[0][dataKey].id,
          name: leaves[0][dataKey].country,
          slug: leaves[0][dataKey].slug,
          country_name: leaves[0][dataKey].country,
          country_slug: leaves[0][dataKey].slug,
          count: leaves.length,
          avg_hpi: mean(leaves, d => d.hpi),
          hpi: sum(leaves, d => d.hpi),
          avg_langs: mean(leaves, d => d.l),
          langs: sum(leaves, d => d.l),
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
        }))
        .entries(data.filter(d => d[dataKey] && d.bplace_country))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
    // if (placeType === "deathplace") {
    //   data = nest()
    //     .key(d => d.dplace_geonameid.id)
    //     .rollup(leaves => ({
    //       id: leaves[0].dplace_geonameid.id,
    //       name: leaves[0].dplace_geonameid.place,
    //       slug: leaves[0].dplace_geonameid.slug,
    //       country_name: leaves[0].dplace_country.country,
    //       country_slug: leaves[0].dplace_country.slug,
    //       count: leaves.length,
    //       avg_hpi: mean(leaves, d => d.hpi),
    //       hpi: sum(leaves, d => d.hpi),
    //       avg_langs: mean(leaves, d => d.l),
    //       langs: sum(leaves, d => d.l),
    //       top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
    //     }))
    //     .entries(data.filter(d => d.dplace_geonameid && d.dplace_country))
    //     .map(d => d.value);
    // }
    // else {
    //   data = nest()
    //     .key(d => d.bplace_geonameid.id)
    //     .rollup(leaves => ({
    //       id: leaves[0].bplace_geonameid.id,
    //       name: leaves[0].bplace_geonameid.place,
    //       slug: leaves[0].bplace_geonameid.slug,
    //       country_name: leaves[0].bplace_country.country,
    //       country_slug: leaves[0].bplace_country.slug,
    //       count: leaves.length,
    //       avg_hpi: mean(leaves, d => d.hpi),
    //       hpi: sum(leaves, d => d.hpi),
    //       avg_langs: mean(leaves, d => d.l),
    //       langs: sum(leaves, d => d.l),
    //       top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3)
    //     }))
    //     .entries(data.filter(d => d.bplace_geonameid && d.bplace_country))
    //     .map(d => d.value)
    //     .sort((a, b) => b.hpi - a.hpi);
    // }
  }
  else {
    data = data.map((d, i) => Object.assign(d, {rank: i + 1}));
  }
  return data;
};

export default dataFormatter;
