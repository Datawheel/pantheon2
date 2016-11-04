import { combineReducers } from 'redux';

const type = (
  state = "birthcountry",
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
  state = 'all',
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_COUNTRY":
      return action.data;
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
  state = 'all',
  action
) => {
  switch (action.type) {
    case "CHANGE_RANKING_DOMAIN":
      return action.data;
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

const rankingControlsReducer = combineReducers({
  type,
  years,
  country,
  place,
  domain,
  profession
});

export default rankingControlsReducer;
