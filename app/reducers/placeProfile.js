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

const placeProfileReducer = combineReducers({
  place
});

export default placeProfileReducer;
