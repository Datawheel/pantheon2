"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateOccupation} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

export default function OccupationControl({nestedOccupations, locale}) {
  const t = getExploreTranslations(locale);
  const loading = false;
  const dispatch = useDispatch();
  const {occupation} = useSelector(state => state.explore);

  return (
    <div className="filter prof-control">
      <div className="">
        <h3>{t("workingIn")}</h3>
      </div>

      <div>
        <select
          disabled={loading}
          value={occupation}
          onChange={e => dispatch(updateOccupation(e.target.value))}
        >
          <option value="all" data-occupations="all">
            {t("allOccupations")}
          </option>
          {nestedOccupations
            ? nestedOccupations.map(domain => (
                <optgroup key={domain.domain.slug} label={domain.domain.name}>
                  <option
                    value={domain.domain.id}
                    data-occupations={domain.domain.occupations}
                  >
                    {t("allDomainOccupations", {domain: domain.domain.name})}
                  </option>
                  {domain.occupations.map(occ => (
                    <option
                      key={occ.occupation_slug}
                      value={occ.id}
                      data-occupations={occ.id}
                    >
                      {occ.occupation}
                    </option>
                  ))}
                </optgroup>
              ))
            : null}
        </select>
      </div>
    </div>
  );
}
