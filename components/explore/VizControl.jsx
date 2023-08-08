"use client";
import { useSelector } from "react-redux";

const allVizTypes = [
  { id: "Treemap", name: "Tree Map" },
  { id: "StackedArea", name: "Stacked" },
  { id: "LineChart", name: "Line Chart" },
  { id: "Map", name: "Map" },
];

const getClassName = (viz, currentViz, loading) => {
  if (viz === currentViz) {
    if (loading) {
      return `active disabled ${viz}`;
    }
    return `active ${viz}`;
  } else if (loading) {
    return `disabled ${viz}`;
  } else {
    return viz;
  }
};

export default function VizControl() {
  return (
    <div className="filter">
      <h3>Make a</h3>
      <ul className="items options viztype-options">
        {allVizTypes.map((v) => (
          <li key={v.id}>
            <h4>
              <a
                href="#"
                data-viz={v.id.toLowerCase()}
                className={getClassName(v.id.toLowerCase(), viz, loading)}
                onClick={(e) =>
                  loading
                    ? e.preventDefault()
                    : (e.preventDefault(), updateViz(v.id.toLowerCase()))
                }
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
