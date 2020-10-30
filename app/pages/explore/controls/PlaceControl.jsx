import React from "react";
import {connect} from "react-redux";
import {updateCity, updateCountry, updatePlaceType} from "actions/vb";

const PlaceControl = ({city, updateCity, country, updateCountry, placeType, updatePlaceType, places}) =>
  <div className="filter place-control">
    <ul className="items options flat-options filter">
      <li><a onClick={e => (e.preventDefault(), updatePlaceType("birthplace"))} href="#" id="birthplace" className={placeType === "birthplace" ? "active birthplace" : "birthplace"}>Born in</a></li>
      <li><a onClick={e => (e.preventDefault(), updatePlaceType("deathplace"))} href="#" id="deathplace" className={placeType === "deathplace" ? "active deathplace" : "deathplace"}>Died in</a></li>
    </ul>

    <select value={country} onChange={e => updateCountry(e.target.value)}>
      <option value="all">All Countries</option>
      {places.filter(c => c.country.country_code)
        .sort((a, b) => a.country.country.localeCompare(b.country.country))
        .map(c =>
          <option key={`${c.country.country_code}-${c.country.id}`} value={c.country.country_code} data-countrycode={c.country.country_code}>
            {c.country.country}
          </option>
        )}
    </select>

    <select value={city} onChange={e => updateCity(e.target.value)}>
      <option value="all">All Cities</option>
      {country !== "all" && places.length && places.find(c => `${c.country.country_code}` === `${country}`)
        ? places
          .find(c => `${c.country.country_code}` === `${country}`).cities
          .filter(c => placeType === "birthplace" ? c.num_born > 0 : c.num_died > 0)
          .map(p =>
            <option key={p.id} value={p.id} data-slug={p.slug}>
              {p.state && p.country_code === "usa" ? `${p.place}, ${p.state}` : `${p.place}`}
            </option>
          )
        : null}
    </select>
  </div>;

const mapDispatchToProps = {updateCity, updateCountry, updatePlaceType};

const mapStateToProps = state => ({
  city: state.vb.city,
  country: state.vb.country,
  placeType: state.vb.placeType
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaceControl);
