/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import axios from 'axios';
import { GET_PERSON, NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST } from 'types'

polyfill();

export function makePersonRequest(method, id, data, api = '/person') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  // return request[method](requestedURL, data);
  console.log(`http://localhost:3100${requestedURL}`)
  return axios.get(`http://localhost:3100${requestedURL}`)
}

export function fetchPerson(store) {
  const prom = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=profession{*},birthcountry{*},birthplace{*},birthyear{*},deathcountry{*},deathplace{*},deathyear{*},*`);
  return {
    type: "GET_PERSON",
    promise: prom
  };
}

export function fetchProfessionRanks(store) {
  const getOccRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id,profession{*},profession_rank,profession_rank_unique,langs`)
  const getOccRankPeers = getOccRank.then(function(occRankRes) {
        const occRank = occRankRes.data[0];
        const occId = occRank.profession.id;
        let rankSub = Math.max(1, parseInt(occRank.profession_rank_unique) - NUM_RANKINGS_PRE);
        let rankPlus = Math.max(NUM_RANKINGS, parseInt(occRank.profession_rank_unique) + NUM_RANKINGS_POST);
        if(rankPlus > occRank.profession.num_born){
          rankSub = Math.max(1, (occRank.profession.num_born - NUM_RANKINGS));
          rankPlus = occRank.profession.num_born;
        }
        const apiURL = `/person?profession=eq.${occId}&profession_rank_unique=gte.${rankSub}&profession_rank_unique=lte.${rankPlus}&order=profession_rank_unique&select=profession{*},birthcountry{*},langs,profession_rank,profession_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        // console.log("OccRank API:", apiURL)
        return makePersonRequest('get', null, null, apiURL);
    });

  const prom = Promise.all([getOccRank, getOccRankPeers])

  return {
    type: "GET_PROFESSION_RANKS",
    promise: prom
  };
}

export function fetchCountryRanks(store) {
  const getCountryRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id,birthcountry{*},deathcountry{*},birthcountry_rank,birthcountry_rank_unique,deathcountry_rank,deathcountry_rank_unique,langs`)

  const getBCRankPeers = getCountryRank.then(function(bcRankRes) {
        const bcRank = bcRankRes.data[0];
        const bcId = bcRank.birthcountry.id;
        const rankSub = Math.max(1, parseInt(bcRank.birthcountry_rank_unique) - NUM_RANKINGS_PRE);
        const rankPlus = Math.max(NUM_RANKINGS, parseInt(bcRank.birthcountry_rank_unique) + NUM_RANKINGS_POST);
        const apiURL = `/person?birthcountry=eq.${bcId}&birthcountry_rank_unique=gte.${rankSub}&birthcountry_rank_unique=lte.${rankPlus}&order=birthcountry_rank_unique&select=birthcountry{*},langs,birthcountry_rank,birthcountry_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        return makePersonRequest('get', null, null, apiURL);
    });

  const getDCRankPeers = getCountryRank.then(function(bcRankRes) {
        const dcRank = bcRankRes.data[0];
        let apiURL;
        if(dcRank.deathcountry){
          const dcId = dcRank.deathcountry.id;
          const rankSub = Math.max(1, parseInt(dcRank.deathcountry_rank_unique) - NUM_RANKINGS_PRE);
          const rankPlus = Math.max(NUM_RANKINGS, parseInt(dcRank.deathcountry_rank_unique) + NUM_RANKINGS_POST);
          apiURL = `/person?deathcountry=eq.${dcId}&deathcountry_rank_unique=gte.${rankSub}&deathcountry_rank_unique=lte.${rankPlus}&order=deathcountry_rank_unique&select=deathcountry{*},langs,deathcountry_rank,deathcountry_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        }
        else {
          apiURL = `/person?deathcountry=eq.0`;
        }
        return makePersonRequest('get', null, null, apiURL);
    }).catch((e) => { console.log(e) });


  const bcProm = Promise.all([getCountryRank, getBCRankPeers, getDCRankPeers])

  return {
    type: "GET_BIRTHCOUNTRY_RANKS",
    promise: bcProm
  };
}

export function fetchYearRanks(store) {
  const getYearRank = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id,birthyear{*},deathyear{*},birthyear_rank,birthyear_rank_unique,deathyear_rank,deathyear_rank_unique,langs`);

  const getBYRankPeers = getYearRank.then(function(byRankRes) {
        const byRank = byRankRes.data[0];
        const byId = byRank.birthyear.id;
        const rankSub = Math.max(1, parseInt(byRank.birthyear_rank_unique) - NUM_RANKINGS_PRE);
        const rankPlus = Math.max(NUM_RANKINGS, parseInt(byRank.birthyear_rank_unique) + NUM_RANKINGS_POST);
        const apiURL = `/person?birthyear=eq.${byId}&birthyear_rank_unique=gte.${rankSub}&birthyear_rank_unique=lte.${rankPlus}&order=birthyear_rank_unique&select=birthcountry{*},langs,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        return makePersonRequest('get', null, null, apiURL);
    });

  const getDYRankPeers = getYearRank.then(function(dyRankRes) {
        const dyRank = dyRankRes.data[0];
        let apiURL;
        if(dyRank.deathyear){
          const dyId = dyRank.deathyear.id;
          const rankSub = Math.max(1, parseInt(dyRank.deathyear_rank_unique) - NUM_RANKINGS_PRE);
          const rankPlus = Math.max(NUM_RANKINGS, parseInt(dyRank.deathyear_rank_unique) + NUM_RANKINGS_POST);
          apiURL = `/person?deathyear=eq.${dyId}&deathyear_rank_unique=gte.${rankSub}&deathyear_rank_unique=lte.${rankPlus}&order=deathyear_rank_unique&select=deathcountry{*},langs,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,wiki_id,birthyear,deathyear`;
        }
        else {
          apiURL = `/person?deathyear=eq.0`;
        }
        return makePersonRequest('get', null, null, apiURL);
    }).catch((e) => { console.log(e) });

  const byProm = Promise.all([getYearRank, getBYRankPeers, getDYRankPeers])

  return {
    type: "GET_YEAR_RANKS",
    promise: byProm
  };
}

export function fetchPageviews(store) {
  const getPageviewsProm = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
    const personId = personIdRes.data[0].id;
    return makePersonRequest('get', null, null, `/pageview?person=eq.${personId}`);
  })

  return {
    type: "GET_PAGEVIEWS",
    promise: getPageviewsProm
  };
}

export function fetchCreationdates(store) {
  const getCreationdatesProm = makePersonRequest('get', null, null, `/person?slug=eq.${store["id"]}&select=id`).then(function(personIdRes) {
    const personId = personIdRes.data[0].id;
    return makePersonRequest('get', null, null, `/creation?person=eq.${personId}`);
  })

  return {
    type: "GET_CREATIONDATES",
    promise: getCreationdatesProm
  };
}
