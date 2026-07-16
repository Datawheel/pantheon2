"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateViz} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

const allVizTypes = [
  {id: "Treemap", key: "treeMap"},
  {id: "StackedArea", key: "stacked"},
  {id: "LineChart", key: "lineChart"},
  {id: "Map", key: "map"},
];

export default function VizControl({locale}) {
  const t = getExploreTranslations(locale);
  const loading = false;
  const dispatch = useDispatch();
  const {viz} = useSelector(state => state.explore);

  return (
    <div className="filter">
      <h3>{t("makeA")}</h3>
      <ul className="items options viztype-options">
        {allVizTypes.map(v => (
          <li key={v.id}>
            <h4>
              <a
                href="#"
                data-id={v.id}
                onClick={e =>
                  loading
                    ? e.preventDefault()
                    : (e.preventDefault(),
                      dispatch(updateViz(v.id.toLowerCase())))
                }
                className={`${v.id.toLowerCase()} ${
                  loading ? "disabled" : null
                } ${viz === v.id.toLowerCase() ? "active" : ""}`}
              >
                {t(v.key)}
              </a>
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}
