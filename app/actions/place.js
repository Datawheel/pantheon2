/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import axios from 'axios';
import * as types from 'types';
import { NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST } from 'types'

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

export function fetchCountry(store) {
  const getPlaceProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=country_code`).then(function(placeIdRes) {
    const placeCountryCode = placeIdRes.data[0].country_code;
    return makePlaceRequest('get', null, null, `/place?country_code=eq.${placeCountryCode}&wiki_id=is.null`);
  })

  return {
    type: "GET_COUNTRY",
    promise: getPlaceProm
  };
}

export function fetchPlaceRanks(store) {
  const getPlaceRank = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id,name,country_name,born_rank,born_rank_unique`)
  const getPlaceRankPeers = getPlaceRank.then(function(placeRankRes) {
      const placeRankData = placeRankRes.data[0];
      const placeRank = placeRankData.born_rank_unique;
      const isCountry = placeRankData.name === placeRankData.country_name ? true : false;
      const sumlevelFilter = isCountry ? "wiki_id=is.null" : "wiki_id=isnot.null";
      let rankSub = Math.max(1, parseInt(placeRank) - NUM_RANKINGS_PRE);
      let rankPlus = Math.max(NUM_RANKINGS, parseInt(placeRank) + NUM_RANKINGS_POST);
      const apiURL = `/place?born_rank_unique=gte.${rankSub}&born_rank_unique=lte.${rankPlus}&order=born_rank_unique&${sumlevelFilter}`;
      // console.log("PlaceRank API:", apiURL)
      return makePlaceRequest('get', null, null, apiURL);
  });

  const prom = Promise.all([getPlaceRank, getPlaceRankPeers])

  return {
    type: "GET_PLACE_RANKS",
    promise: prom
  };
}

export function fetchPeopleBornHere(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id,name,country_name`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    const placeName = placeIdRes.data[0].name;
    const placeCountryName = placeIdRes.data[0].country_name;
    const placeColumn = placeName === placeCountryName ? "birthcountry" : "birthplace";
    return makePlaceRequest('get', null, null, `/person?${placeColumn}=eq.${placeId}&order=langs.desc&select=profession{*},profession_id:profession,*`);
  })

  return {
    type: "GET_PEOPLE_BORN",
    promise: getPeopleProm
  };
}

export function fetchPeopleDiedHere(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id,name,country_name`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    const placeName = placeIdRes.data[0].name;
    const placeCountryName = placeIdRes.data[0].country_name;
    const placeColumn = placeName === placeCountryName ? "deathcountry" : "deathplace";
    return makePlaceRequest('get', null, null, `/person?${placeColumn}=eq.${placeId}&order=langs.desc&select=profession{*},profession_id:profession,*`);
  })

  return {
    type: "GET_PEOPLE_DIED",
    promise: getPeopleProm
  };
}

export function fetchProfessionsBornHere(store) {
  const getProfessionsHereProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    return makePlaceRequest('get', null, null, `/place_profession?place=eq.${placeId}&limit=5&order=num_born.desc.nullslast&select=profession{*},*`);
  })

  return {
    type: "GET_PROFESSIONS_BORN_HERE",
    promise: getProfessionsHereProm
  };
}

export function fetchProfessionsDiedHere(store) {
  const getProfessionsHereProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    return makePlaceRequest('get', null, null, `/place_profession?place=eq.${placeId}&limit=5&order=num_died.desc.nullslast&select=profession{*},*`);
  })

  return {
    type: "GET_PROFESSIONS_DIED_HERE",
    promise: getProfessionsHereProm
  };
}

export function fetchPeopleBornHereAlive(store) {
  const getPeopleProm = makePlaceRequest('get', null, null, `/place?slug=eq.${store["id"]}&select=id,name,country_name`).then(function(placeIdRes) {
    const placeId = placeIdRes.data[0].id;
    const placeName = placeIdRes.data[0].name;
    const placeCountryName = placeIdRes.data[0].country_name;
    const placeColumn = placeName === placeCountryName ? "birthcountry" : "birthplace";
    return makePlaceRequest('get', null, null, `/person?${placeColumn}=eq.${placeId}&limit=3&order=langs.desc&alive=is.true`);
  })

  return {
    type: "GET_PEOPLE_BORN_ALIVE",
    promise: getPeopleProm
  };
}
