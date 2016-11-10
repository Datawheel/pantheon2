/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import axios from 'axios';
import { RANKINGS_RESULTS_PER_PAGE } from 'types';
import {nest} from 'd3-collection';

polyfill();

function getNewData(dispatch, getState){
  dispatch({ type: "FETCH_RANKINGS" });
  const { rankings } = getState();
  const { type, typeNesting, yearType, years, country, place, domain, profession, results } = rankings;
  // console.log("type--", type, type == "person")
  const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
  const countryFilter = country.id !== "all" ? `&birthcountry=eq.${country.id}` : '';
  const placeFilter = place !== "all" ? `&birthplace=eq.${place}` : '';
  const professionFilter = profession !== "all" ? `&profession=eq.${profession}` : domain.professions.length ? `&profession=in.${domain.professions.reduce((a, b)=> a.concat(b.id), [])}` : '';
  const limitOffset = type === "person" ? `&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}` : '';

  let rankingUrl = `http://localhost:3100/person?select=*,birthcountry{*},birthplace{*},profession{*}${limitOffset}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}&order=langs.desc.nullslast${countryFilter}${placeFilter}${professionFilter}`;
  if (type == "profession") {
    if(countryFilter) {
      return axios.get(rankingUrl)
        .then(res => {

          const professions = nest()
            .key(p => typeNesting === "profession" ? p.profession.slug : p.profession[`${typeNesting}_slug`])
            .rollup(leaves => {
              return {num_born: leaves.length,
                name: leaves[0].profession.name,
                industry: leaves[0].profession.industry,
                domain: leaves[0].profession.domain,
                num_born_women: leaves.filter(p => p.gender).length}
            })
            .entries(res.data.filter(p => p.profession))
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born );
          res.data = professions;
          dispatch({
            res: res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
          return dispatch({ type: "CHANGE_RANKING_PAGES", data:1 });
        })
    }
    rankingUrl = `http://localhost:3100/profession?order=num_born.desc`;
    if(["domain", "industry"].includes(typeNesting)){
      return axios.get(rankingUrl)
        .then(res => {
          const professions = nest()
            .key(p => p[`${typeNesting}_slug`])
            .rollup(leaves => {
              return {num_born: leaves.reduce((a, b) => a + b.num_born, 0),
                industry: leaves[0].industry,
                domain: leaves[0].domain,
                num_born_women: leaves.reduce((a, b) => a + b.num_born_women, 0)}
            })
            .entries(res.data)
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born );
          res.data = professions;

          return dispatch({
            res: res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
        })
    }
  }
  else if (type == "place") {
    if(professionFilter) {
      rankingUrl = `http://localhost:3100/person?select=*,birthcountry{*},birthplace{*},profession{*}&${yearType}=gte.${years.min}&${yearType}=lte.${years.max}&order=langs.desc.nullslast${professionFilter}`;
      return axios.get(rankingUrl)
        .then(res => {

          const places = nest()
            .key(p => p.birthcountry.slug)
            .rollup(leaves => {
              return {num_born: leaves.length,
                name: leaves[0].birthcountry.name,
                slug: leaves[0].birthcountry.slug,
                continent: leaves[0].birthcountry.continent}
            })
            .entries(res.data.filter(p => p.birthcountry))
            .reduce((a, b) => a.concat([b.value]), [])
            .sort((a, b) => b.num_born - a.num_born );
          console.log(places)
          res.data = places;

          return dispatch({
            res: res,
            type: "FETCH_RANKINGS_SUCCESS"
          });
        })
    }
    if(typeNesting === "country"){
      rankingUrl = `http://localhost:3100/place?is_country=is.true&order=born_rank_unique&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}`;
    }
    else {
      rankingUrl = `http://localhost:3100/place?is_country=is.false&order=born_rank_unique&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}`;
    }
  }

  return axios.get(rankingUrl)
    .then(res => {
      return dispatch({
        res: res,
        type: "FETCH_RANKINGS_SUCCESS"
      });
    })
    .catch(() => {
      return dispatch(fetchRankingsFailure({ id:999, error: 'Oops! Something went wrong and we couldn\'t fetch rankings'}));
    });
}

export function fetchRankingsFailure(data) {
  return {
    type: "FETCH_RANKINGS_FAILURE",
    id: data.id,
    error: data.error
  };
}

export function changeType(e) {
  const newType = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_TYPE", data: newType });
    dispatch({ type: "CHANGE_RANKING_TYPE_NESTING", data: newType });
    return getNewData(dispatch, getState);
  }
}

export function changeYearType(e) {
  e.preventDefault();
  const newYearType = e.target.id;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_YEAR_TYPE", data: newYearType });
    return getNewData(dispatch, getState);
  }
}

export function changeTypeNesting(e) {
  e.preventDefault();
  const newTypeNesting = e.target.id;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_TYPE_NESTING", data: newTypeNesting });
    return getNewData(dispatch, getState);
  }
}

export function changeYears(years) {
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_YEARS", data:years });
    return getNewData(dispatch, getState);
  }
}

export function changeCountry(e) {
  const countryId = e.target.value;
  const countryCode = e.target.options[e.target.selectedIndex].dataset.countrycode;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return axios.get(`http://localhost:3100/place?is_country=is.false&country_code=eq.${countryCode}&order=name&select=id,name`)
      .then(res => {
        dispatch({
          type: "CHANGE_RANKING_COUNTRY",
          data: countryId,
          res: res
        });
        dispatch({ type: "CHANGE_RANKING_PLACE", data: 'all' });
        return getNewData(dispatch, getState);
      })
  }
}

export function changePlace(e) {
  const placeId = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_PLACE", data: placeId });
    return getNewData(dispatch, getState);
  }
}

export function changeDomain(e) {
  const domainSlug = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return axios.get(`http://localhost:3100/profession?domain_slug=eq.${domainSlug}&order=name&select=id,name`)
      .then(res => {
        dispatch({
          type: "CHANGE_RANKING_DOMAIN",
          data: domainSlug,
          res: res
        });
        dispatch({ type: "CHANGE_RANKING_PROFESSION", data: 'all' });
        return getNewData(dispatch, getState);
      })
  }
}

export function changeProfession(e) {
  const professionId = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_PROFESSION", data: professionId });
    return getNewData(dispatch, getState);
  }
}

export function updateRankingsTable(instance) {
  const {page, pageSize, pages, sorting} = instance;
  // console.log(page, pageSize, pages, sorting)
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data: page });
    return getNewData(dispatch, getState);
  }
}
