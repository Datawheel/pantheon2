import { combineReducers } from 'redux';
import * as types from 'types';

const profession = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_PROFESSION_SUCCESS":
      return action.res.data[0]
    default:
      return state;
  }
}

const professions = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PROFESSIONS_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const people = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_FOR_PROFESSION_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const peopleInDomain = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_FOR_DOMAIN_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const professionProfileReducer = combineReducers({
  profession,
  professions,
  people,
  peopleInDomain
});

export default professionProfileReducer;
