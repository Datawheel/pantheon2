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

const professionProfileReducer = combineReducers({
  profession
});

export default professionProfileReducer;
