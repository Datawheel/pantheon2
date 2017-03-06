/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from "es6-promise";
import request from "axios";
import axios from "axios";

polyfill();

export function makeOccupationRequest(method, id, data, api = "/occupation") {
  const requestedURL = api + (id ? ("?occupation_slug=eq." + id) : "");
  console.log(`http://localhost:3100${requestedURL}`)
  return axios.get(`http://localhost:3100${requestedURL}`)
}

export function fetchOccupation(store) {
  return {
    type: "GET_OCCUPATION",
    promise: makeOccupationRequest("get", store.id)
  };
}

export function fetchAllOccupations(store) {
  const getOccupationsProm = makeOccupationRequest("get", null, null, "/occupation?order=num_born.desc.nullslast");

  return {
    type: "GET_OCCUPATIONS",
    promise: getOccupationsProm
  };
}


export function fetchPeople(store) {
  const getPeopleProm = makeOccupationRequest("get", null, null, `/occupation?occupation_slug=eq.${store.id}&select=id`).then(function(profIdRes) {
    const profId = profIdRes.data[0].id;
    return makeOccupationRequest("get", null, null, `/person?occupation=eq.${profId}&order=hpi.desc.nullslast&select=birthplace{id,name,slug},birthcountry{id,continent,country_name,name,slug},deathcountry{id,continent,country_name,name,slug},deathplace{id,name,slug},occupation{*},occupation_id:occupation,*`);
  });

  return {
    type: "GET_PEOPLE_FOR_OCCUPATION",
    promise: getPeopleProm
  };
}

export function fetchPeopleInDomain(store) {
  const getPeopleProm = makeOccupationRequest("get", null, null, `/occupation?occupation_slug=eq.${store.id}&select=domain_slug`).then(function(profIdRes) {
    const domainSlug = profIdRes.data[0].domain_slug;
    return makeOccupationRequest("get", null, null, `/occupation?domain_slug=eq.${domainSlug}&select=id`).then(function(domainIdRes) {
      const profIds = domainIdRes.data.reduce((arr, obj) => arr.concat([obj.id]), []);
      return makeOccupationRequest("get", null, null, `/person?occupation=in.${profIds}&order=langs.desc&select=occupation{*},occupation_id:occupation,*`);
    });
  });

  return {
    type: "GET_PEOPLE_FOR_DOMAIN",
    promise: getPeopleProm
  };
}
