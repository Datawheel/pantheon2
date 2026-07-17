"use client";
import {useDispatch, useSelector} from "react-redux";
import {
  updateCity,
  updateCountry,
  updatePlaceType,
} from "../../features/exploreSlice";
import {getExploreTranslations} from "@/app/exploreTranslations";

const getClassName = (placetype, activePlaceType, loading) => {
  if (placetype === activePlaceType) {
    if (loading) {
      return `active disabled ${placetype}`;
    }
    return `active ${placetype}`;
  } else if (loading) {
    return `disabled ${placetype}`;
  } else {
    return placetype;
  }
};

export default function PlaceControl({places, locale}) {
  const t = getExploreTranslations(locale);
  const loading = false;
  const dispatch = useDispatch();
  const {city, country, placeType} = useSelector(state => state.explore);

  return (
    <div className="filter place-control">
      <div className="flat-options-w-title">
        <h3>{t("location")}</h3>
        <ul className="items options flat-options filter">
          <li>
            <a
              onClick={e =>
                loading
                  ? e.preventDefault()
                  : (e.preventDefault(), dispatch(updatePlaceType("birthplace")))
              }
              href="#"
              id="birthplace"
              className={getClassName("birthplace", placeType, loading)}
            >
              {t("bornIn")}
            </a>
          </li>
          <li>
            <a
              onClick={e =>
                loading
                  ? e.preventDefault()
                  : (e.preventDefault(), dispatch(updatePlaceType("deathplace")))
              }
              href="#"
              id="deathplace"
              className={getClassName("deathplace", placeType, loading)}
            >
              {t("diedIn")}
            </a>
          </li>
        </ul>
      </div>

      <select
        disabled={loading}
        value={country}
        onChange={e => dispatch(updateCountry(e.target.value))}
      >
        <option value="all">{t("allCountries")}</option>
        {[...places]
          .filter(c => c.country.country_code)
          .sort((a, b) =>
            a.country.country.localeCompare(b.country.country, locale)
          )
          .map(c => (
            <option
              key={`${c.country.country_code}-${c.country.id}`}
              value={c.country.country_code}
              data-countrycode={c.country.country_code}
            >
              {c.country.country}
            </option>
          ))}
      </select>

      <select
        disabled={loading}
        value={city}
        onChange={e => dispatch(updateCity(e.target.value))}
      >
        <option value="all">{t("allCities")}</option>
        {country !== "all" &&
        places.length &&
        places.find(c => `${c.country.country_code}` === `${country}`)
          ? places
              .find(c => `${c.country.country_code}` === `${country}`)
              .cities.filter(c =>
                placeType === "birthplace" ? c.num_born > 0 : c.num_died > 0
              )
              .map(p => (
                <option key={p.id} value={p.id} data-slug={p.slug}>
                  {p.state && p.country_code === "usa"
                    ? `${p.place}, ${p.state}`
                    : `${p.place}`}
                </option>
              ))
          : null}
      </select>

      <p className="place-control-note">
        {t("placeLimit")}
      </p>
    </div>
  );
}
