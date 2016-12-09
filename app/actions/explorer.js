/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import apiClient from 'apiconfig';

polyfill();

function getVizData(dispatch, getState){
}

export function changeYears(years) {
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return dispatch({ type: "CHANGE_EXPLORER_YEARS", data:years });
    // return getVizData(dispatch, getState);
  }
}
