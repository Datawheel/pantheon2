/*eslint no-undefined: "error"*/
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import VizTitle from "../components/explore/VizTitle";
import Controls from "../components/explore/Controls";
import Spinner from "../components/Spinner";
import RankingTable from "../components/explore/rankings/RankingTable";
import { FORMATTERS, HPI_RANGE, LANGS_RANGE } from "../components/utils/consts";
import { fetchDataAndDispatch } from "../components/utils/exploreHelpers";
import { SANITIZERS } from "../components/utils/sanitizers";
import { setFirstLoad, updateShowDepth } from "./exploreSlice";
import "./Explore.css";

function Explore({ places, nestedOccupations }) {
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

  useEffect(() => {
    const queryParamShow = searchParams.get("show")
      ? SANITIZERS.show(searchParams.get("show"), "rankings")
      : "people";
    console.log("queryParamShow!!!", queryParamShow);
    dispatch(
      updateShowDepth({
        showType: queryParamShow.type,
        showDepth: queryParamShow.depth,
        page: "rankings",
      })
    );
    dispatch(setFirstLoad());
  }, []); // Empty dependency array to run only on initial mount

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
          <RankingTable places={places} />
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
