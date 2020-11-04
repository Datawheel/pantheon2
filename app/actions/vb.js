import api from "apiConfig";
import dataFormatter from "pages/explore/helpers/dataFormatter";

const DEFAULT_PAGE_SIZE = 50;
import {HPI_RANGE, LANGS_RANGE} from "types";

export const initRankingsAndViz = initialState => dispatch  => {
  console.log("initialState", initialState);
  if (initialState.page === "viz") {
    dispatch({type: "VB_INIT_VIZ"});
  }
  if (initialState.page === "rankings") {
    console.log("VB_INIT_RANKINGS");
    dispatch({type: "VB_INIT_RANKINGS"});
  }
  dispatch({type: "VB_UPDATE_COUNTRY", country: initialState.country});
  dispatch({type: "VB_UPDATE_CITY", city: initialState.city});
  dispatch({type: "VB_UPDATE_GENDER", gender: initialState.gender});
  dispatch({type: "VB_UPDATE_METRIC_TYPE", metricType: initialState.metricType});
  dispatch({type: "VB_UPDATE_METRIC_CUTOFF", metricCutoff: initialState.metricCutoff});
  dispatch({type: "VB_UPDATE_PAGE", page: initialState.page});
  dispatch({type: "VB_UPDATE_ONLY_SHOW_NEW", onlyShowNew: initialState.onlyShowNew});
  dispatch({type: "VB_UPDATE_OCCUPATION", occupation: initialState.occupation});
  dispatch({type: "VB_UPDATE_YEARS", years: initialState.years});
  if (initialState.show) {
    dispatch({type: "VB_UPDATE_SHOW_TYPE", showType: initialState.show});
    dispatch({type: "VB_UPDATE_SHOW_DEPTH", showDepth: initialState.show});
  }
  if (initialState.viz) {
    dispatch({type: "VB_UPDATE_VIZ", viz: initialState.viz});
  }
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE, false, []));
};
// {type: "people", depth: "people"}

export const unmountRankingsAndViz = () => dispatch  => {
  dispatch({type: "VB_CLEAR_DATA"});
};

export const updateCity = newCity => dispatch => {
  dispatch({type: "VB_UPDATE_CITY", city: newCity});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateCountry = newCountry => dispatch => {
  dispatch({type: "VB_UPDATE_COUNTRY", country: newCountry});
  dispatch({type: "VB_UPDATE_CITY", city: "all"});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE, true));
};

