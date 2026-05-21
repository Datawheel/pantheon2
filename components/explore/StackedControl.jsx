"use client";
import {useDispatch, useSelector} from "react-redux";
import {
  updateTsScale,
  updateTsBins,
  updateStackedPercent,
} from "../../features/exploreSlice";
import {autoBins, resolveTimeSeriesScale} from "../utils/vizHelpers";

const SCALE_OPTIONS = [
  {id: "auto", label: "Auto", value: null},
  {id: "linear", label: "Linear", value: "linear"},
  {id: "log", label: "Log", value: "log"},
];

const BIN_MIN = 4;
const BIN_MAX = 50;

export default function StackedControl() {
  const dispatch = useDispatch();
  const {viz, years, tsScale, tsBins, stackedPercent} = useSelector(
    state => state.explore
  );

  const resolvedScale = resolveTimeSeriesScale(years, tsScale);
  const effectiveBins = tsBins ?? autoBins(years, resolvedScale);
  const span =
    Array.isArray(years) && years.length >= 2
      ? Math.abs(years[1] - years[0])
      : 0;
  const yearsPerBin = effectiveBins ? Math.max(1, Math.round(span / effectiveBins)) : 0;

  const isStacked = viz === "stackedarea";

  return (
    <div className="filter stacked-control">
      <h3>{isStacked ? "Stacked options" : "Time chart options"}</h3>

      <div className="stacked-field">
        <label className="stacked-label">
          Scale{" "}
          {tsScale === null ? (
            <span className="stacked-hint">(auto: {resolvedScale})</span>
          ) : null}
        </label>
        <ul className="items options flat-options filter">
          {SCALE_OPTIONS.map(option => (
            <li key={option.id}>
              <a
                href="#"
                className={tsScale === option.value ? "active" : ""}
                onClick={e => {
                  e.preventDefault();
                  dispatch(updateTsScale(option.value));
                }}
              >
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="stacked-field">
        <label className="stacked-label" htmlFor="stacked-bins">
          Year groupings: <strong>{effectiveBins}</strong>
        </label>
        {resolvedScale === "linear" && yearsPerBin ? (
          <span className="stacked-hint stacked-hint-block">
            ~{yearsPerBin} yr each
          </span>
        ) : null}
        <input
          id="stacked-bins"
          className="stacked-slider"
          type="range"
          min={BIN_MIN}
          max={BIN_MAX}
          step={1}
          value={effectiveBins}
          onChange={e => dispatch(updateTsBins(parseInt(e.target.value, 10)))}
        />
      </div>

      {isStacked ? (
        <div className="flat-options stacked-percent">
          <label
            className={stackedPercent ? "active" : ""}
            htmlFor="stackedPercent"
          >
            Show as percentage
          </label>
          <input
            type="checkbox"
            id="stackedPercent"
            name="stackedPercent"
            checked={stackedPercent}
            onChange={e => dispatch(updateStackedPercent(e.target.checked))}
          />
        </div>
      ) : null}
    </div>
  );
}
