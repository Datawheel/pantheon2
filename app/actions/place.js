/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from 'types';

polyfill();

export function makePlaceRequest(method, id, data, api = '/country') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  return request[method](requestedURL, data);
}

export function fetchPlace(store) {
  const prom = makePlaceRequest('get', store["id"]);
  return {
    type: "GET_PLACE",
    promise: prom
  };
}

export function fetchPeopleBornHere(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/person?birthcountry=eq.${store["id"]}&order=langs.desc`);

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
  const getOccupationsHereProm = makePlaceRequest('get', null, null, `/country_occupation?country=eq.${store["id"]}&limit=5&order=num_people.desc&select=occupation{*},*`);

  return {
    type: "GET_OCCUPATIONS_HERE",
    promise: getOccupationsHereProm
  };
}

export function fetchPeopleBornHereAlive(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/person?birthcountry=eq.${store["id"]}&limit=3&order=langs.desc&deathyear=is.null`);

  return {
    type: "GET_PEOPLE_BORN_ALIVE",
    promise: getPeopleProm
  };
}
