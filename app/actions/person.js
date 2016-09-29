/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from 'types';

polyfill();

export function makePersonRequest(method, id, data, api = '/person') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  return request[method](requestedURL, data);
}

export function fetchPerson(store) {
  const prom = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=occupation{*},birthcountry{*},birthplace{*},birthyear{*},*`);
  return {
    type: types.GET_PERSON,
    promise: prom
  };
}

export function fetchOccupationRanks(store) {
  const getOccRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
    const personId = personIdRes.data[0].id;
    return makePersonRequest('get', null, null, `/person_occupation_rank?person=eq.${personId}&select=occupation{*},rank,rank_unique,langs`)
  })
  const getOccRankPeers = getOccRank.then(function(occRankRes) {
        const occRank = occRankRes.data[0];
        const occId = occRank.occupation.id;
        let rankSub = Math.max(1, parseInt(occRank.rank_unique) - 2);
        let rankPlus = Math.max(5, parseInt(occRank.rank_unique) + 2);
        if(rankPlus > occRank.occupation.people){
          rankSub = occRank.occupation.people - 5;
          rankPlus = occRank.occupation.people;
        }
        const apiURL = `/person_occupation_rank?occupation=eq.${occId}&rank_unique=gte.${rankSub}&rank_unique=lte.${rankPlus}&select=occupation{*},person{*},langs,rank,rank_unique`;
        // console.log("OccRank API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const prom = Promise.all([getOccRank, getOccRankPeers])

  return {
    type: "GET_OCCUPATION_RANKS",
    promise: prom
  };
}

export function fetchBirthcountryRanks(store) {
  const getBCRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
    const personId = personIdRes.data[0].id;
    return makePersonRequest('get', null, null, `/person_birthcountry_rank?person=eq.${personId}&select=birthcountry{*},rank,rank_unique,langs`);
  })

  const getBCRankPeers = getBCRank.then(function(bcRankRes) {
        const bcRank = bcRankRes.data[0];
        const bcId = bcRank.birthcountry.id;
        const rankSub = Math.max(1, parseInt(bcRank.rank_unique) - 2);
        const rankPlus = Math.max(5, parseInt(bcRank.rank_unique) + 2);
        const apiURL = `/person_birthcountry_rank?birthcountry=eq.${bcId}&rank_unique=gte.${rankSub}&rank_unique=lte.${rankPlus}&select=birthcountry{*},person{*},langs,rank,rank_unique`;
        // console.log("Birthcountry API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const bcProm = Promise.all([getBCRank, getBCRankPeers])

  return {
    type: "GET_BIRTHCOUNTRY_RANKS",
    promise: bcProm
  };
}

export function fetchBirthyearRanks(store) {
  const getBYRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
    const personId = personIdRes.data[0].id;
    return makePersonRequest('get', null, null, `/person_birthyear_rank?person=eq.${personId}&select=birthyear{*},rank,rank_unique,langs`);
  })
  const getBYRankPeers = getBYRank.then(function(byRankRes) {
        const byRank = byRankRes.data[0];
        const byId = byRank.birthyear.id;
        const rankSub = Math.max(1, parseInt(byRank.rank_unique) - 2);
        const rankPlus = Math.max(5, parseInt(byRank.rank_unique) + 2);
        const apiURL = `/person_birthyear_rank?birthyear=eq.${byId}&rank_unique=gte.${rankSub}&rank_unique=lte.${rankPlus}&select=birthyear{*},person{*},langs,rank,rank_unique&order=rank_unique.asc`
        // console.log("Birthyear API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const byProm = Promise.all([getBYRank, getBYRankPeers])

  return {
    type: "GET_BIRTHYEAR_RANKS",
    promise: byProm
  };
}
