/* eslint consistent-return: 0, no-else-return: 0*/
import {polyfill} from "es6-promise";
import {COUNTRY_DEPTH, CITY_DEPTH, RANKINGS_RESULTS_PER_PAGE} from "types";
import {nest} from "d3-collection";
import apiClient from "apiconfig";

polyfill();

function getNewData(dispatch, getState){
  dispatch({type: "FETCH_RANKINGS"});
  const {rankings} = getState();
  const {country, domain, occupation, place, results, sorting, type, typeNesting, yearType, years} = rankings;
  let sortingFilter = "&order=hpi.desc.nullslast";
  if (sorting) {
    console.log(sorting)
    sortingFilter = `&order=${sorting.id}.${sorting.direction}.nullslast`;
  }

  setUrl(rankings);

  const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
  const countryFilter = country.id !== "all" ? `&birthcountry=eq.${country.id}` : "";
  const placeFilter = place !== "all" ? `&birthplace=eq.${place}` : "";
  const occupationFilter = occupation !== "all" ? `&occupation=eq.${occupation}` : domain.occupations.length ? `&occupation=in.${occupation.occupations.reduce((a, b)=> a.concat(b.id), [])}` : "";
  const limitOffset = type === "person" ? `&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}` : "";

  let rankingUrl = `/person?select=*,birthcountry{*},birthplace{*},occupation{*}${limitOffset}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${sortingFilter}${countryFilter}${placeFilter}${occupationFilter}`;
  if (type === "occupation") {
    if (countryFilter) {
      return apiClient.get(rankingUrl)
        .then(res => {

          const occupations = nest()
            .key(p => typeNesting === "occupation" ? p.occupation.occupation_slug : p.occupation[`${typeNesting}_slug`])
            .rollup(leaves => {
              return {num_born: leaves.length,
                name: leaves[0].occupations.occupation_name,
                industry: leaves[0].occupation.industry,
                domain: leaves[0].occupation.domain,
                num_born_women: leaves.filter(p => p.gender).length};
            })
            .entries(res.data.filter(p => p.occupation))
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born);
          res.data = occupations;
          dispatch({
            res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
          return dispatch({type: "CHANGE_RANKING_PAGES", data: 1});
        });
    }
    rankingUrl = "/occupation?order=num_born.desc";
    if (["domain", "industry"].includes(typeNesting)) {
      return apiClient.get(rankingUrl)
        .then(res => {
          const occupations = nest()
            .key(p => p[`${typeNesting}_slug`])
            .rollup(leaves => {
              return {num_born: leaves.reduce((a, b) => a + b.num_born, 0),
                industry: leaves[0].industry,
                domain: leaves[0].domain,
                num_born_women: leaves.reduce((a, b) => a + b.num_born_women, 0)};
            })
            .entries(res.data)
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born);
          res.data = occupations;

          return dispatch({
            res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
        });
    }
  }
  else if (type === "place") {
    if (occupationFilter) {
      rankingUrl = `/person?select=*,birthcountry{*},birthplace{*},occupation{*}&${yearType}=gte.${years.min}&${yearType}=lte.${years.max}&order=langs.desc.nullslast${occupationFilter}`;
      return apiClient.get(rankingUrl)
        .then(res => {

          const places = nest()
            .key(p => p.birthcountry.slug)
            .rollup(leaves => {
              return {num_born: leaves.length,
                name: leaves[0].birthcountry.name,
                slug: leaves[0].birthcountry.slug,
                continent: leaves[0].birthcountry.continent};
            })
            .entries(res.data.filter(p => p.birthcountry))
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born );
          console.log(places);
          res.data = places;

          return dispatch({
            res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
        });
    }
    if (typeNesting === "country") {
      rankingUrl = `/place?is_country=is.true&order=born_rank_unique&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}`;
    }
    else {
      rankingUrl = `/place?is_country=is.false&order=born_rank_unique&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}`;
    }
  }

  return apiClient.get(rankingUrl, {headers: {Prefer: "count=exact"}})
    .then(res =>
      dispatch({res, type: "FETCH_RANKINGS_SUCCESS"})
    )
    .catch(() =>
      dispatch(fetchRankingsFailure({id: 999, error: "Oops! Something went wrong and we couldn't fetch rankings"}))
    );
}

export function fetchRankingsFailure(data) {
  return {
    type: "FETCH_RANKINGS_FAILURE",
    id: data.id,
    error: data.error
  };
}

export function sortRankingsTable(column) {
  return (dispatch, getState) => {
    const {rankings} = getState();
    let newSort = {id: column.id, direction: "desc"};
    if (rankings.sorting) {
      if(rankings.sorting.direction === "desc"){
        newSort = {id: column.id, direction: "asc"};
      }
      else {
        newSort = null;
      }
    }
    dispatch({type: "CHANGE_SORTING", data: newSort});
    return getNewData(dispatch, getState);
  };
}
