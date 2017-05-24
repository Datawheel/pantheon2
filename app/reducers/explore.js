import {combineReducers} from "redux";
import {COUNTRY_DEPTH, OCCUPATION_DEPTH, RANKINGS_RESULTS_PER_PAGE} from "types";

const page = (state = "viz", action) => {
  if (action.type ===  "SET_EXPLORE_PAGE") return action.page;
  return state;
};

const data = (
  state = [],
  action
) => {
  switch (action.type) {
    case "FETCH_EXPLORE_DATA_SUCCESS":
      return action.data;
    default:
      return state;
  }
};

const type = (
  state = null,
  // state = "person",
  // state = "occupation",
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_TYPE":
      return action.data;
    default:
      return state;
  }
};

const typeNesting = (
  state = "person",
  // state = "occupation",
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_TYPE_NESTING":
      return action.data;
    default:
      return state;
  }
};

const grouping = (
  state = null,
  // state = "places",
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORER_GROUPING":
      return action.data;
    default:
      return state;
  }
};

const show = (
  state = {type: "people", depth: "people"},
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
      return {type: action.show.type, depth: action.show.depth};
    case "CHANGE_EXPLORE_SHOW_TYPE":
      return {type: action.data, depth: action.data};
    case "CHANGE_EXPLORE_SHOW_DEPTH":
      return {type: state.type, depth: action.data};
    default:
      return state;
  }
};

const years = (
  state = [1900, 2000],
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "CHANGE_EXPLORE_YEARS":
      return action.years;
    default:
      return state;
  }
};

const place = (
  state = {selectedDepth: COUNTRY_DEPTH, selectedCountry: "all", selectedCountryStr: "all", selectedPlace: "all", selectedPlaceStr: "all", selectedPlaceInCountry: "all", selectedPlaceInCountryStr: "all", countries: [], places: [], placesInCountry: []},
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE_PLACE_SUCCESS":
      const defaultState = Object.assign({}, state);
      defaultState.selectedDepth = action.res.selectedDepth;
      defaultState.selectedCountry = action.res.countryId || defaultState.selectedCountry;
      defaultState.selectedCountryStr = action.res.country || defaultState.selectedCountryStr;
      defaultState.selectedPlace = action.res.placeId || defaultState.selectedPlace;
      defaultState.selectedPlaceStr = action.res.place || defaultState.selectedPlaceStr;
      defaultState.selectedPlaceInCountry = action.res.selectedPlaceInCountry || defaultState.selectedPlaceInCountry;
      defaultState.selectedPlaceInCountryStr = action.res.selectedPlaceInCountryStr || defaultState.selectedPlaceInCountryStr;
      defaultState.countries = action.res.countries;
      defaultState.places = action.res.places;
      defaultState.placesInCountry = action.res.placesInCountry || defaultState.placesInCountry;
      return defaultState;
    case "CHANGE_EXPLORE_PLACE_DEPTH":
      return Object.assign({}, state, {selectedDepth: action.data});
    case "CHANGE_EXPLORE_COUNTRY":
      return Object.assign({}, state, {selectedCountry: action.countryId, selectedCountryStr: action.countryStr, selectedPlaceInCountry: "all"});
    case "CHANGE_EXPLORE_PLACE_IN_COUNTRY":
      return Object.assign({}, state, {selectedPlaceInCountry: action.placeId, selectedPlaceInCountryStr: action.placeSlug});
    case "CHANGE_EXPLORE_PLACE":
      return Object.assign({}, state, {selectedPlace: action.placeId, selectedPlaceStr: action.placeSlug});
    case "GET_PLACES_SUCCESS":
      return Object.assign({}, state, {places: action.res.data});
    case "GET_PLACES_IN_COUNTRY_SUCCESS":
      return Object.assign({}, state, {placesInCountry: action.data});
    default:
      return state;
  }
};

const occupation = (
  state = {selectedDepth: OCCUPATION_DEPTH, selectedOccupationSlug: "all", selectedOccupations: "all", domains: [], industries: [], occupations: []},
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE_OCCUPATION_SUCCESS":
      const defaultState = Object.assign({}, state);
      defaultState.selectedOccupationSlug = action.res.occupationSlug || defaultState.selectedOccupationSlug;
      defaultState.selectedOccupations = action.res.occupationIds || defaultState.selectedOccupations;
      defaultState.occupations = action.res.occupations;
      defaultState.industries = action.res.industries;
      defaultState.domains = action.res.domains;
      defaultState.selectedDepth = action.res.depth;
      return defaultState;
    case "CHANGE_EXPLORER_OCCUPATION_DEPTH":
      return Object.assign({}, state, {selectedDepth: action.data});
    case "CHANGE_EXPLORER_OCCUPATIONS":
      return Object.assign({}, state, {selectedOccupations: action.data});
    case "CHANGE_EXPLORER_OCCUPATION_SLUG":
      return Object.assign({}, state, {selectedOccupationSlug: action.data});
    default:
      return state;
  }
};

const viz = (
  state = {type: "StackedArea", config: {}},
  action
) => {
  switch (action.type) {
    case "CHANGE_EXPLORE_VIZ":
      return {type: action.vizType, config: action.vizConfig};
    default:
      return state;
  }
};

const rankings = (
  state = {data: [], pages: 0, page: 0, loading: false, sorting: null},
  action
) => {
  switch (action.type) {
    case "FETCH_RANKINGS":
      return Object.assign({}, state, {loading: true});
    case "CHANGE_RANKINGS_PAGES":
      return Object.assign({}, state, {loading: false, pages: action.pages});
    case "FETCH_RANKINGS_SUCCESS":
      if (action.res) {
        // console.log('action.res.headers["content-range"]', action.res.headers["content-range"])
        const contentRange = action.res.headers["content-range"];
        const totalResults = parseInt(contentRange.split("/")[1], 10);
        const totalPages = Math.ceil(totalResults / RANKINGS_RESULTS_PER_PAGE);
        return {
          data: action.res.data,
          pages: totalPages,
          page: state.page,
          loading: false
        };
      }
      return state;
    case "CHANGE_RANKING_PAGE":
      return Object.assign({}, state, {page: action.data});
    case "CHANGE_RANKING_PAGES":
      return Object.assign({}, state, {pages: action.data});
    default:
      return state;
  }
};

const metric = (
  state = {metricType: "hpi", cutoff: 4},
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "CHANGE_EXPLORE_METRIC":
      return {metricType: action.metricType, cutoff: action.cutoff};
    default:
      return state;
  }
};

const exploreReducer = combineReducers({
  data,
  grouping,
  metric,
  occupation,
  page,
  place,
  rankings,
  show,
  type,
  typeNesting,
  viz,
  years
});

export default exploreReducer;
