import {HPI_RANGE, LANGS_RANGE, PAGE_SIZE} from "../../components/utils/consts";
import {
  dataRequested,
  dataReceived,
  dataRequestFailed,
} from "../../features/exploreSlice";
import dataFormatter from "../../components/utils/dataFormatter";
import {encodePostgrestList, encodePostgrestValue} from "@/app/utils/postgrest";
import {DEFAULT_LOCALE} from "@/app/locales";

export const getQueryArgs = exploreState => {
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
    birthMonth,
    birthDay,
    tsScale,
    tsBins,
    stackedPercent,
  } = exploreState;
  let queryStr =
    page === "viz"
      ? `?viz=${viz}&show=${show.type}${
          show.depth === show.type ? "" : `|${show.depth}`
        }&years=${years}`
      : `?show=${show.type}${
          show.depth === show.type ? "" : `|${show.depth}`
        }&years=${years}`;
  if (page === "viz") {
    if (stackedPercent) {
      queryStr += "&pct=true";
    }
    if (tsScale) {
      queryStr += `&scale=${tsScale}`;
    }
    if (tsBins) {
      queryStr += `&bins=${tsBins}`;
    }
  }
  if (country !== "all") {
    queryStr += `&place=${country.toLowerCase()}`;
    if (city !== "all") {
      queryStr += `|${city}`;
    }
  }
  if (occupation !== "all") {
    queryStr += `&occupation=${encodeURIComponent(occupation)}`;
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
  if (birthMonth !== null) {
    queryStr += `&birthMonth=${birthMonth}`;
  }
  if (birthDay !== null) {
    queryStr += `&birthDay=${birthDay}`;
  }
  return queryStr;
};

