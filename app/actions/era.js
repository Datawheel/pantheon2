/* eslint consistent-return: 0, no-else-return: 0*/
import {polyfill} from "es6-promise";
import axios from "axios";

polyfill();

export function makeEraRequest(method, id, data, api = "/era") {
  const requestedURL = api + (id ? ("?slug=eq." + id) : "");
  console.log(`http://localhost:3100${requestedURL}`);
  return axios.get(`http://localhost:3100${requestedURL}`);
}

export function fetchEra(store) {
  return {
    type: "GET_ERA",
    promise: makeEraRequest("get", store.id)
  };
}

export function fetchEras() {
  return {
    type: "GET_ERAS",
    promise: makeEraRequest("get", null, null, "/era?order=start_year")
  };
}

export function fetchPeopleBornInEra(store) {
  const getPeopleProm = makeEraRequest("get", null, null, `/era?slug=eq.${store.id}&select=start_year,end_year`).then(function(eraIdRes) {
    const startYear = eraIdRes.data[0].start_year;
    const endYear = eraIdRes.data[0].end_year;
    return makeEraRequest("get", null, null, `/person?birthyear=gte.${startYear}&birthyear=lte.${endYear}&order=hpi.desc.nullslast&select=birthplace{id,name,slug,lat_lon},birthcountry{id,continent,country_code,country_name,name,slug},occupation{*},occupation_id:occupation,*`);
  });

  return {
    type: "GET_PEOPLE_BORN_IN_ERA",
    promise: getPeopleProm
  };
}

export function fetchPeopleDiedInEra(store) {
  const getPeopleProm = makeEraRequest("get", null, null, `/era?slug=eq.${store.id}&select=start_year,end_year`).then(function(eraIdRes) {
    const startYear = eraIdRes.data[0].start_year;
    const endYear = eraIdRes.data[0].end_year;
    return makeEraRequest("get", null, null, `/person?deathyear=gte.${startYear}&deathyear=lte.${endYear}&order=hpi.desc.nullslast&select=deathcountry{id,continent,country_code,country_name,name,slug},deathplace{id,name,slug,lat_lon},occupation{*},occupation_id:occupation,*`);
  });

  return {
    type: "GET_PEOPLE_DIED_IN_ERA",
    promise: getPeopleProm
  };
}
