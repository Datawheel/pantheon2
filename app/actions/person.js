/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import axios from 'axios';
import * as types from 'types';

polyfill();

export function makePersonRequest(method, id, data, api = '/person') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  // return request[method](requestedURL, data);
  console.log(`http://localhost:3100${requestedURL}`)
  return axios.get(`http://localhost:3100${requestedURL}`)
}

export function fetchPerson(store) {
  const prom = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=occupation{*},birthcountry{*},birthplace{*},birthyear{*},deathcountry{*},deathplace{*},deathyear{*},*`);
  return {
    type: types.GET_PERSON,
    promise: prom
  };
}

export function fetchOccupationRanks(store) {
  const getOccRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id,occupation{*},occupation_rank,occupation_rank_unique,langs`)
  const getOccRankPeers = getOccRank.then(function(occRankRes) {
        const occRank = occRankRes.data[0];
        const occId = occRank.occupation.id;
        let rankSub = Math.max(1, parseInt(occRank.occupation_rank_unique) - 2);
        let rankPlus = Math.max(5, parseInt(occRank.occupation_rank_unique) + 2);
        if(rankPlus > occRank.occupation.num_born){
          rankSub = occRank.occupation.num_born - 5;
          rankPlus = occRank.occupation.num_born;
        }
        const apiURL = `/person?occupation=eq.${occId}&occupation_rank_unique=gte.${rankSub}&occupation_rank_unique=lte.${rankPlus}&select=occupation{*},birthcountry{*},langs,occupation_rank,occupation_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        // console.log("OccRank API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const prom = Promise.all([getOccRank, getOccRankPeers])

  return {
    type: "GET_OCCUPATION_RANKS",
    promise: prom
  };
}

export function fetchCountryRanks(store) {
  const getCountryRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id,birthcountry{*},deathcountry{*},birthcountry_rank,birthcountry_rank_unique,deathcountry_rank,deathcountry_rank_unique,langs`)

  const getBCRankPeers = getCountryRank.then(function(bcRankRes) {
        const bcRank = bcRankRes.data[0];
        const bcId = bcRank.birthcountry.id;
        const rankSub = Math.max(1, parseInt(bcRank.birthcountry_rank_unique) - 2);
        const rankPlus = Math.max(5, parseInt(bcRank.birthcountry_rank_unique) + 2);
        const apiURL = `/person?birthcountry=eq.${bcId}&birthcountry_rank_unique=gte.${rankSub}&birthcountry_rank_unique=lte.${rankPlus}&order=birthcountry_rank_unique&select=birthcountry{*},langs,birthcountry_rank,birthcountry_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        // console.log("Birthcountry API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const getDCRankPeers = getCountryRank.then(function(bcRankRes) {
        const dcRank = bcRankRes.data[0];
        // console.log('dcRank -- ', dcRank)
        let apiURL;
        if(dcRank.deathcountry){
          let dcId = dcRank.deathcountry.id;
          let rankSub = Math.max(1, parseInt(dcRank.deathcountry_rank_unique) - 2);
          let rankPlus = Math.max(5, parseInt(dcRank.deathcountry_rank_unique) + 2);
          apiURL = `/person?deathcountry=eq.${dcId}&deathcountry_rank_unique=gte.${rankSub}&deathcountry_rank_unique=lte.${rankPlus}&order=deathcountry_rank_unique&select=deathcountry{*},langs,deathcountry_rank,deathcountry_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        }
        else {
          let bcRank = bcRankRes.data[0];
          let bcId = bcRank.birthcountry.id;
          let rankSub = Math.max(1, parseInt(bcRank.birthcountry_rank_unique) - 2);
          let rankPlus = Math.max(5, parseInt(bcRank.birthcountry_rank_unique) + 2);
          apiURL = `/person?deathcountry=eq.0`;
        }
        // console.log('444444', apiURL)
        return makePersonRequest('get', null, null, apiURL);
    }).catch((e) => { console.log(e) });


  const bcProm = Promise.all([getCountryRank, getBCRankPeers, getDCRankPeers])

  return {
    type: "GET_BIRTHCOUNTRY_RANKS",
    promise: bcProm
  };

  // const getBCRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
  //   const personId = personIdRes.data[0].id;
  //   return makePersonRequest('get', null, null, `/person_birthcountry_rank?person=eq.${personId}&select=birthcountry{*},rank,rank_unique,langs`);
  // })
  //
  // const getBCRankPeers = getBCRank.then(function(bcRankRes) {
  //       const bcRank = bcRankRes.data[0];
  //       const bcId = bcRank.birthcountry.id;
  //       const rankSub = Math.max(1, parseInt(bcRank.rank_unique) - 2);
  //       const rankPlus = Math.max(5, parseInt(bcRank.rank_unique) + 2);
  //       const apiURL = `/person_birthcountry_rank?birthcountry=eq.${bcId}&rank_unique=gte.${rankSub}&rank_unique=lte.${rankPlus}&select=birthcountry{*},person{*},langs,rank,rank_unique`;
  //       // console.log("Birthcountry API:", apiURL)
  //       return makePersonRequest('get', null, null, apiURL);
  //   });
  //
  // const bcProm = Promise.all([getBCRank, getBCRankPeers])
  //
  // return {
  //   type: "GET_BIRTHCOUNTRY_RANKS",
  //   promise: bcProm
  // };
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
