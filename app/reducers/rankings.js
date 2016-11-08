import { combineReducers } from 'redux';
import { RANKINGS_RESULTS_PER_PAGE } from 'types';

const type = (
  state = "person",
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_TYPE":
      return action.data;
    default:
      return state;
  }
};

const years = (
  state = {min: -2000, max:1200},
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
  state = {data:[], pages:0, page:0},
  action
) => {
  switch (action.type) {
    case "FETCH_RANKINGS_SUCCESS":
      if (action.res) {
        const contentRange = action.res.headers["content-range"];
        const totalResults = parseInt(contentRange.split("/")[1]);
        const totalPages = Math.ceil(totalResults / RANKINGS_RESULTS_PER_PAGE);
        return {
          data: action.res.data,
          pages: totalPages,
          page: state.page
        }
      }
      return state;
    case "CHANGE_RANKING_PAGE":
      return Object.assign({}, state, {page: action.data});
    // case types.CREATE_TOPIC_REQUEST:
    //   return [...state, topic(undefined, action)];
    // case types.CREATE_TOPIC_FAILURE:
    //   return state.filter(t => t.id !== action.id);
    // case types.DESTROY_TOPIC:
    //   return state.filter(t => t.id !== action.id);
    // case types.INCREMENT_COUNT:
    // case types.DECREMENT_COUNT:
    //   return state.map(t => topic(t, action));
    default:
      return state;
  }
};

const rankingsReducer = combineReducers({
  type,
  years,
  country,
  place,
  domain,
  profession,
  results
});

export default rankingsReducer;
