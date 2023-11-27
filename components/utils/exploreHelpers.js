import {
  HPI_RANGE,
  LANGS_RANGE,
  PAGE_SIZE,
} from "../../components/utils/consts";
import {
  dataRequested,
  dataReceived,
  dataRequestFailed,
} from "../../features/exploreSlice";
import dataFormatter from "../../components/utils/dataFormatter";

const getQueryArgs = (exploreState) => {
  const {
    city,
    country,
    gender,
    metricCutoff,
    metricType,
    occupation,
    onlyShowNew,
    page,
    placeType,
    show,
    viz,
    years,
    yearType,
  } = exploreState;
  let queryStr =
    page === "viz"
      ? `?viz=${viz}&show=${show.type}${
          show.depth === show.type ? "" : `|${show.depth}`
        }&years=${years}`
      : `?show=${show.type}${
          show.depth === show.type ? "" : `|${show.depth}`
        }&years=${years}`;
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
  return queryStr;
};

const makeApiUrl = (places, exploreState, pageIndex, sortBy) => {
  const {
    city,
    country,
    gender,
    metricCutoff,
    metricType,
    occupation,
    onlyShowNew,
    page,
    placeType,
    show,
    years,
    yearType,
  } = exploreState;
  const apiHeaders = { Prefer: "count=estimated" };
  let selectFields =
    "name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,hpi_prev,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_country(id,country,slug),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug,industry,domain)";
  let sorting = "&order=hpi.desc.nullslast";

  // Set place...
  let placeFilter = "";
  if (country !== "all") {
    const countryObj = places.find((d) => d.country.country_code === country);
    const countryId = countryObj ? countryObj.country.id : "";
    placeFilter =
      placeType === "birthplace"
        ? `&bplace_country=eq.${countryId}`
        : `&dplace_country=eq.${countryId}`;
    if (city !== "all") {
      placeFilter =
        placeType === "birthplace"
          ? `&bplace_geonameid=eq.${city}`
          : `&dplace_geonameid=eq.${city}`;
    }
  }

  // Set occupation...
  let occupationFilter = "";
  if (occupation !== "all") {
    occupationFilter = `&occupation=in.(${occupation})`;
  }

  // Set gender...
  let genderFilter = "";
  if (`${gender}`.toUpperCase() === "M" || `${gender}`.toUpperCase() === "F") {
    genderFilter = `&gender=eq.${gender.toUpperCase()}`;
  }

  // Set metric (hpi etc.)...
  let metricFilter = "";
  if (metricType) {
    metricFilter = `&${metricType}=gte.${metricCutoff}`;
  }

  let limitOffset = "";
  let table = "person";
  if (page === "rankings") {
    if (show.type === "people") {
      limitOffset = `&limit=50&offset=${PAGE_SIZE * pageIndex}`;
    }
    table = "person_ranks";
    // selectFields = `${selectFields},rank,rank_prev,rank_delta,occupation_rank,occupation_rank_prev,occupation_rank_delta,bplace_country_rank,bplace_country_rank_prev,bplace_country_rank_delta`;
    selectFields = `${selectFields},rank,rank_prev,rank_delta`;
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
        return i
          ? `${sortingColumn}.${sortCol.desc ? "desc" : "asc"}.nullslast`
          : `&order=${sortingColumn}.${
              sortCol.desc ? "desc" : "asc"
            }.nullslast`;
      });
    }
  }

  const onlyShowNewFilter = onlyShowNew ? "&hpi_prev=is.null" : "";

  const apiUrl = `https://api.pantheon.world/${table}?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}${onlyShowNewFilter}${sorting}${limitOffset}`;
  return apiUrl;
};

const fetchDataFromApi = async (places, exploreState, pageOverride, sortBy) => {
  const { dataPageIndex, page, show, placeType } = exploreState;
  const pageIndex =
    typeof pageOverride === "number" && !isNaN(pageOverride)
      ? pageOverride
      : dataPageIndex;
  const apiUrl = makeApiUrl(places, exploreState, pageIndex, sortBy);
  try {
    const response = await fetch(apiUrl, {
      headers: { Prefer: "count=estimated" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    let data = await response.json();
    const range = response.headers.get("content-range")
      ? response.headers.get("content-range").split("/")[0]
      : null;
    let count = response.headers.get("content-range")
      ? parseInt(response.headers.get("content-range").split("/")[1], 10)
      : null;
    data =
      page === "rankings"
        ? dataFormatter(data, show.type, show.depth, placeType)
        : data;
    if (page === "rankings" && show.type !== "people") {
      count = data.length;
      data = data.slice(
        PAGE_SIZE * pageIndex,
        PAGE_SIZE * pageIndex + PAGE_SIZE
      );
    }
    return { data, count };
  } catch (error) {
    throw new Error("Failed to fetch data from the API");
  }
};

export async function fetchDataAndDispatch(
  places,
  exploreState,
  dispatch,
  router,
  pathname,
  pageOverride,
  sortBy
) {
  dispatch(dataRequested());
  try {
    const responseData = await fetchDataFromApi(
      places,
      exploreState,
      pageOverride,
      sortBy
    );
    dispatch(dataReceived(responseData));
    const queryStr = getQueryArgs(exploreState);
    router.push(pathname + queryStr);
  } catch (error) {
    dispatch(dataRequestFailed(error.message));
  }
}
