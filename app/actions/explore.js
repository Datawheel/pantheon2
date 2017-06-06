/* eslint consistent-return: 0, no-else-return: 0*/
import {polyfill} from "es6-promise";
import apiClient from "apiconfig";
import axios from "axios";
import {COLORS_CONTINENT, COUNTRY_DEPTH, CITY_DEPTH, DOMAIN_DEPTH, FORMATTERS, OCCUPATION_DEPTH,
          RANKINGS_RESULTS_PER_PAGE, SANITIZERS} from "types";
import {nest} from "d3-collection";

polyfill();

// -------------------------
// Set the URL based on data
// ---------------------------
function setUrl(exploreState) {
  const {gender, metric, place, occupation, show, type, typeNesting, years, yearType} = exploreState;
  let queryStr = `?years=${years}`;
  if (show) {
    queryStr = `${queryStr}&show=${show.type}`;
    if (show.depth && show.type !== show.depth) {
      queryStr = `${queryStr}|${show.depth}`;
    }
  }
  if (type) {
    queryStr = `${queryStr}&type=${type}|${typeNesting}`;
  }
  if (place.selectedDepth === COUNTRY_DEPTH && place.selectedCountry !== "all") {
    queryStr = `${queryStr}&country=${place.selectedCountryStr}`;
    if (place.selectedPlaceInCountry !== "all") {
      queryStr = `${queryStr}&place=${place.selectedPlaceInCountryStr}`;
    }
  }
  if (place.selectedDepth === CITY_DEPTH && place.selectedPlace !== "all") {
    queryStr = `${queryStr}&place=${place.selectedPlaceStr}`;
  }
  if (occupation.selectedOccupations !== "all") {
    if (occupation.selectedDepth === DOMAIN_DEPTH) {
      queryStr = `${queryStr}&domain=${occupation.selectedOccupationSlug}`;
    }
    else {
      queryStr = `${queryStr}&occupation=${occupation.selectedOccupationSlug}`;
    }
  }
  if (metric.metricType) {
    queryStr = `${queryStr}&metricType=${metric.metricType}&cutoff=${metric.cutoff}`;
  }
  if (gender === true || gender === false) {
    queryStr = `${queryStr}&gender=${gender}`;
  }
  if (yearType === "deathyear") {
    queryStr = `${queryStr}&yearType=${yearType}`;
  }
  if (typeof history !== "undefined" && history.pushState) {
    const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryStr}`;
    window.history.pushState({path: newurl}, "", newurl);
  }
}

// -------------------------
// Compose API data call and
// request data from server
// ---------------------------
export function getNewData(dispatch, getState) {
  // // first we "drop" the viz by feeding it an empty array of data
  // dispatch({type: "FETCH_EXPLORE_DATA_SUCCESS", data: []});
  // next we trigger the loading screen
  dispatch({type: "FETCH_EXPLORE_DATA"});
  const {explore} = getState();
  const {gender, metric, page, place, occupation, rankings, sorting, years, yearType} = explore;
  let apiHeaders = null;

  setUrl(explore);

  let selectFields = "name,langs,id,birthyear,deathyear,birthcountry{id,country_name,continent,slug},birthplace{id,name,country_name,continent,slug},occupation_id:occupation";
  let limitOffset = "";
  if (page === "rankings") {
    apiHeaders = {Prefer: "count=exact"};
    selectFields = "name,slug,occupation{id,occupation,occupation_slug},birthyear,deathyear,gender,birthplace{id,name,slug},langs,hpi,id";
    const offset = rankings.page * RANKINGS_RESULTS_PER_PAGE;
    limitOffset = `&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}`;
  }

  let placeFilter = "";
  if (place.selectedDepth === COUNTRY_DEPTH && place.selectedCountry !== "all") {
    placeFilter = `&birthcountry=eq.${place.selectedCountry}`;
    if (place.selectedPlaceInCountry !== "all") {
      placeFilter = `&birthplace=eq.${place.selectedPlaceInCountry}`;
    }
  }
  if (place.selectedDepth === CITY_DEPTH && place.selectedPlace !== "all") {
    placeFilter = `&birthplace=eq.${place.selectedPlace}`;
  }

  let occupationFilter = "";
  if (occupation.selectedOccupations !== "all") {
    occupationFilter = `&occupation=in.${occupation.selectedOccupations}`;
  }

  let sortingFilter = "&order=hpi.desc.nullslast";
  if (sorting) {
    sortingFilter = `&order=${sorting.id}.${sorting.direction}.nullslast`;
  }

  let metricCutoff = "";
  if (metric.metricType) {
    metricCutoff = `&${metric.metricType}=gte.${metric.cutoff}`;
  }

  let genderFilter = "";
  if (gender === true || gender === false) {
    genderFilter = `&gender=is.${gender}`;
  }

  const dataUrl = `/person?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${limitOffset}${sortingFilter}${metricCutoff}${genderFilter}`;
  console.log("getNewData", dataUrl);
  return apiClient.get(dataUrl, {headers: apiHeaders}).then(res => {
    if (page === "rankings") {
      const contentRange = res.headers["content-range"];
      const totalResults = parseInt(contentRange.split("/")[1], 10);
      const totalPages = Math.ceil(totalResults / RANKINGS_RESULTS_PER_PAGE);
      dispatch({
        type: "CHANGE_RANKINGS_PAGES",
        pages: totalPages
      });
    }
    return dispatch({
      data: res.data,
      type: "FETCH_EXPLORE_DATA_SUCCESS"
    });
  });
}

// -------------------------
// Static needs actions
// ---------------------------
function fetchAllCountries() {
  return axios.get("http://localhost:3100/place?is_country=is.true&order=name&select=id,name,country_code");
}
function fetchAllPlaces() {
  return axios.get("http://localhost:3100/place?is_country=is.false&order=born_rank&select=id,name,country_code,slug,state,country_code&limit=500");
}
function fetchPlacesInCountry(countryStr) {
  return axios.get(`http://localhost:3100/place?is_country=is.false&country_code=eq.${countryStr}&order=name&select=id,name,slug,state,country_code`);
}
function fetchCountryId(countryStr) {
  return axios.get(`http://localhost:3100/place?country_code=eq.${countryStr}&is_country=is.true&select=id`);
}
function fetchPlaceId(placeStr) {
  return axios.get(`http://localhost:3100/place?slug=eq.${placeStr}&is_country=is.false&select=id`);
}
export function initExplorePlace(params, location) {
  const {query} = location;
  return dispatch => dispatch({
    type: "INIT_EXPLORE_PLACE",
    promise: axios.all([fetchAllCountries(), fetchAllPlaces(), fetchPlacesInCountry(query.country), fetchCountryId(query.country), fetchPlaceId(query.place)])
      .then(axios.spread(function(countriesRes, placesRes, placesInCountryRes, countryIdRes, placeIdRes) {
        const countryId = countryIdRes.data.length ? countryIdRes.data[0].id : "all";
        let placeId = placeIdRes.data.length ? placeIdRes.data[0].id : "all";
        let placeStr = query.place;
        let selectedPlaceInCountry = "all";
        let selectedPlaceInCountryStr = "all";
        const placesInCountry = placesInCountryRes.data.length ? placesInCountryRes.data : null;
        if (countryId !== "all" && placeId !== "all") {
          selectedPlaceInCountry = placeId;
          selectedPlaceInCountryStr = placeStr;
          placeId = "all";
          placeStr = "all";
        }
        const selectedDepth = countryId === "all" && placeId !== "all" ? CITY_DEPTH : COUNTRY_DEPTH;
        return {selectedDepth, countries: countriesRes.data, places: placesRes.data, placesInCountry, country: query.country, place: placeStr, countryId, placeId, selectedPlaceInCountry, selectedPlaceInCountryStr};
      }))
  });
  // return dispatch => dispatch({
  //   type: "INIT_EXPLORE_PLACE",
  //   promise: axios.all([fetchAllCountries(), fetchAllPlaces(), fetchPlacesInCountry(query.country), fetchCountryId(query.country), fetchPlaceId(query.place)])
  //     .then(axios.spread(function(countriesRes, placesRes, placesInCountryRes, countryIdRes, placeIdRes) {
  //       const countryId = countryIdRes.data.length ? countryIdRes.data[0].id : "all";
  //       const placeId = palceIdRes.data.length ? placeIdRes.data[0].id : "all";
  //       const placesInCountry = placesInCountryRes.data.length ? placesInCountry.data : null;
  //       console.log("countryId, placeId", countryId, placeId)
  //       return {countries: countriesRes.data, places: placesRes.data, placesInCountry, country: query.country, place: query.place, countryId, placeId};
  //     }))
  // });
}
function fetchAllOccupations() {
  return axios.get("http://localhost:3100/occupation");
}
function fetchOccupationIds(slug, depth) {
  return axios.get(`http://localhost:3100/occupation?${depth.toLowerCase()}_slug=eq.${slug}&select=id`);
}
export function initExploreOccupation(params, location) {
  const {query} = location;
  const occupationSlug = query.occupation || query.domain;
  const occupationDepth = query.domain ? DOMAIN_DEPTH : OCCUPATION_DEPTH;
  return dispatch => dispatch({
    type: "INIT_EXPLORE_OCCUPATION",
    promise: axios.all([fetchAllOccupations(), fetchOccupationIds(occupationSlug, occupationDepth)])
      .then(axios.spread(function(occupationsRes, occupationIdsRes) {
        const domains = nest()
          .key(d => d.domain_slug)
          .rollup(leaves => ({
            slug: leaves[0].domain_slug,
            name: leaves[0].domain,
            occupations: `${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]), [])}`
          }))
          .entries(occupationsRes.data)
          .map(d => d.value);

        const industries = nest()
          .key(d => d.industry_slug)
          .rollup(leaves => ({
            slug: leaves[0].industry_slug,
            name: leaves[0].industry,
            occupations: `${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]), [])}`
          }))
          .entries(occupationsRes.data)
          .map(d => d.value);

        const occupations = occupationsRes.data.map(occupation => ({
          id: occupation.id,
          domain_slug: occupation.domain_slug,
          industry_slug: occupation.industry_slug,
          domain: occupation.domain,
          industry: occupation.industry,
          slug: occupation.occupation_slug,
          name: occupation.occupation,
          occupations: occupation.id
        }));

        const occupationIds = occupationIdsRes.data.reduce((prev, curr) => [...prev, curr.id], []);
        return {domains, industries, occupations, occupationIds: occupationIds.join(","), occupationSlug, depth: occupationDepth};
      }))
  });
}

