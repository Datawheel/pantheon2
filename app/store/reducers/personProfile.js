import {combineReducers} from "redux";
// import * as types from "types";

const person = (
  state = {},
  action
) => {
  switch (action.type) {
    case "GET_PERSON_SUCCESS":
      return action.res.data[0];
    default:
      return state;
  }
};

// const occupationRank = (
//   state = {me:{}, peers:[]},
//   action
// ) => {
//   switch (action.type) {
//     case "GET_OCCUPATION_RANKS_SUCCESS":
//       return {me:action.res[0].data[0], peers:action.res[1].data}
//     default:
//       return state;
//   }
// };
//
// const countryRank = (
//   state = {me:{}, birthcountryPeers:[], deathcountryPeers:[]},
//   action
// ) => {
//   // console.log(action.type)
//   switch (action.type) {
//     case "GET_BIRTHCOUNTRY_RANKS_SUCCESS":
//       // console.log(action.res[0].data)
//       return {me:action.res[0].data[0], birthcountryPeers:action.res[1].data, deathcountryPeers:action.res[2].data}
//     case "GET_BIRTHCOUNTRY_RANKS_FAILURE":
//       // console.log(action.res)
//       return {me:{'me':true}, birthcountryPeers:[4, 5, 6], deathcountryPeers:[2, 3, 4]}
//       return state
//     default:
//       return state;
//   }
// };
//
// const yearRank = (
//   state = {me:{}, birthyearPeers:[], deathyearPeers:[]},
//   action
// ) => {
//   switch (action.type) {
//     case "GET_YEAR_RANKS_SUCCESS":
//       return {me:action.res[0].data[0], birthyearPeers:action.res[1].data, deathyearPeers:action.res[2].data}
//     default:
//       return state;
//   }
// };
//
// const pageviews = (
//   state = [],
//   action
// ) => {
//   switch (action.type) {
//     case "GET_PAGEVIEWS_SUCCESS":
//       return action.res.data
//     default:
//       return state;
//   }
// }
//
// const creationdates = (
//   state = [],
//   action
// ) => {
//   switch (action.type) {
//     case "GET_CREATIONDATES_SUCCESS":
//       return action.res.data
//     default:
//       return state;
//   }
// }

const personProfileReducer = combineReducers({
  person
  // occupationRank,
  // countryRank,
  // yearRank,
  // pageviews,
  // creationdates
});

export default personProfileReducer;
