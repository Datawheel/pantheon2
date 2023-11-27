"use client";
import { useDispatch, useSelector } from "react-redux";
import { updateViz } from "../../features/exploreSlice";

const allVizTypes = [
  { id: "Treemap", name: "Tree Map" },
  { id: "StackedArea", name: "Stacked" },
  { id: "LineChart", name: "Line Chart" },
  { id: "Map", name: "Map" },
];

export default function VizControl() {
  const loading = false;
  const dispatch = useDispatch();
  const { viz } = useSelector((state) => state.explore);

  return (
    <div className="filter">
      <h3>Make a</h3>
      <ul className="items options viztype-options">
        {allVizTypes.map((v) => (
          <li key={v.id}>
            <h4>
              <a
                href="#"
                data-id={v.id}
                onClick={(e) =>
                  loading
                    ? e.preventDefault()
                    : (e.preventDefault(),
                      dispatch(updateViz(v.id.toLowerCase())))
                }
                className={`${v.id.toLowerCase()} ${
                  loading ? "disabled" : null
                } ${viz === v.id.toLowerCase() ? "active" : ""}`}
              >
                {v.name}
              </a>
            </h4>
          </li>
        ))}
      </ul>
    </div>
  );
}
