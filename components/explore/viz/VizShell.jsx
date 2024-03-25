"use client";
import {useSelector} from "react-redux";
import Spinner from "../../../components/Spinner";
import PTreemap from "../../../components/explore/viz/PTreemap";
import PStacked from "../../../components/explore/viz/PStacked";
import PLine from "../../../components/explore/viz/PLine";
import PMap from "../../../components/explore/viz/PMap";
import "./Viz.css";

export default function VizShell({occupations}) {
  const exploreState = useSelector(state => state.explore);
  const {data, dataLoading, show, viz, yearType} = exploreState;

  if (dataLoading) {
    return (
      <div className="explore-viz-container">
        <Spinner />
      </div>
    );
  }

  if (data && !data.length) {
    return (
      <div className="explore-viz-container">
        <div className="loading-img">
          <p>No data found.</p>
        </div>
      </div>
    );
  }

  let MyViz;
  switch (viz) {
    case "stackedarea":
      MyViz = PStacked;
      break;
    case "treemap":
      MyViz = PTreemap;
      break;
    case "linechart":
      MyViz = PLine;
      break;
    case "map":
      MyViz = PMap;
      break;
    default:
      MyViz = PTreemap;
  }

  return (
    <div className="explore-viz-container">
      {data.length ? (
        <MyViz
          data={data}
          show={show}
          occupations={occupations}
          yearType={yearType}
        />
      ) : null}
    </div>
  );
}
