/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from 'types';

polyfill();

export function makePersonRequest(method, id, data, api = '/country') {
  const requestedURL = api + (id ? ('?id=eq.' + id) : '');
  // console.log(requestedURL)
  return request[method](requestedURL, data);
}

export function fetchPlace(store) {
  const prom = makePersonRequest('get', store["id"]);
  return {
    type: "GET_PLACE",
    promise: prom
  };
}
