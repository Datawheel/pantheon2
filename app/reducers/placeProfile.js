import { combineReducers } from 'redux';
import * as types from 'types';

const place = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_PLACE_SUCCESS":
      return action.res.data[0]
    default:
      return state;
  }
}

const peopleBornHere = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_BORN_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const occupations = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_OCCUPATIONS_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const peopleBornHereAlive = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_BORN_ALIVE_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const placeProfileReducer = combineReducers({
  place,
  peopleBornHere,
  occupations,
  peopleBornHereAlive
});

export default placeProfileReducer;
