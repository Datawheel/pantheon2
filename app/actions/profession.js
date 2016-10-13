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
  const prom = makeProfessionRequest('get', store["id"]);
  return {
    type: "GET_PROFESSION",
    promise: prom
  };
}