// -------------------------
// Dispatch actions from URL query params
// ---------------------------
export function initExplore(params, location) {
  const {pathname, query} = location;
  const years = SANITIZERS.years(query.years);
  const show = SANITIZERS.show(query.show, pathname);
  const metric = SANITIZERS.metric(query.metricType, query.cutoff);
  const gender = SANITIZERS.gender(query.gender);
  const yearType = SANITIZERS.yearType(query.yearType);
  return dispatch => dispatch({
    type: "INIT_EXPLORE",
    years,
    show,
    metricType: metric.metricType,
    cutoff: metric.cutoff,
    gender,
    yearType
  });
}

// -------------------------
// Actions from controls
// ---------------------------
export function setExplorePage(page) {
  return dispatch => {
    if (page === "viz") {
      dispatch({type: "CHANGE_EXPLORE_SHOW_TYPE", data: "places"});
    }
    return dispatch({type: "SET_EXPLORE_PAGE", page});
  };
}
export function changeShowType(type) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({type: "CHANGE_EXPLORE_SHOW_TYPE", data: type});
    const {explore} = getState();
    setUrl(explore);
  };
}

export function changeShowDepth(depth) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({type: "CHANGE_EXPLORE_SHOW_DEPTH", data: depth});
    const {explore} = getState();
    setUrl(explore);
  };
}

