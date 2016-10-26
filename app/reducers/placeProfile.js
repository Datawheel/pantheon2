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

const placeRanks = (
  state = {me:{}, peers:[]},
  action
) => {
  switch (action.type) {
    case "GET_PLACE_RANKS_SUCCESS":
      return {me:action.res[0].data[0], peers:action.res[1].data}
    default:
      return state;
  }
}

const country = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_COUNTRY_SUCCESS":
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

const peopleDiedHere = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_DIED_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const professionsHere = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PROFESSIONS_HERE_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const professionsBornHere = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PROFESSIONS_BORN_HERE_SUCCESS":
      return action.res.data
    default:
      return state;
  }
}

const professionsDiedHere = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PROFESSIONS_DIED_HERE_SUCCESS":
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
  placeRanks,
  country,
  peopleBornHere,
  peopleDiedHere,
  professionsBornHere,
  professionsDiedHere,
  peopleBornHereAlive
});

export default placeProfileReducer;
