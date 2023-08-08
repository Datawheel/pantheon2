/*eslint no-undefined: "error"*/
"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  dataRequested,
  dataReceived,
  dataRequestFailed,
} from "./exploreSlice";
import VizTitle from "../components/explore/VizTitle";
import Controls from "../components/explore/Controls";
import { FORMATTERS, HPI_RANGE, LANGS_RANGE } from "../components/utils/consts";

const makeApiUrl = (
  pageIndex,
  sortBy,
  places,
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
  yearType
) => {
  const apiHeaders = { Prefer: "count=estimated" };
  const pageSize = 50;
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
      limitOffset = `&limit=50&offset=${pageSize * pageIndex}`;
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

  const apiUrl2 = `https://api.pantheon.world/${table}?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}${onlyShowNewFilter}${sorting}${limitOffset}`;
  console.log("apiUrl:", apiUrl2);
  const apiUrl =
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast&limit=1";
  return apiUrl2;
};

const fetchDataFromApi = async (
  places,
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
  yearType
) => {
  const pageIndex = 0;
  const sortBy = null;
  const apiUrl = makeApiUrl(
    pageIndex,
    sortBy,
    places,
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
    yearType
  );
  console.log("apiUrl!!!!", apiUrl);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch data from the API");
  }
};

function Explore({ places, nestedOccupations }) {
  const count = useSelector((state) => state.explore.value);
  const {
    data,
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
  } = useSelector((state) => state.explore);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch data from the API when the component mounts
    dispatch(dataRequested());
    fetchDataFromApi(
      places,
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
      yearType
    )
      .then((responseData) => {
        dispatch(dataReceived(responseData));
      })
      .catch((error) => {
        dispatch(dataRequestFailed(error.message));
      });
  }, []);

  console.log("data!!!", data);

  const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
  let metricSentence;

  if (metricCutoff > metricRange[0]) {
    metricSentence = onlyShowNew
      ? "Only showing newly added biographies (as of 2022)"
      : "Only showing biographies";
    if (metricType === "hpi") {
      metricSentence = `${metricSentence} with a Historical Popularity Index (HPI) greater than ${metricCutoff}.`;
    } else {
      metricSentence = `${metricSentence} with more than ${metricCutoff} Wikipedia language editions.`;
    }
  } else if (onlyShowNew) {
    metricSentence = "Only showing newly added biographies (as of 2022)";
  }

  return (
    <div style={{ marginTop: "144px" }}>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
      </div>
      <div className="explore-head">
        <VizTitle places={places} nestedOccupations={nestedOccupations} />
        {years.length ? (
          <h3 className="explore-date">
            {FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}
          </h3>
        ) : null}
        {metricSentence ? <p>{metricSentence}</p> : null}
      </div>
      <div className="explore-body">
        <Controls
          // countryLookup={this.countryLookup}
          // updateData={this.updateData}
          // update={this.update}
          nestedOccupations={nestedOccupations}
          // pageType={pageType}
          places={places}
          // pathname={pathname}
          // qParams={qParams}
        />
      </div>
    </div>
  );
}

export default Explore;
