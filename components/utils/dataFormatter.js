import {nest} from "d3-collection";
import {mean, sum} from "d3-array";

const dataFormatter = (
  dataArray,
  showType,
  showDepth,
  placeType,
  occupation,
  country,
  yearType,
  years
) => {
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
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3),
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    } else if (showDepth === "industries") {
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
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3),
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    } else if (showDepth === "domains") {
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
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3),
        }))
        .entries(data.filter(d => d.occupation))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
  } else if (showType === "places") {
    let dataKey;
    if (showDepth === "places") {
      dataKey =
        placeType === "deathplace" ? "dplace_geonameid" : "bplace_geonameid";
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
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3),
        }))
        .entries(data.filter(d => d[dataKey] && d.bplace_country))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
    if (showDepth === "countries") {
      dataKey =
        placeType === "deathplace" ? "dplace_country" : "bplace_country";
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
          top_ranked: leaves.sort((a, b) => b.hpi - a.hpi).slice(0, 3),
        }))
        .entries(data.filter(d => d[dataKey] && d.bplace_country))
        .map(d => d.value)
        .sort((a, b) => b.hpi - a.hpi);
    }
  } else {
    let rankAccessor = "rank";
    let rankPrevAccessor = "rank_prev";
    let rankDeltaAccessor = "rank_delta";
    if (occupation !== "all") {
      rankAccessor = "occupation_rank";
      rankPrevAccessor = "occupation_rank_prev";
      rankDeltaAccessor = "occupation_rank_delta";
    }
    if (country !== "all" && placeType == "birthplace") {
      rankAccessor = "bplace_country_rank";
      rankPrevAccessor = "bplace_country_rank_prev";
      rankDeltaAccessor = "bplace_country_rank_delta";
    }
    if (country !== "all" && placeType == "deathplace") {
      rankAccessor = "dplace_country_rank";
      rankPrevAccessor = "dplace_country_rank_prev";
      rankDeltaAccessor = "dplace_country_rank_delta";
    }
    if (country !== "all" && placeType == "deathplace") {
      rankAccessor = "dplace_country_rank";
      rankPrevAccessor = "dplace_country_rank_prev";
      rankDeltaAccessor = "dplace_country_rank_delta";
    }
    if (yearType === "birthyear" && years.every(y => y === years[0])) {
      rankAccessor = "birthyear_rank";
      rankPrevAccessor = "birthyear_rank_prev";
      rankDeltaAccessor = "birthyear_rank_delta";
    }
    if (yearType === "deathyear" && years.every(y => y === years[0])) {
      rankAccessor = "deathyear_rank";
      rankPrevAccessor = "deathyear_rank_prev";
      rankDeltaAccessor = "deathyear_rank_delta";
    }
    data = data.map((d, i) =>
      Object.assign(d, {
        rank: d[rankAccessor],
        rank_prev: d[rankPrevAccessor],
        rank_delta: d[rankDeltaAccessor],
      })
    );
  }
  return data;
};

export default dataFormatter;
