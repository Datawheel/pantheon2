/*eslint no-undefined: "error"*/
"use client";
import {useEffect, useMemo} from "react";
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {useSelector, useDispatch} from "react-redux";
import VizTitle from "../components/explore/VizTitle";
import Controls from "../components/explore/Controls";
import Spinner from "../components/Spinner";
import RankingTable from "../components/explore/rankings/RankingTable";
import {
  buildNestedOccupations,
  buildRankingsMetricSentence,
  parseRankingsSearchParams,
} from "/lib/rankings";
import {
  FORMATTERS,
} from "../components/utils/consts";
import {fetchDataAndDispatch} from "../components/utils/exploreHelpers";
import {
  setFirstLoad,
  updateCountry,
  updateCity,
  updateGender,
  updateMetricCutoff,
  updateMetricType,
  updatePlaceType,
  updateYears,
  updateYearType,
  updateShowDepth,
  updateOccupation,
  updateOnlyShowNew,
  updateBirthMonth,
  updateBirthDay,
} from "./exploreSlice";
import "./Explore.css";
import VizShell from "../components/explore/viz/VizShell";

function Explore({
  baseApi,
  places,
  occupations,
  pageType,
  embed = false,
  initialExploreState = null,
}) {
  const {
    firstLoad,
    data,
  } = useSelector(state => state.explore);
  const exploreState = useSelector(state => state.explore);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const nestedOccupations = buildNestedOccupations(occupations);
  const effectiveExploreState =
    firstLoad && initialExploreState
      ? {...exploreState, ...initialExploreState}
      : exploreState;
  const filterFetchState = useMemo(() => ({
    city: exploreState.city,
    country: exploreState.country,
    gender: exploreState.gender,
    metricCutoff: exploreState.metricCutoff,
    metricType: exploreState.metricType,
    occupation: exploreState.occupation,
    onlyShowNew: exploreState.onlyShowNew,
    page: exploreState.page,
    placeType: exploreState.placeType,
    show: {
      type: exploreState.show.type,
      depth: exploreState.show.depth,
    },
    viz: exploreState.viz,
    years: exploreState.years,
    yearType: exploreState.yearType,
    birthMonth: exploreState.birthMonth,
    birthDay: exploreState.birthDay,
    nameSearch: exploreState.nameSearch,
    dataPageIndex: exploreState.dataPageIndex,
    sorting: exploreState.sorting,
  }), [
    exploreState.birthDay,
    exploreState.birthMonth,
    exploreState.city,
    exploreState.country,
    exploreState.dataPageIndex,
    exploreState.gender,
    exploreState.metricCutoff,
    exploreState.metricType,
    exploreState.nameSearch,
    exploreState.occupation,
    exploreState.onlyShowNew,
    exploreState.page,
    exploreState.placeType,
    exploreState.sorting,
    exploreState.show.depth,
    exploreState.show.type,
    exploreState.viz,
    exploreState.years,
    exploreState.yearType,
  ]);

  useEffect(() => {
    const initialState =
      initialExploreState || parseRankingsSearchParams(searchParams, occupations, pageType);

    dispatch(
      updateShowDepth({
        showType: initialState.show.type,
        showDepth: initialState.show.depth,
        page: pageType,
      })
    );
    dispatch(updateOccupation(initialState.occupation));
    dispatch(updateCountry(initialState.country));
    dispatch(updateCity(initialState.city));
    dispatch(updatePlaceType(initialState.placeType));
    dispatch(updateGender(initialState.gender));
    dispatch(updateYears(initialState.years));
    dispatch(updateYearType(initialState.yearType));
    dispatch(updateMetricType(initialState.metricType));
    dispatch(updateMetricCutoff(initialState.metricCutoff));
    dispatch(updateOnlyShowNew(initialState.onlyShowNew));
    dispatch(updateBirthMonth(initialState.birthMonth));
    dispatch(updateBirthDay(initialState.birthDay));
    dispatch(setFirstLoad());
    // This effect should only hydrate the initial store state from the URL once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!firstLoad) {
      fetchDataAndDispatch(
        baseApi,
        places,
        filterFetchState,
        dispatch,
        router,
        pathname,
        null,
        filterFetchState.sorting,
        !embed
      );
    }
  }, [
    firstLoad,
    exploreState.city,
    exploreState.country,
    exploreState.gender,
    exploreState.metricCutoff,
    exploreState.metricType,
    exploreState.occupation,
    exploreState.onlyShowNew,
    exploreState.placeType,
    exploreState.sorting,
    exploreState.show.depth,
    exploreState.show.type,
    exploreState.years,
    exploreState.yearType,
    exploreState.birthMonth,
    exploreState.birthDay,
    exploreState.nameSearch,
    filterFetchState,
    baseApi,
    places,
    dispatch,
    router,
    pathname,
    embed,
  ]);

  const metricSentence = buildRankingsMetricSentence(effectiveExploreState);

  const vizContent = data ? (
    pageType === "rankings" ? (
      <RankingTable baseApi={baseApi} places={places} />
    ) : (
      <VizShell occupations={occupations} />
    )
  ) : (
    <div style={{position: "relative", width: "100%"}}>
      <Spinner />
    </div>
  );

  if (embed) {
    return (
      <div className="explore-embed">
        <div className="explore-head">
          <VizTitle
            places={places}
            nestedOccupations={nestedOccupations}
            exploreState={effectiveExploreState}
          />
        </div>
        <div className="explore-body">{vizContent}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="explore-head">
        <VizTitle
          places={places}
          nestedOccupations={nestedOccupations}
          exploreState={effectiveExploreState}
        />
        {effectiveExploreState.years.length ? (
          <h3 className="explore-date">
            {FORMATTERS.year(effectiveExploreState.years[0])} - {FORMATTERS.year(effectiveExploreState.years[1])}
          </h3>
        ) : null}
        {metricSentence ? <p>{metricSentence}</p> : null}
      </div>
      <div className="explore-body">
        <Controls nestedOccupations={nestedOccupations} places={places} />
        {vizContent}
      </div>
    </div>
  );
}

export default Explore;
