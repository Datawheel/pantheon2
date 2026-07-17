"use client";
import {useDispatch, useSelector} from "react-redux";
import {updateGender} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

const getClassName = (genderId, genderName, currentGender, loading) => {
  if (genderId === currentGender) {
    if (loading) {
      return `active disabled ${genderName}`;
    }
    return `active ${genderName}`;
  } else if (loading) {
    return `disabled ${genderName}`;
  } else {
    return genderName;
  }
};

export default function GenderControl({locale}) {
  const t = getExploreTranslations(locale);
  const loading = false;
  const dispatch = useDispatch();
  const {gender} = useSelector(state => state.explore);

  return (
    <div className="filter">
      <h3>{t("gender")}</h3>
      <ul className="items options flat-options filter">
        <li>
          <a
            onClick={e =>
              loading
                ? e.preventDefault()
                : (e.preventDefault(), dispatch(updateGender(null)))
            }
            href="#"
            id="allgender"
            className={getClassName(null, "allgender", gender, loading)}
          >
            {t("all")}
          </a>
        </li>
        <li>
          <a
            onClick={e =>
              loading
                ? e.preventDefault()
                : (e.preventDefault(), dispatch(updateGender("F")))
            }
            href="#"
            id="femalegender"
            className={getClassName("F", "femalegender", gender, loading)}
          >
            {t("females")}
          </a>
        </li>
        <li>
          <a
            onClick={e =>
              loading
                ? e.preventDefault()
                : (e.preventDefault(), dispatch(updateGender("M")))
            }
            href="#"
            id="malegender"
            className={getClassName("M", "malegender", gender, loading)}
          >
            {t("males")}
          </a>
        </li>
      </ul>
    </div>
  );
}