export const updateGender = newGender => dispatch => {
  dispatch({type: "VB_UPDATE_GENDER", gender: newGender});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateMetricType = newMetricType => dispatch => {
  const metricRange = newMetricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
  dispatch({type: "VB_UPDATE_METRIC_TYPE", metricType: newMetricType});
  dispatch({type: "VB_UPDATE_METRIC_CUTOFF", metricCutoff: metricRange[0]});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};
export const updateMetricCutoff = newMetricCutoff => dispatch => {
  dispatch({type: "VB_UPDATE_METRIC_CUTOFF", metricCutoff: newMetricCutoff});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateOccupation = newOccupation => dispatch => {
  dispatch({type: "VB_UPDATE_OCCUPATION", occupation: newOccupation});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateOnlyShowNew = newOnlyShowNew => dispatch => {
  dispatch({type: "VB_UPDATE_ONLY_SHOW_NEW", onlyShowNew: newOnlyShowNew});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updatePlaceType = newPlaceType => dispatch => {
  dispatch({type: "VB_UPDATE_PLACE_TYPE", placeType: newPlaceType});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateShowDepth = newShowDepth => dispatch => {
  dispatch({type: "VB_UPDATE_SHOW_DEPTH", showDepth: newShowDepth});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateShowType = (newShowType, page) => dispatch => {
  dispatch({type: "VB_UPDATE_SHOW_TYPE", showType: newShowType});
  dispatch({type: "VB_UPDATE_SHOW_DEPTH", showDepth: newShowType});
  if (page === "rankings") {
    dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
  }
};

export const updateViz = newViz => dispatch => {
  dispatch({type: "VB_UPDATE_VIZ", viz: newViz});
};

export const updateYears = newYears => dispatch => {
  dispatch({type: "VB_UPDATE_YEARS", years: newYears});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const updateYearType = newYearType => dispatch => {
  dispatch({type: "VB_UPDATE_YEAR_TYPE", yearType: newYearType});
  dispatch(fetchData(0, DEFAULT_PAGE_SIZE));
};

export const FETCH_VB_DATA = "FETCH_VB_DATA";

/** */
function requestVbData(pageIndex, pageSize) {
  return {
    loading: true,
    pageIndex,
    pageSize,
    type: FETCH_VB_DATA
  };
}

export const FETCH_VB_DATA_SUCCESS = "FETCH_VB_DATA_SUCCESS";

/** */
function receiveVbData(pageIndex, pageSize, range, count, data, newData) {
  return {
    count,
    data,
    loading: true,
    new: newData,
    pageIndex,
    pageSize,
    range,
    receivedAt: Date.now(),
    type: FETCH_VB_DATA_SUCCESS
  };
}

export const resetNewData = () => dispatch => {
  console.log("\n\n\nRESSETTTTT\n\n\n");
  dispatch({type: "VB_RESET_NEW_DATA"});
};

const setQueryArgs = state => {
  const {city, country, gender, metricType, metricCutoff, occupation, onlyShowNew, page, placeType, show, viz, years, yearType} = state.vb;
  // const pageType = state.location.pathname.includes("rankings") ? "rankings" : "viz";

  let queryStr = page === "viz" ? `?viz=${viz}&show=${show.type}&years=${years}` : `?show=${show.type}&years=${years}`;
  if (country !== "all") {
    queryStr += `&place=${country.toLowerCase()}`;
    if (city !== "all") {
      queryStr += `|${city}`;
    }
  }
  if (occupation !== "all") {
    queryStr += `&occupation=${occupation}`;
  }
  if (yearType !== "birthyear") {
    queryStr += `&yearType=${yearType}`;
  }
  if (placeType !== "birthplace") {
    queryStr += `&placeType=${placeType}`;
  }
  if (`${gender}`.toUpperCase() === "M" || `${gender}`.toUpperCase() === "F") {
    queryStr += `&gender=${gender.toUpperCase()}`;
  }
  if (!(metricType === "hpi" && !metricCutoff)) {
    const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    if (metricCutoff > metricRange[0]) {
      queryStr += `&${metricType}=${metricCutoff}`;
    }
  }
  if (onlyShowNew) {
    queryStr += "&new=true";
  }
  if (typeof history !== "undefined" && history.pushState) {
    const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryStr}`;
    if (window) {
      window.history.pushState({path: newurl}, "", newurl);
    }
  }
};

/** */
export function fetchData(pageIndex, pageSize, newData, sortBy) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  console.log("[action] FETCH DATA pageIndex, pageSize, newData, sortBy!!!", pageIndex, pageSize, newData, sortBy);

  return function(dispatch, getState) {
    // First dispatch: the app state is updated to inform
    // that the API call is starting.
    dispatch(requestVbData(pageIndex, pageSize));
    const {data, vb} = getState();
    const {city, country, gender, metricCutoff, metricType, occupation, onlyShowNew, page, placeType, show, years, yearType} = vb;
    const apiHeaders = {Prefer: "count=estimated"};
    const pageSize = 50;
    let selectFields = "name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,hpi_prev,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_country(id,country,slug),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug)";
    let sorting = "&order=hpi.desc.nullslast";

    let placeFilter = "";
    if (country !== "all") {
      const countryObj = data.places.find(d => d.country.country_code === country);
      const countryId = countryObj ? countryObj.country.id : "";
      placeFilter = placeType === "birthplace" ? `&bplace_country=eq.${countryId}` : `&dplace_country=eq.${countryId}`;
      if (city !== "all") {
        placeFilter = placeType === "birthplace" ? `&bplace_geonameid=eq.${city}` : `&dplace_geonameid=eq.${city}`;
      }
    }

    let occupationFilter = "";
    if (occupation !== "all") {
      occupationFilter = `&occupation=in.(${occupation})`;
    }

    let genderFilter = "";
    if (`${gender}`.toUpperCase() === "M" || `${gender}`.toUpperCase() === "F") {
      genderFilter = `&gender=eq.${gender.toUpperCase()}`;
    }

    let metricFilter = "";
    if (metricType) {
      metricFilter = `&${metricType}=gte.${metricCutoff}`;
    }

    let limitOffset = "";
    let table = "person";
    if (page === "rankings") {
      if (show.type === "people") {
        limitOffset = `&limit=50&offset=${pageSize * pageIndex}`;
      }
      table = "person_ranks";
      selectFields = `${selectFields},occupation_rank,occupation_rank_prev,occupation_rank_delta,bplace_country_rank,bplace_country_rank_prev,bplace_country_rank_delta`;
      if (sortBy && sortBy.length) {
        sorting = sortBy.map((sortCol, i) => {
          let sortingColumn = sortCol.id;
          if (sortingColumn === "occupation_id") {
            sortingColumn = "occupation";
          }
          if (sortingColumn === "bplace_geonameid") {
            sortingColumn = "bplace_name";
          }
          if (sortingColumn === "dplace_geonameid") {
            sortingColumn = "dplace_name";
          }
          return i ? `${sortingColumn}.${sortCol.desc ? "desc" : "asc"}.nullslast` : `&order=${sortingColumn}.${sortCol.desc ? "desc" : "asc"}.nullslast`;
        });
      }
    }

    const onlyShowNewFilter = onlyShowNew ? "&hpi_prev=is.null" : "";

    const dataUrl = `/${table}?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}${onlyShowNewFilter}${sorting}${limitOffset}`;
    console.log("[fetchData]: ", dataUrl);
    return api.get(dataUrl, {headers: apiHeaders})
      .then(
        response => {
          const range = response.headers["content-range"] ? response.headers["content-range"].split("/")[0] : null;
          const count = response.headers["content-range"] ? parseInt(response.headers["content-range"].split("/")[1], 10) : null;
          const respData = page === "rankings" ? dataFormatter(response.data, show.type, placeType) : response.data;
          dispatch(receiveVbData(pageIndex, pageSize, range, count, respData, newData));
          setQueryArgs(getState());
        }
        // Do not use catch, because errors occured during rendering
        // should be handled by React Error Boundaries
        // https://reactjs.org/docs/error-boundaries.html
      );
    // .then(json =>
    //   // We can dispatch many times!
    //   // Here, we update the app state with the results of the API call.
    //
    // );
  };
}
