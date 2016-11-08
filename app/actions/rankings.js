/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import axios from 'axios';
import { RANKINGS_RESULTS_PER_PAGE } from 'types';

polyfill();

function getNewData(dispatch, getState){
  const { rankings } = getState();
  const { years, country, place, domain, profession, results } = rankings;
  const offset = results.page * RANKINGS_RESULTS_PER_PAGE;
  const countryFilter = country.id !== "all" ? `&birthcountry=eq.${country.id}` : '';
  const placeFilter = place !== "all" ? `&birthplace=eq.${place}` : '';
  const professionFilter = profession !== "all" ? `&profession=eq.${profession}` : domain.professions.length ? `&profession=in.${domain.professions.reduce((a, b)=> a.concat(b.id), [])}` : '';
  return axios.get(`http://localhost:3100/person?select=*,birthplace{*},profession{*}&limit=${RANKINGS_RESULTS_PER_PAGE}&offset=${offset}&birthyear=gte.${years.min}&birthyear=lte.${years.max}&order=langs.desc.nullslast${countryFilter}${placeFilter}${professionFilter}`)
    .then(res => {
      return dispatch({
        res: res,
        type: "FETCH_RANKINGS_SUCCESS"
      });
    })
    .catch(() => {
      return dispatch(fetchRankingsFailure({ id:999, error: 'Oops! Something went wrong and we couldn\'t fetch rankings'}));
    });
}

export function fetchRankingsFailure(data) {
  return {
    type: "FETCH_RANKINGS_FAILURE",
    id: data.id,
    error: data.error
  };
}

export function changeType(e) {
  const newType = e.target.value;
  return dispatch => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return dispatch({
      type: "CHANGE_RANKING_TYPE",
      data: newType
    })
  }
}

export function changeYears(years) {
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_YEARS", data: years });
    return getNewData(dispatch, getState);
  }
}

export function changeCountry(e) {
  const countryId = e.target.value;
  const countryCode = e.target.options[e.target.selectedIndex].dataset.countrycode;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return axios.get(`http://localhost:3100/place?is_country=is.false&country_code=eq.${countryCode}&order=name&select=id,name`)
      .then(res => {
        dispatch({
          type: "CHANGE_RANKING_COUNTRY",
          data: countryId,
          res: res
        });
        dispatch({ type: "CHANGE_RANKING_PLACE", data: 'all' });
        return getNewData(dispatch, getState);
      })
  }
}

export function changePlace(e) {
  const placeId = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_PLACE", data: placeId });
    return getNewData(dispatch, getState);
  }
}

export function changeDomain(e) {
  const domainSlug = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    return axios.get(`http://localhost:3100/profession?domain_slug=eq.${domainSlug}&order=name&select=id,name`)
      .then(res => {
        dispatch({
          type: "CHANGE_RANKING_DOMAIN",
          data: domainSlug,
          res: res
        });
        dispatch({ type: "CHANGE_RANKING_PROFESSION", data: 'all' });
        return getNewData(dispatch, getState);
      })
  }
}

export function changeProfession(e) {
  const professionId = e.target.value;
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data:0 });
    dispatch({ type: "CHANGE_RANKING_PROFESSION", data: professionId });
    return getNewData(dispatch, getState);
  }
}

export function updateRankingsTable(instance) {
  const {page, pageSize, pages, sorting} = instance;
  // console.log(page, pageSize, pages, sorting)
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_RANKING_PAGE", data: page });
    return getNewData(dispatch, getState);
  }
}

// export function fetchRankings(text) {
//   return (dispatch, getState) => {
//     // console.log(text, dispatch)
//     const { rankings } = getState();
//     console.log('rankings', rankings)
//     return axios.get(`http://localhost:3100/person?limit=10`)
//       .then(res => {
//         return dispatch({
//           res: res,
//           type: "FETCH_RANKINGS_SUCCESS"
//         });
//       })
//       .catch(() => {
//         return dispatch(fetchRankingsFailure({ id:999, error: 'Oops! Something went wrong and we couldn\'t fetch rankings'}));
//       });
//   }
// }
