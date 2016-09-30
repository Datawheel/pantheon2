/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import axios from 'axios';
import * as types from 'types';

polyfill();

export function makePlaceRequest(method, id, data, api = '/place') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  // return request[method](requestedURL, data);}}
  console.log(`http://localhost:3100${requestedURL}`)
  return axios.get(`http://localhost:3100${requestedURL}`)
}

export function fetchPlace(store) {
  const prom = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}`);
  return {
    type: "GET_PLACE",
    promise: prom
  };
}

export function fetchPeopleBornHere(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    return makePlaceRequest('get', null, null, `/person?birthcountry=eq.${placeId}&order=langs.desc`);
  })

  return {
    type: "GET_PEOPLE_BORN",
    promise: getPeopleProm
  };
}

export function fetchOccupations(store) {
  const getOccupationsProm = makePlaceRequest('get', null, null, `/occupation`);

  return {
    type: "GET_OCCUPATIONS",
    promise: getOccupationsProm
  };
}

export function fetchOccupationsHere(store) {
  const getOccupationsHereProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    return makePlaceRequest('get', null, null, `/country_occupation?country=eq.${placeId}&limit=5&order=num_people.desc&select=occupation{*},*`);
  })

  return {
    type: "GET_OCCUPATIONS_HERE",
    promise: getOccupationsHereProm
  };
}

export function fetchPeopleBornHereAlive(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    return makePlaceRequest('get', null, null, `/person?birthcountry=eq.${placeId}&limit=3&order=langs.desc&alive=is.true`);
  })

  return {
    type: "GET_PEOPLE_BORN_ALIVE",
    promise: getPeopleProm
  };
}
