import { combineReducers } from 'redux';
import { RANKINGS_RESULTS_PER_PAGE } from 'types';

const type = (
  state = "profession",
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
  state = "profession",
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_TYPE_NESTING":
      return action.data;
    default:
      return state;
  }
};

const yearType = (
  state = "birthyear",
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_YEAR_TYPE":
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
    case "CHANGE_RANKING_YEARS":
      return action.data;
    default:
      return state;
  }
};

const country = (
  state = {id: 'all', places:[]},
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_COUNTRY":
      return {
        id: action.data,
        places: action.res.data
      }
    default:
      return state;
  }
};

const place = (
  state = 'all',
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_PLACE":
      return action.data;
    default:
      return state;
  }
};

const domain = (
  state = {id: 'all', professions:[]},
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_DOMAIN":
      return {
        id: action.data,
        professions: action.res.data
      }
    default:
      return state;
  }
};

const profession = (
  state = 'all',
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_PROFESSION":
      return action.data;
    default:
      return state;
  }
};

const results = (
  state = {data:[], pages:0, page:0, loading:false},
  action
) => {
  switch (action.type) {
    case "FETCH_RANKINGS":
      return Object.assign({}, state, {loading: true});
    case "FETCH_RANKINGS_SUCCESS":
      if (action.res) {
        console.log('action.res.headers["content-range"]', action.res.headers["content-range"])
        const contentRange = action.res.headers["content-range"];
        const totalResults = parseInt(contentRange.split("/")[1]);
        const totalPages = Math.ceil(totalResults / action.res.data.length);
        return {
          data: action.res.data,
          pages: totalPages,
          page: state.page,
          loading: false
        }
      }
      return state;
    case "CHANGE_RANKING_PAGE":
      return Object.assign({}, state, {page: action.data});
    default:
      return state;
  }
};

const rankingsReducer = combineReducers({
  type,
  typeNesting,
  yearType,
  years,
  country,
  place,
  domain,
  profession,
  results
});

export default rankingsReducer;
