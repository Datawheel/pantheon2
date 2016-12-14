import { combineReducers } from 'redux';
import { nest } from 'd3-collection';
import { COUNTRY_DEPTH, CITY_DEPTH, OCCUPATION_DEPTH, INDUSTRY_DEPTH, DOMAIN_DEPTH } from 'types';

const data = (
  state = [],
  action
) => {
  switch (action.type) {
    case "FETCH_EXPLORER_DATA_SUCCESS":
      return action.data;
    default:
      return state;
  }
};

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
  state = {selectedDepth:COUNTRY_DEPTH, selectedCountry:"all", selectedCity:"all", selectedCityInCountry:"all", countries:[], cities:[], citiesInCountry:[]},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_PLACE_DEPTH":
      return Object.assign({}, state, {selectedDepth: action.data});
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

const profession = (
  state = {selectedDepth:OCCUPATION_DEPTH, selectedProfessionSlug:"all", selectedProfessions:"all", domains:[], industries:[], occupations:[]},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_PROFESSION_DEPTH":
      return Object.assign({}, state, {selectedDepth: action.data});
    case "CHANGE_EXPLORER_PROFESSIONS":
      return Object.assign({}, state, {selectedProfessions: action.data});
    case "CHANGE_EXPLORER_PROFESSION_SLUG":
      return Object.assign({}, state, {selectedProfessionSlug: action.data});
    case "GET_PROFESSIONS_SUCCESS":
      const data = action.res.data;

      const domains = nest()
        .key(d => d.domain_slug)
        .rollup((leaves) => {
          return {
            slug:leaves[0].domain_slug,
            name:leaves[0].domain,
            professions:`${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]),[])}`
          };
        })
        .entries(data)
        .map(d => d.value);

      const industries = nest()
        .key(d => d.industry_slug)
        .rollup((leaves) => {
          return {
            slug:leaves[0].industry_slug,
            name:leaves[0].industry,
            professions:`${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]),[])}`
          };
        })
        .entries(data)
        .map(d => d.value);

      const occupations = data.map((occupation) => {
        return {
          slug:occupation.slug,
          name:occupation.name,
          professions:occupation.id
        };
      })

      return {
        selectedProfessionSlug: state.selectedProfessionSlug,
        selectedProfessions: state.selectedProfessions,
        domains,
        industries,
        occupations
      }
    default:
      return state;
  }
};


const explorerReducer = combineReducers({
  data,
  years,
  place,
  profession,
});

export default explorerReducer;
