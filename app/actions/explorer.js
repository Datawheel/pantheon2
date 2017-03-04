/* eslint consistent-return: 0, no-else-return: 0*/
import {polyfill} from "es6-promise";
import apiClient from "apiconfig";
import axios from "axios";
import {COUNTRY_DEPTH, CITY_DEPTH, COLORS_CONTINENT} from "types";

polyfill();

function setUrl(explorerState) {
  const {grouping, place, occupation, years} = explorerState;
  let queryStr = `?years=${years}&grouping=${grouping}`;
  if (place.selectedDepth === COUNTRY_DEPTH && place.selectedCountry !== "all") {
    queryStr = `${queryStr}&country=${place.selectedCountryStr}|${place.selectedCountry}`;
    if (place.selectedCityInCountry !== "all") {
      queryStr = `${queryStr}&city=${place.selectedCityInCountry}`;
    }
  }
  if (place.selectedDepth === CITY_DEPTH && place.selectedCity !== "all") {
    queryStr = `${queryStr}&city=${place.selectedCity}`;
  }
  if (occupation.selectedOccupations !== "all") {
    queryStr = `${queryStr}&occupation=${occupation.selectedOccupationSlug}|${occupation.selectedOccupations}`;
  }
  if (history.pushState) {
    const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStr;
    window.history.pushState({path: newurl}, "", newurl);
  }
}

function getVizData(dispatch, getState) {
  dispatch({data: [], type: "FETCH_EXPLORER_DATA_SUCCESS"});
  const {explorer} = getState();
  const {place, occupation, years} = explorer;
  const yearType = "birthyear";

  setUrl(explorer);

  let placeFilter = "";
  if (place.selectedDepth === COUNTRY_DEPTH && place.selectedCountry !== "all") {
    placeFilter = `&birthcountry=eq.${place.selectedCountry}`;
    if (place.selectedCityInCountry !== "all") {
      placeFilter = `&birthplace=eq.${place.selectedCityInCountry}`;
    }
  }
  if (place.selectedDepth === CITY_DEPTH && place.selectedCity !== "all") {
    placeFilter = `&birthplace=eq.${place.selectedCity}`;
  }

  let occupationFilter = "";
  if (occupation.selectedOccupations !== "all") {
    occupationFilter = `&occupation=in.${occupation.selectedOccupations}`;
  }

  const dataUrl = `/person?select=slug,name,langs,id,birthyear,deathyear,birthcountry{id,country_name,continent},birthplace,occupation_id:occupation&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}`;
  console.log("getVizData", dataUrl);
  return apiClient.get(dataUrl).then(res => {
    return dispatch({
      data: res.data,
      type: "FETCH_EXPLORER_DATA_SUCCESS"
    });
  });
}

// -------------------------
// Static needs actions
// ---------------------------
export function fetchAllCountries() {
  return {
    type: "GET_COUNTRIES",
    promise: axios.get("http://localhost:3100/place?is_country=is.true&order=name&select=id,name,country_code")
  };
}
export function fetchAllCities() {
  return {
    type: "GET_CITIES",
    promise: axios.get("http://localhost:3100/place?is_country=is.false&order=born_rank&select=id,name,country_code&limit=200")
  };
}
export function fetchAllOccupations() {
  return {
    type: "GET_EXPLORER_OCCUPATIONS",
    promise: axios.get("http://localhost:3100/occupation")
  };
}


// -------------------------
// Actions from controls
// ---------------------------
export function changeGrouping(newGrouping) {
  return dispatch => {
    dispatch({type: "CHANGE_EXPLORER_GROUPING", data: newGrouping});
  };
}

export function changeYears(newYears, triggerUpdate = true) {
  return (dispatch, getState) => {
    const {explorer} = getState();
    const {years} = explorer;
    if (JSON.stringify(years) === JSON.stringify(newYears)) {
      return;
    }
    dispatch({type: "CHANGE_EXPLORER_YEARS", data: newYears});
    if (triggerUpdate) return getVizData(dispatch, getState);
  };
}

export function changePlaceDepth(newDepth) {
  return dispatch => (
    return dispatch({type: "CHANGE_EXPLORER_PLACE_DEPTH", data: newDepth});
  );
}

export function changeCountry(countryStrCode, countryNumCode, triggerUpdate = true) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORER_COUNTRY", data: countryNumCode});
    dispatch({type: "CHANGE_EXPLORER_COUNTRY_STR", data: countryStrCode});
    dispatch({type: "CHANGE_EXPLORER_CITY_IN_COUNTRY", data: "all"});
    return apiClient.get(`/place?is_country=is.false&country_code=eq.${countryStrCode}&order=name&select=id,name`)
      .then(res => {
        dispatch({ type: "GET_CITIES_IN_COUNTRY_SUCCESS", data: res.data});
        if (triggerUpdate) return getVizData(dispatch, getState);
      });
  };
}

export function changeCity(newPlace) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORER_CITY", data: newPlace});
    return getVizData(dispatch, getState);
  };
}

export function changeCityInCountry(newPlace) {
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORER_CITY_IN_COUNTRY", data: newPlace});
    return getVizData(dispatch, getState);
  };
}

export function changeOccupationDepth(newDepth) {
  return (dispatch) => {
    return dispatch({type: "CHANGE_EXPLORER_OCCUPATION_DEPTH", data: newDepth});
  };
}

export function changeOccupations(selectedOccupation, occupationList, triggerUpdate = true) {
  // const selectedOccupation = e.target.value;
  // const newOccupations = e.target.options[e.target.selectedIndex].dataset.occupations;
  console.log("selectedOccupation, occupationList", selectedOccupation, occupationList);
  return (dispatch, getState) => {
    dispatch({type: "CHANGE_EXPLORER_OCCUPATIONS", data: occupationList});
    dispatch({type: "CHANGE_EXPLORER_OCCUPATION_SLUG", data: selectedOccupation});
    if (triggerUpdate) return getVizData(dispatch, getState);
  };
}

export function changeViz(newType) {
  let config;
  return (dispatch, getState) => {
    const {explorer} = getState();
    if (explorer.grouping === "places") {
      config = {
        depth: 1,
        groupBy: ["borncontinent", "borncountry"],
        time: "birthyear",
        shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]}
      };
      if (newType === "StackedArea") {
        config = Object.assign(config, {
          time: "bucketyear",
          x: "bucketyear",
          y: d => d.id instanceof Array ? d.id.length : 1
        });
      }
    }
    else if (explorer.grouping === "occupations") {
      config = {
        depth: 2,
        groupBy: ["domain", "industry", "occupation_name"],
        time: "birthyear"
      };
    }
    dispatch({type: "CHANGE_EXPLORER_VIZ", data: newType});
    dispatch({type: "CHANGE_EXPLORER_VIZ_CONFIG", data: config});
    if (!explorer.data.length) {
      return getVizData(dispatch, getState);
    }
  };
}