export function changeGrouping(newGrouping) {
  return dispatch => {
    dispatch({type: "CHANGE_EXPLORER_GROUPING", data: newGrouping});
  };
}

export function changeYears(newYears, triggerUpdate = true) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    const {explore} = getState();
    const {years} = explore;
    if (JSON.stringify(years) === JSON.stringify(newYears)) {
      return;
    }
    dispatch({type: "CHANGE_EXPLORE_YEARS", years: newYears});
    if (triggerUpdate) return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions from place controls
// ---------------------------
export function changePlaceDepth(depth) {
  return dispatch => dispatch({type: "CHANGE_EXPLORE_PLACE_DEPTH", data: depth});
}

export function changeCountry(countryStrCode, countryNumCode, triggerUpdate = true) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({
      type: "CHANGE_EXPLORE_COUNTRY",
      countryId: countryNumCode,
      countryStr: countryStrCode
    });
    return apiClient.get(`/place?is_country=is.false&country_code=eq.${countryStrCode}&order=name&select=id,name,slug,state,country_code`)
      .then(res => {
        dispatch({type: "GET_PLACES_IN_COUNTRY_SUCCESS", data: res.data});
        if (triggerUpdate) return getNewData(dispatch, getState);
      });
  };
}

export function changePlace(placeId, placeSlug) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({
      type: "CHANGE_EXPLORE_PLACE",
      placeId,
      placeSlug
    });
    return getNewData(dispatch, getState);
  };
}

