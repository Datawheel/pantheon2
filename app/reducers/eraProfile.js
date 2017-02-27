import {combineReducers} from "redux";

const era = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_ERA_SUCCESS":
      return action.res.data[0];
    default:
      return state;
  }
};

const eraProfileReducer = combineReducers({
  era
});

export default eraProfileReducer;
