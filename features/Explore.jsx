/*eslint no-undefined: "error"*/
"use client";
import { useEffect } from "react";
import { nest } from "d3-collection";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import VizTitle from "../components/explore/VizTitle";
import Controls from "../components/explore/Controls";
import Spinner from "../components/Spinner";
import RankingTable from "../components/explore/rankings/RankingTable";
import {
  FORMATTERS,
  HPI_RANGE,
  LANGS_RANGE,
  COUNTRY_LIST,
} from "../components/utils/consts";
import { fetchDataAndDispatch } from "../components/utils/exploreHelpers";
import { SANITIZERS } from "../components/utils/sanitizers";
import {
  setFirstLoad,
  updateCountry,
  updateCity,
  updateGender,
  updateYears,
  updateShowDepth,
} from "./exploreSlice";
import "./Explore.css";
import VizShell from "../components/explore/viz/VizShell";

function Explore({ places, occupations, pageType }) {
  const {
    firstLoad,
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
  const exploreState = useSelector((state) => state.explore);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const nestedOccupations = nest()
    .key((d) => d.domain_slug)
    .entries(occupations)
    .map((occData) => ({
      domain: {
        id: `${occData.values.map((o) => o.id)}`,
        slug: occData.values[0].domain_slug,
        name: occData.values[0].domain,
      },
      occupations: occData.values,
    }));

  useEffect(() => {
    const queryParamShow = searchParams.get("show")
      ? SANITIZERS.show(searchParams.get("show"), "rankings")
      : pageType === "rankings"
      ? { type: "people", depth: "people" }
      : { type: "occupations", depth: "occupations" };
    const queryParamCountry =
      SANITIZERS.country(searchParams.get("place")) ||
      COUNTRY_LIST[Math.floor(Math.random() * COUNTRY_LIST.length)];
    const queryParamCity = SANITIZERS.city(searchParams.get("place")) || "all";
    const queryParamGender = SANITIZERS.gender(searchParams.get("gender"));
    const queryParamYears = SANITIZERS.years(searchParams.get("years"));
    dispatch(
      updateShowDepth({
        showType: queryParamShow.type,
        showDepth: queryParamShow.depth,
        page: pageType,
      })
    );
    dispatch(updateCountry(queryParamCountry));
    dispatch(updateCity(queryParamCity));
    dispatch(updateGender(queryParamGender));
    dispatch(updateYears(queryParamYears));
    dispatch(setFirstLoad());
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      fetchDataAndDispatch(places, exploreState, dispatch, router, pathname);
    }
  }, [
    firstLoad,
    country,
    city,
    occupation,
    gender,
    years,
    metricCutoff,
    metricType,
    onlyShowNew,
    show,
    dispatch,
  ]);

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
    <div>
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
        <Controls nestedOccupations={nestedOccupations} places={places} />
        {data ? (
          pageType === "rankings" ? (
            <RankingTable places={places} />
          ) : (
            <VizShell occupations={occupations} />
          )
        ) : (
          <div style={{ position: "relative", width: "100%" }}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
