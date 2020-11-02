import {combineReducers} from "redux";
import {YEAR_RANGE} from "types";

const city = (
  state = "all",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_CITY":
      return action.city;
    default:
      return state;
  }
};

const country = (
  state = "all",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_COUNTRY":
      return action.country;
    default:
      return state;
  }
};

const data = (
  state = {data: null, loading: true, count: 0, offset: 0, page: 1, pageIndex: 0, pageSize: 50, new: false},
  action
) => {
  switch (action.type) {
    case "FETCH_VB_DATA":
      return Object.assign({}, state, {loading: true, pageIndex: action.pageIndex});
      // return {data: [], loading: true};
    case "FETCH_VB_DATA_SUCCESS":
      return {data: action.data, offset: action.offset, page: action.page, pageIndex: action.pageIndex, pageSize: action.pageSize, range: action.range, count: action.count, loading: false, new: action.new};
    case "VB_RESET_NEW_DATA":
      return Object.assign({}, state, {new: false});
    default:
      return state;
  }
};

const gender = (
  state = null,
  // state = M,
  // state = F,
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_GENDER":
      return action.gender;
    default:
      return state;
  }
};

const metricType = (
  state = "hpi",
  // state = "l",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_METRIC_TYPE":
      return action.metricType;
    default:
      return state;
  }
};

const metricCutoff = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_METRIC_CUTOFF":
      return action.metricCutoff;
    default:
      return state;
  }
};

const occupation = (
  state = "all",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_OCCUPATION":
      return action.occupation;
    default:
      return state;
  }
};

const onlyShowNew = (
  state = false,
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_ONLY_SHOW_NEW":
      return action.onlyShowNew;
    default:
      return state;
  }
};

const page = (
  state = "rankings",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_PAGE":
      return action.page;
    default:
      return state;
  }
};

const placeType = (
  state = "birthplace",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_PLACE_TYPE":
      return action.placeType;
    default:
      return state;
  }
};

const show = (
  state = {type: "people", depth: "people"},
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
      return {type: action.show.type, depth: action.show.depth};
    case "VB_UPDATE_SHOW_TYPE":
      return {type: action.showType, depth: state.data};
    case "VB_UPDATE_SHOW_DEPTH":
      return {type: state.type, depth: action.showDepth};
    default:
      return state;
  }
};

const viz = (
  state = "treemap",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_VIZ":
      return action.viz;
    default:
      return state;
  }
};

const years = (
  state = YEAR_RANGE,
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_YEARS":
      return action.years;
    default:
      return state;
  }
};

const yearType = (
  state = "birthyear",
  action
) => {
  switch (action.type) {
    case "INIT_EXPLORE":
    case "VB_UPDATE_YEAR_TYPE":
      return action.yearType;
    default:
      return state;
  }
};

const vbReducer = combineReducers({
  city,
  country,
  data,
  gender,
  metricType,
  metricCutoff,
  occupation,
  onlyShowNew,
  page,
  placeType,
  show,
  viz,
  years,
  yearType
});

export default vbReducer;
