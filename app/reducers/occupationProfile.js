import {combineReducers} from "redux";

const occupation = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_OCCUPATION_SUCCESS":
      return action.res.data[0];
    default:
      return state;
  }
};

const occupations = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_OCCUPATIONS_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const people = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_FOR_OCCUPATION_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const peopleInDomain = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_FOR_DOMAIN_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const occupationProfileReducer = combineReducers({
  occupation,
  occupations,
  people,
  peopleInDomain
});

export default occupationProfileReducer;
