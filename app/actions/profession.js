/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import axios from 'axios';
import * as types from 'types';

polyfill();

export function makeProfessionRequest(method, id, data, api = '/profession') {
  const requestedURL = api + (id ? ('?slug=eq.' + id) : '');
  console.log(`http://localhost:3100${requestedURL}`)
  return axios.get(`http://localhost:3100${requestedURL}`)
}

export function fetchProfession(store) {
  return {
    type: "GET_PROFESSION",
    promise: makeProfessionRequest('get', store["id"])
  };
}

export function fetchAllProfessions(store) {
  const getProfessionsProm = makeProfessionRequest('get', null, null, `/profession?order=num_born.desc.nullslast`);

  return {
    type: "GET_PROFESSIONS",
    promise: getProfessionsProm
  };
}


export function fetchPeople(store) {
  const getPeopleProm = makeProfessionRequest('get', null, null, `/profession?slug=eq.${store["id"]}&select=id`).then(function(profIdRes) {
    const profId = profIdRes.data[0].id;
    return makeProfessionRequest('get', null, null, `/person?profession=eq.${profId}&order=langs.desc&select=birthplace{*},birthcountry{*},deathcountry{*},profession{*},profession_id:profession,*`);
  })

  return {
    type: "GET_PEOPLE_FOR_PROFESSION",
    promise: getPeopleProm
  };
}

export function fetchPeopleInDomain(store) {
  const getPeopleProm = makeProfessionRequest('get', null, null, `/profession?slug=eq.${store["id"]}&select=domain_slug`).then(function(profIdRes) {
    const domainSlug = profIdRes.data[0].domain_slug;
    return makeProfessionRequest('get', null, null, `/profession?domain_slug=eq.${domainSlug}&select=id`).then(function(domainIdRes) {
      const profIds = domainIdRes.data.reduce((arr, obj) => arr.concat([obj.id]), []);
      return makeProfessionRequest('get', null, null, `/person?profession=in.${profIds}&order=langs.desc&select=profession{*},profession_id:profession,*`);
    })
  })

  return {
    type: "GET_PEOPLE_FOR_DOMAIN",
    promise: getPeopleProm
  };
}


export function fetchProfessionLegacy(store) {
  const prom = makeProfessionRequest('get', store["id"]).then(function(profIdRes) {
    if(!profIdRes.data.length) {
      return makeProfessionRequest('get', null, null, `/profession?industry_slug=eq.${store["id"]}`).then(function(profIdRes) {
        if(!profIdRes.data.length) {
          return makeProfessionRequest('get', null, null, `/profession?domain_slug=eq.${store["id"]}`).then(function(profIdRes) {
            if(!profIdRes.data.length) {
              return makeProfessionRequest('get', null, null, `/profession?group_slug=eq.${store["id"]}`);
            }
            return makeProfessionRequest('get', null, null, `/profession?domain_slug=eq.${store["id"]}`);
          })
        }
        return makeProfessionRequest('get', null, null, `/profession?industry_slug=eq.${store["id"]}`);
      })
    }
    return makeProfessionRequest('get', store["id"]);
  })

  return {
    type: "GET_PROFESSION",
    promise: prom
  };
}
