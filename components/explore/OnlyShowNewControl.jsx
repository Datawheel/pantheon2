"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateOnlyShowNew} from "../../features/exploreSlice";

export default function MetricCutoffControl() {
  const loading = false;
  const dispatch = useDispatch();
  const {onlyShowNew} = useSelector(state => state.explore);

  return (
    <div className="flat-options">
      <label
        disabled={loading}
        className={onlyShowNew ? "active" : ""}
        htmlFor="onlyNew"
      >
        Only new biographies (2024)
      </label>
      <input
        disabled={loading}
        type="checkbox"
        id="onlyNew"
        name="scales"
        onChange={e => dispatch(updateOnlyShowNew(e.target.checked))}
        checked={onlyShowNew}
      />
    </div>
  );
}
