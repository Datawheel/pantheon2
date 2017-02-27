import {combineReducers} from "redux";
import user from "reducers/user";
import personProfile from "reducers/personProfile";
import placeProfile from "reducers/placeProfile";
import occupationProfile from "reducers/occupationProfile";
import eraProfile from "reducers/eraProfile";
import rank from "reducers/rank";
import rankings from "reducers/rankings";
import explorer from "reducers/explorer";
import {routerReducer as routing} from "react-router-redux";

const searchActive = (
  state = false,
  action
) => {
  switch (action.type) {
    case "ACTIVATE_SEARCH":
      return !state;
    default:
      return state;
  }
};

const search = combineReducers({
  searchActive
});

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  search,
  rank,
  user,
  personProfile,
  placeProfile,
  occupationProfile,
  eraProfile,
  rankings,
  explorer,
  routing
});

export default rootReducer;
