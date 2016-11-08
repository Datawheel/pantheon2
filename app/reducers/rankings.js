import { combineReducers } from 'redux';

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

const data = (
  state = [],
  action
) => {
  console.log("action.type:", action.type)
  switch (action.type) {
    case "FETCH_RANKINGS_SUCCESS":
      console.log("action--- ", action)
      if (action.res) return action.res.data;
      return state;
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
  data
});

export default rankingsReducer;
