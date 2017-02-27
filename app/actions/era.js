/* eslint consistent-return: 0, no-else-return: 0*/
import {polyfill} from "es6-promise";
import axios from "axios";

polyfill();

export function makeEraRequest(method, id, data, api = "/era") {
  const requestedURL = api + (id ? ("?slug=eq." + id) : "");
  console.log(`http://localhost:3100${requestedURL}`);
  return axios.get(`http://localhost:3100${requestedURL}`);
}

export function fetchEra(store) {
  return {
    type: "GET_ERA",
    promise: makeEraRequest("get", store.id)
  };
}
