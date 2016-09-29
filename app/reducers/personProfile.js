import { combineReducers } from 'redux';
import * as types from 'types';

const person = (
  state = {},
  action
) => {
  switch (action.type) {
    case types.GET_PERSON_SUCCESS:
      return action.res.data[0]
    default:
      return state;
  }
}

const occupationRank = (
  state = {me:{}, peers:[]},
  action
) => {
  switch (action.type) {
    case "GET_OCCUPATION_RANKS_SUCCESS":
      return {me:action.res[0].data[0], peers:action.res[1].data}
    default:
      return state;
  }
};

const birthcountryRank = (
  state = {me:{}, peers:[]},
  action
) => {
  switch (action.type) {
    case "GET_BIRTHCOUNTRY_RANKS_SUCCESS":
      return {me:action.res[0].data[0], peers:action.res[1].data}
    default:
      return state;
  }
};

const birthyearRank = (
  state = {me:{}, peers:[]},
  action
) => {
  switch (action.type) {
    case "GET_BIRTHYEAR_RANKS_SUCCESS":
      return {me:action.res[0].data[0], peers:action.res[1].data}
    default:
      return state;
  }
};

const personProfileReducer = combineReducers({
  person,
  occupationRank,
  birthcountryRank,
  birthyearRank
});

export default personProfileReducer;
