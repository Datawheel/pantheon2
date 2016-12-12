import { combineReducers } from 'redux';

const years = (
  state = [-4000, 2000],
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_YEARS":
      return action.data;
    default:
      return state;
  }
};

const place = (
  state = {selectedCountry:"all", selectedCity:"all", selectedCityInCountry:"all", countries:[], cities:[], citiesInCountry:[]},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_COUNTRY":
      return Object.assign({}, state, {selectedCountry: action.data});
    case "CHANGE_EXPLORER_CITY_IN_COUNTRY":
      return Object.assign({}, state, {selectedCityInCountry: action.data});
    case "CHANGE_EXPLORER_CITY":
      return Object.assign({}, state, {selectedCity: action.data});
    case "GET_COUNTRIES_SUCCESS":
      return Object.assign({}, state, {countries: action.res.data});
    case "GET_CITIES_SUCCESS":
      return Object.assign({}, state, {cities: action.res.data});
    case "GET_CITIES_IN_COUNTRY_SUCCESS":
      return Object.assign({}, state, {citiesInCountry: action.data});
    default:
      return state;
  }
};

const explorerReducer = combineReducers({
  years,
  place,
});

export default explorerReducer;
