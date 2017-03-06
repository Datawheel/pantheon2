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

const eras = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_ERAS_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};


const peopleBornInEra = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_BORN_IN_ERA_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const peopleDiedInEra = (
  state = [],
  action
) => {
  switch (action.type) {
    case "GET_PEOPLE_DIED_IN_ERA_SUCCESS":
      return action.res.data;
    default:
      return state;
  }
};

const eraProfileReducer = combineReducers({
  era,
  eras,
  peopleBornInEra,
  peopleDiedInEra
});

export default eraProfileReducer;
