export const NUM_RANKINGS = 12;
export const NUM_RANKINGS_PRE = Math.floor(NUM_RANKINGS/2);
export const NUM_RANKINGS_POST = Math.floor(NUM_RANKINGS/2);
export const YEAR_BUCKETS = 50;

export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';

export const CREATE_TOPIC_REQUEST = 'CREATE_TOPIC_REQUEST';
export const CREATE_TOPIC_FAILURE = 'CREATE_TOPIC_FAILURE';
export const CREATE_TOPIC_SUCCESS = 'CREATE_TOPIC_SUCCESS';
export const CREATE_TOPIC_DUPLICATE = 'CREATE_TOPIC_DUPLICATE';
export const GET_TOPICS = 'GET_TOPICS';
export const GET_TOPICS_REQUEST = 'GET_TOPICS_REQUEST';
export const GET_TOPICS_SUCCESS = 'GET_TOPICS_SUCCESS';
export const GET_TOPICS_FAILURE = 'GET_TOPICS_FAILURE';

export const GET_PERSON = 'GET_PERSON';
export const GET_PERSON_REQUEST = 'GET_PERSON_REQUEST';
export const GET_PERSON_SUCCESS = 'GET_PERSON_SUCCESS';
export const GET_PERSON_FAILURE = 'GET_PERSON_FAILURE';

export const INCREMENT_COUNT = 'INCREMENT_COUNT';
export const DECREMENT_COUNT = 'DECREMENT_COUNT';
export const DESTROY_TOPIC = 'DESTROY_TOPIC';
export const TYPING = 'TYPING';

export const TOGGLE_LOGIN_MODE = 'TOGGLE_LOGIN_MODE';
export const MANUAL_LOGIN_USER = 'MANUAL_LOGIN_USER';
export const LOGIN_SUCCESS_USER = 'LOGIN_SUCCESS_USER';
export const LOGIN_ERROR_USER = 'LOGIN_ERROR_USER';
export const SIGNUP_USER = 'SIGNUP_USER';
export const SIGNUP_SUCCESS_USER = 'SIGNUP_SUCCESS_USER';
export const SIGNUP_ERROR_USER = 'SIGNUP_ERROR_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const LOGOUT_SUCCESS_USER = 'LOGOUT_SUCCESS_USER';
export const LOGOUT_ERROR_USER = 'LOGOUT_ERROR_USER';

export const COLORS_DOMAIN = {
  sports: "#BB3B57",
  science_and_technology: "#0E5E5B",
  public_figure: "#67AF8C",
  institutions: "#B12D11",
  humanities: "#732945",
  exploration: "#4C5ED7",
  business_and_law: "#4F680A",
  arts: "#D28629"
};

export const COLORS_CONTINENT = {
  Africa: "#BB3B57",
  Americas: "#67AF8C",
  Asia: "#D28629",
  Europe: "#5F0116",
  Oceania: "#4C5ED7"
}

import {format} from "d3-format";
import {timeFormat} from "d3-time-format";

export const FORMATTERS = {
  commas: format(","),
  share: format(".2%"),
  date: timeFormat("%B %d, %Y"),
  year: (y) => y < 0 ? `${Math.abs(y)} BC` : y,
  ordinal: (n) => {
    if(n>3 && n<21) return `${n}th`; // thanks kennebec
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }
}
