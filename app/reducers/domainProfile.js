import { combineReducers } from 'redux';
import * as types from 'types';

const domain = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_DOMAIN_SUCCESS":
      return action.res.data[0]
    default:
      return state;
  }
}

const domainProfileReducer = combineReducers({
  domain
});

export default domainProfileReducer;