export function changePlaceInCountry(placeId, placeSlug) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({
      type: "CHANGE_EXPLORE_PLACE_IN_COUNTRY",
      placeId,
      placeSlug
    });
    return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions from occupation controls
// ---------------------------
export function changeOccupationDepth(newDepth) {
  return dispatch => dispatch({type: "CHANGE_EXPLORER_OCCUPATION_DEPTH", data: newDepth});
}

export function changeOccupations(selectedOccupation, occupationList, triggerUpdate = true) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_RANKING_PAGE", data: 0});
    dispatch({type: "CHANGE_EXPLORER_OCCUPATIONS", data: occupationList});
    dispatch({type: "CHANGE_EXPLORER_OCCUPATION_SLUG", data: selectedOccupation});
    if (triggerUpdate) return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions from advanced controls
// ---------------------------
export function changeMetric(metricType, cutoff) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORE_METRIC", metricType, cutoff});
    return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions from gender controls
// ---------------------------
export function changeGender(gender) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORE_GENDER", gender});
    return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions from yearType controls
// ---------------------------
export function changeYearType(yearType) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORE_YEAR_TYPE", yearType});
    return getNewData(dispatch, getState);
  };
}

// -------------------------
// Actions specific to Viz
// ---------------------------
export function changeViz(vizType, triggerUpdate = true) {
  return (dispatch, getState) => {
    let config;
    const {explore} = getState();
    vizType = vizType || explore.viz.type;
    if (explore.show.type === "places") {
      config = {
        depth: vizType === "StackedArea" ? 0 : explore.place.selectedCountry === "all" ? 1 : 2,
        groupBy: explore.place.selectedCountry === "all" ? ["borncontinent", "borncountry"] : ["borncontinent", "borncountry", "bornplace"]
      };
    }
    else if (explore.show.type === "occupations") {
      config = {
        depth: vizType === "StackedArea" ? 0 : 2,
        groupBy: ["domain", "industry", "occupation_name"]
      };
    }
    dispatch({type: "CHANGE_EXPLORE_VIZ", vizConfig: config, vizType});
    if (!explore.data.length && triggerUpdate) {
      return getNewData(dispatch, getState);
    }
  };
}

// -------------------------
// Actions specific to Rankings
// ---------------------------
export function changePage(direction) {
  return (dispatch, getState) => {
    const {explore} = getState();
    console.log("page:", explore.rankings.page);
    dispatch({type: "CHANGE_RANKING_PAGE", data: explore.rankings.page + direction});
    return getNewData(dispatch, getState);
  };
}
