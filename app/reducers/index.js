import { combineReducers } from 'redux';
import user from 'reducers/user';
import personProfile from 'reducers/personProfile';
import placeProfile from 'reducers/placeProfile';
import rank from 'reducers/rank';
import message from 'reducers/message';
import { routerReducer as routing } from 'react-router-redux';

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  rank,
  user,
  personProfile,
  placeProfile,
  message,
  routing
});

export default rootReducer;
