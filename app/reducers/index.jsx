import {combineReducers} from "redux";
import personProfile from "reducers/personProfile";
import explore from "reducers/explore";

const rootReducer = combineReducers({
  personProfile,
  explore
});

export default rootReducer;
