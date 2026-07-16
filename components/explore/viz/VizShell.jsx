"use client";
import {useSelector} from "react-redux";
import Spinner from "../../../components/Spinner";
import PTreemap from "../../../components/explore/viz/PTreemap";
import PStacked from "../../../components/explore/viz/PStacked";
import PLine from "../../../components/explore/viz/PLine";
import PMap from "../../../components/explore/viz/PMap";
import "./Viz.css";
import {getExploreTranslations} from "@/app/exploreTranslations";

export default function VizShell({occupations, locale}) {
  const t = getExploreTranslations(locale);
  const exploreState = useSelector(state => state.explore);
  const {
    data,
    dataLoading,
    show,
    viz,
    yearType,
    years,
    tsScale,
    tsBins,
    stackedPercent,
  } = exploreState;

  if (dataLoading) {
    return (
      <div className="explore-viz-container">
        <Spinner label={t("loading")} />
      </div>
    );
  }

  if (data && !data.length) {
    return (
      <div className="explore-viz-container">
        <div className="loading-img">
          <p>{t("noDataFound")}</p>
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
      MyViz = PStacked;
  }

  return (
    <div className="explore-viz-container">
      {data.length ? (
        <MyViz
          data={data}
          show={show}
          occupations={occupations}
          yearType={yearType}
          years={years}
          scale={tsScale}
          binCount={tsBins}
          percent={stackedPercent}
          locale={locale}
        />
      ) : null}
    </div>
  );
}
