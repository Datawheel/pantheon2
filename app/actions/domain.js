/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from 'types';

polyfill();

export function makeDomainRequest(method, id, data, api = '/occupation') {
  const requestedURL = api + (id ? ('?slug=eq.' + id) : '');
  return request[method](requestedURL, data);
}

export function fetchDomain(store) {
  const prom = makeDomainRequest('get', store["id"]);
  return {
    type: "GET_DOMAIN",
    promise: prom
  };
}
