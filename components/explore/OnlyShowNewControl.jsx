"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateOnlyShowNew} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

export default function MetricCutoffControl({locale}) {
  const t = getExploreTranslations(locale);
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
        {t("onlyNewBiographies")}
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
