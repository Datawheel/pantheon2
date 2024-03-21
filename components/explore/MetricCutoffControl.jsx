"use client";
import {useDispatch, useSelector} from "react-redux";
import {
  updateMetricType,
  updateMetricCutoff,
} from "../../features/exploreSlice";
import {HPI_RANGE, LANGS_RANGE} from "../utils/consts";

export default function MetricCutoffControl() {
  const loading = false;
  const dispatch = useDispatch();
  const {metricType, metricCutoff} = useSelector(state => state.explore);
  const metricVals = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

  return (
    <div className="flat-options">
      <ul className="items options flat-options filter">
        <li>
          <a
            onClick={e =>
              loading
                ? e.preventDefault()
                : (e.preventDefault(), dispatch(updateMetricType("hpi")))
            }
            href="#"
            id="hpi"
            className={`${loading ? "disabled" : ""} ${
              metricType === "hpi" ? "active" : ""
            } metric`}
          >
            HPI
          </a>
        </li>
        <li>
          <a
            onClick={e =>
              loading
                ? e.preventDefault()
                : (e.preventDefault(), dispatch(updateMetricType("l")))
            }
            href="#"
            id="langs"
            className={`${loading ? "disabled" : ""} ${
              metricType === "l" ? "active" : ""
            } metric`}
          >
            L
          </a>
        </li>
      </ul>
      <span>&gt;</span>
      <select
        disabled={loading}
        value={metricCutoff}
        onChange={e => dispatch(updateMetricCutoff(e.target.value))}
      >
        {metricVals.map(v => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
