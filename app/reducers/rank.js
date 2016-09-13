import { combineReducers } from 'redux';
import * as types from 'types';

const rank = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_RANK_SUCCESS":
      return action.res.data[0];
    default:
      return state;
  }
};

const ranks = (
  state = [],
  action
) => {
  // console.log(action.type)
  switch (action.type) {
    case "GET_CLOSEST_RANKS_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const rankReducer = combineReducers({
  rank,
  ranks
});

export default rankReducer;