const makeApiUrl = (
  baseApi,
  places,
  exploreState,
  pageIndex,
  sortBy,
  locale = DEFAULT_LOCALE,
) => {
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
    birthMonth,
    birthDay,
    nameSearch,
  } = exploreState;
  // const apiHeaders = {Prefer: "count=estimated"};
  let selectFields =
    `name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,hpi_prev,id,slug,gender,birthyear,birthmonth,birthday,deathyear,bplace_country(id,country,localized_country:translations->${locale}->>country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_country(id,country,localized_country:translations->${locale}->>country,slug),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,localized_occupation:translations->${locale}->>occupation,occupation_slug,industry,localized_industry:translations->${locale}->>industry,domain,localized_domain:translations->${locale}->>domain,domain_slug)`;
  let sorting = "&order=hpi.desc.nullslast";

  // Set place...
  let placeFilter = "";
  if (country !== "all") {
    const countryObj = places.find(d => d.country.country_code === country);
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
    occupationFilter = `&occupation=in.(${encodePostgrestList(occupation.split(","))})`;
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

  // Set birthday filter...
  let birthdayFilter = "";
  if (birthMonth !== null) {
    birthdayFilter += `&birthmonth=eq.${birthMonth}`;
  }
  if (birthDay !== null) {
    birthdayFilter += `&birthday=eq.${birthDay}`;
  }

  let limitOffset = "";
  let table = "person_ranks";
  if (page === "rankings") {
    if (show.type === "people") {
      limitOffset = `&limit=50&offset=${PAGE_SIZE * pageIndex}`;
    }
    table = "person_ranks";
    // selectFields = `${selectFields},rank,rank_prev,rank_delta,occupation_rank,occupation_rank_prev,occupation_rank_delta,bplace_country_rank,bplace_country_rank_prev,bplace_country_rank_delta`;
    selectFields = `${selectFields},rank,rank_prev,rank_delta,occupation_rank,occupation_rank_prev,occupation_rank_delta,bplace_country_rank,bplace_country_rank_prev,bplace_country_rank_delta,dplace_country_rank,dplace_country_rank_prev,dplace_country_rank_delta,birthyear_rank,birthyear_rank_prev,birthyear_rank_delta,deathyear_rank,deathyear_rank_prev,deathyear_rank_delta`;
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

  let nameFilter = "";
  if (nameSearch && nameSearch.trim().length >= 2) {
    nameFilter = `&name=ilike.*${encodePostgrestValue(nameSearch.trim())}*`;
  }

  const apiUrl = `${baseApi}/${table}?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}${birthdayFilter}${onlyShowNewFilter}${nameFilter}${sorting}${limitOffset}`;
  return apiUrl;
};

const fetchDataFromApi = async (
  baseApi,
  places,
  exploreState,
  pageOverride,
  sortBy,
  locale = DEFAULT_LOCALE,
) => {
  const {
    dataPageIndex,
    page,
    show,
    placeType,
    occupation,
    country,
    yearType,
    years,
  } = exploreState;
  const pageIndex =
    typeof pageOverride === "number" && !isNaN(pageOverride)
      ? pageOverride
      : dataPageIndex;
  const apiUrl = makeApiUrl(
    baseApi,
    places,
    exploreState,
    pageIndex,
    sortBy,
    locale,
  );
  try {
    const response = await fetch(apiUrl, {
      headers: {Prefer: "count=estimated"},
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    let data = await response.json();
    data = data.map(row => localizeExploreRow(row, locale));
    // const range = response.headers.get("content-range")
    //   ? response.headers.get("content-range").split("/")[0]
    //   : null;
    let count = response.headers.get("content-range")
      ? parseInt(response.headers.get("content-range").split("/")[1], 10)
      : null;
    data =
      page === "rankings"
        ? dataFormatter(
            data,
            show.type,
            show.depth,
            placeType,
            occupation,
            country,
            yearType,
            years
          )
        : data;
    if (page === "rankings" && show.type !== "people") {
      count = data.length;
      data = data.slice(
        PAGE_SIZE * pageIndex,
        PAGE_SIZE * pageIndex + PAGE_SIZE
      );
    }
    if (page === "rankings" && locale !== DEFAULT_LOCALE) {
      data = await localizeRankingPersonNames(baseApi, data, locale);
    }
    return {data, count};
  } catch (error) {
    throw new Error("Failed to fetch data from the API");
  }
};

function localizedValue(record, locale, key) {
  return record?.translations?.[locale]?.[key]
    || record?.translations?.[DEFAULT_LOCALE]?.[key]
    || record?.[key];
}

function localizeExploreRow(row, locale) {
  const occupation = row.occupation
    ? {
        ...row.occupation,
        occupation: row.occupation.localized_occupation
          || localizedValue(row.occupation, locale, "occupation"),
        industry: row.occupation.localized_industry
          || localizedValue(row.occupation, locale, "industry"),
        domain: row.occupation.localized_domain
          || localizedValue(row.occupation, locale, "domain"),
      }
    : row.occupation;
  const localizeCountry = country => country
    ? {
        ...country,
        country: country.localized_country
          || localizedValue(country, locale, "country"),
      }
    : country;
  return {
    ...row,
    occupation,
    ["bplace_country"]: localizeCountry(row.bplace_country),
    ["dplace_country"]: localizeCountry(row.dplace_country),
  };
}

async function localizeRankingPersonNames(baseApi, data, locale) {
  const ids = new Set();
  data.forEach(row => {
    if (row?.id !== null && row?.id !== undefined) ids.add(row.id);
    row?.top_ranked?.forEach(person => {
      if (person?.id !== null && person?.id !== undefined) ids.add(person.id);
    });
  });
  if (!ids.size) return data;

  try {
    const url = `${baseApi}/person?id=in.(${encodePostgrestList([...ids])})&select=id,localized_name:translations->>${locale}`;
    const response = await fetch(url);
    if (!response.ok) return data;
    const localizedPeople = await response.json();
    const names = new Map(
      localizedPeople
        .filter(person => person.localized_name)
        .map(person => [`${person.id}`, person.localized_name]),
    );
    return data.map(row => ({
      ...row,
      name: names.get(`${row.id}`) || row.name,
      ["top_ranked"]: row.top_ranked?.map(person => ({
        ...person,
        name: names.get(`${person.id}`) || person.name,
      })),
    }));
  } catch {
    return data;
  }
}

export async function fetchDataAndDispatch(
  baseApi,
  places,
  exploreState,
  dispatch,
  _router,
  pathname,
  pageOverride,
  sortBy,
  shouldUpdateRoute = true,
  locale = DEFAULT_LOCALE,
) {
  dispatch(dataRequested());
  try {
    const responseData = await fetchDataFromApi(
      baseApi,
      places,
      exploreState,
      pageOverride,
      sortBy,
      locale,
    );
    dispatch(dataReceived(responseData));
    if (shouldUpdateRoute) {
      const queryStr = getQueryArgs(exploreState);
      const nextUrl = `${pathname}${queryStr}`;
      if (
        typeof window !== "undefined" &&
        `${window.location.pathname}${window.location.search}` !== nextUrl
      ) {
        window.history.replaceState(window.history.state, "", nextUrl);
      }
    }
  } catch (error) {
    dispatch(dataRequestFailed(error.message));
  }
}
