import {combineReducers} from "redux";
import {nest} from "d3-collection";
import {COUNTRY_DEPTH, OCCUPATION_DEPTH} from "types";

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

const grouping = (
  state = "places",
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_GROUPING":
      return action.data;
    default:
      return state;
  }
};


const years = (
  state = [1900, 2000],
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
  state = {selectedDepth: COUNTRY_DEPTH, selectedCountry: "all", selectedCity: "all", selectedCityInCountry: "all", countries: [], cities: [], citiesInCountry: []},
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

const occupation = (
  state = {selectedDepth: OCCUPATION_DEPTH, selectedOccupationSlug: "all", selectedOccupations: "all", domains: [], industries: [], occupations: []},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_OCCUPATION_DEPTH":
      return Object.assign({}, state, {selectedDepth: action.data});
    case "CHANGE_EXPLORER_OCCUPATIONS":
      return Object.assign({}, state, {selectedOccupations: action.data});
    case "CHANGE_EXPLORER_OCCUPATION_SLUG":
      return Object.assign({}, state, {selectedOccupationSlug: action.data});
    case "GET_EXPLORER_OCCUPATIONS_SUCCESS":
      const data = action.res.data;

      const domains = nest()
        .key(d => d.domain_slug)
        .rollup(leaves => {
          return {
            slug: leaves[0].domain_slug,
            name: leaves[0].domain,
            occupations: `${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]),[])}`
          };
        })
        .entries(data)
        .map(d => d.value);

      const industries = nest()
        .key(d => d.industry_slug)
        .rollup(leaves => {
          return {
            slug: leaves[0].industry_slug,
            name: leaves[0].industry,
            occupations: `${leaves.reduce((lOld, lNew) => lOld.concat([lNew.id]), [])}`
          };
        })
        .entries(data)
        .map(d => d.value);

      const occupations = data.map(occupation => {
        return {
          id: occupation.id,
          domain_slug: occupation.domain_slug,
          industry_slug: occupation.industry_slug,
          domain: occupation.domain,
          industry: occupation.industry,
          slug: occupation.occupation_slug,
          name: occupation.occupation,
          occupations: occupation.id
        };
      })

      return {
        selectedDepth: OCCUPATION_DEPTH,
        selectedOccupationSlug: state.selectedOccupationSlug,
        selectedOccupations: state.selectedOccupations,
        domains,
        industries,
        occupations
      }
    default:
      return state;
  }
};

const viz = (
  state = {type: "StackedArea", config: {}},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_VIZ":
      return Object.assign({}, state, {type: action.data});
    case "CHANGE_EXPLORER_VIZ_CONFIG":
      return Object.assign({}, state, {config: action.data});
    default:
      return state;
  }
};

const explorerReducer = combineReducers({
  grouping,
  data,
  years,
  place,
  occupation,
  viz
});

export default explorerReducer;
