/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import apiClient from 'apiconfig';
import axios from 'axios';

polyfill();

function getVizData(dispatch, getState){
}

// -------------------------
// Static needs actions
// ---------------------------
export function fetchAllCountries(store) {
  return {
    type: "GET_COUNTRIES",
    promise: axios.get("http://localhost:3100/place?is_country=is.true&order=name&select=id,name,country_code")
  };
}
export function fetchAllCities(store) {
  return {
    type: "GET_CITIES",
    promise: axios.get("http://localhost:3100/place?is_country=is.false&order=born_rank&select=id,name,country_code&limit=200")
  };
}


// -------------------------
// Actions from controls
// ---------------------------
export function changeYears(years) {
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return dispatch({ type: "CHANGE_EXPLORER_YEARS", data:years });
    // return getVizData(dispatch, getState);
  }
}

export function changeCountry(e) {
  const countryId = e.target.value;
  const countryCode = e.target.options[e.target.selectedIndex].dataset.countrycode;
  return (dispatch, getState) => {
    return apiClient.get(`/place?is_country=is.false&country_code=eq.${countryCode}&order=name&select=id,name`)
      .then(res => {
        dispatch({
          type: "CHANGE_EXPLORER_COUNTRY",
          data: countryId
        });
        dispatch({ type: "CHANGE_EXPLORER_CITY_IN_COUNTRY", data: "all" });
        return dispatch({ type: "GET_CITIES_IN_COUNTRY_SUCCESS", data: res.data });
      })
  }
}

export function changeCity(e) {
  const newPlace = e.target.value;
  return (dispatch, getState) => {
    return dispatch({ type: "CHANGE_EXPLORER_CITY", data:newPlace });
  }
}

export function changeCityInCountry(e) {
  const newPlace = e.target.value;
  return (dispatch, getState) => {
    return dispatch({ type: "CHANGE_EXPLORER_CITY_IN_COUNTRY", data:newPlace });
  }
}
