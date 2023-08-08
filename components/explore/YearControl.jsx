"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FORMATTERS } from "../utils/consts";
import { updateYears } from "../../features/exploreSlice";

const ENTER_KEY_CODE = 13;
const MAX_ALLOWED_YEAR = new Date().getFullYear();

const sanitizeYear = (yr) => {
  const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
  if (
    yr.replace(".", "").toLowerCase().includes("bc") ||
    parseInt(yr, 10) < 0
  ) {
    return yearAsNumber * -1;
  }
  return yearAsNumber;
};

const getClasName = (yearType, activeYearType, loading) => {
  if (yearType === activeYearType) {
    if (loading) {
      return `active disabled ${yearType}`;
    }
    return `active ${yearType}`;
  } else if (loading) {
    return `disabled ${yearType}`;
  } else {
    return yearType;
  }
};

export default function YearControl() {
  const loading = false;
  const dispatch = useDispatch();
  const { years, yearType } = useSelector((state) => state.explore);
  const [tempYearStart, setTempYearStart] = useState(null);
  const [tempYearEnd, setTempYearEnd] = useState(null);

  const yearChange = (e) => {
    const tempYear = e.target.value;
    const tempYearSetter = e.target.id.includes("end")
      ? setTempYearEnd
      : setTempYearStart;
    tempYearSetter(tempYear);
    console.log(tempYear);
    if (
      e.type === "blur" ||
      (e.type === "keydown" && e.keyCode === ENTER_KEY_CODE)
    ) {
      let sanitizedYear = sanitizeYear(tempYear);
      if (e.target.id.includes("end")) {
        sanitizedYear = Math.min(
          Math.max(sanitizedYear, years[0]),
          MAX_ALLOWED_YEAR
        );
        if (sanitizedYear !== years[1]) {
          dispatch(updateYears([years[0], sanitizedYear]));
        }
      } else {
        sanitizedYear = Math.min(Math.max(sanitizedYear, -4000), years[1]);
        if (sanitizedYear !== years[0]) {
          dispatch(updateYears([sanitizedYear, years[1]]));
        }
      }
      tempYearSetter(null);
    }
  };

  return (
    <div className="year-control filter">
      <ul className="items options flat-options filter">
        <li>
          <a
            onClick={(e) =>
              loading ? null : this.changeYearType("birthyear", e)
            }
            href="#"
            id="birthyear"
            className={getClasName("birthyear", yearType, loading)}
          >
            Born
          </a>
        </li>
        <li>
          <a
            onClick={(e) =>
              loading ? null : this.changeYearType("deathyear", e)
            }
            href="#"
            id="deathyear"
            className={getClasName("deathyear", yearType, loading)}
          >
            Died
          </a>
        </li>
      </ul>
      <div className="year-inputs">
        <input
          disabled={loading}
          type="text"
          id="startYear"
          value={
            tempYearStart !== null && !tempYearEnd
              ? tempYearStart
              : FORMATTERS.year(years[0])
          }
          onChange={yearChange}
          onKeyDown={yearChange}
          onBlur={yearChange}
        />
        <span>and</span>
        <input
          disabled={loading}
          type="text"
          id="endYear"
          value={
            !tempYearStart && tempYearEnd !== null
              ? tempYearEnd
              : FORMATTERS.year(years[1])
          }
          onChange={yearChange}
          onKeyDown={yearChange}
          onBlur={yearChange}
        />
      </div>
    </div>
  );
}
