import {combineReducers} from "redux";
import personProfile from "reducers/personProfile";
import placeProfile from "reducers/placeProfile";
import occupationProfile from "reducers/occupationProfile";
import eraProfile from "reducers/eraProfile";
import rank from "reducers/rank";
import explore from "reducers/explore";
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
  eraProfile,
  explore,
  occupationProfile,
  personProfile,
  placeProfile,
  rank,
  search,
  routing
});

export default rootReducer;
