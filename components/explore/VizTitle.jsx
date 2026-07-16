"use client";
import {useSelector} from "react-redux";
import {buildRankingsHeading} from "@/lib/rankings";

export default function VizTitle({places, nestedOccupations, exploreState, locale}) {
  const storeExploreState = useSelector(state => state.explore);
  const activeExploreState = exploreState || storeExploreState;
  const title = buildRankingsHeading(
    activeExploreState,
    places,
    nestedOccupations,
    locale,
  );

  return <h1 className="explore-title">{title}</h1>;
}
