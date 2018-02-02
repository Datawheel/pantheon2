import React, {Component} from "react";
import {COUNTRY_DEPTH, CITY_DEPTH} from "types";

class PlaceControl extends Component {
  constructor(props) {
    super(props);
  }

  changeCity = e => {
    console.log(e.target.value);
    this.props.onChange("city", e.target.value);
  }

  changeCountry = e => {
    console.log(e.target.value);
    this.props.onChange("city", "all");
    this.props.onChange("country", e.target.value);
  }

  render() {
    const {city, country, places} = this.props;

    return (
      <div className="filter place-control">
        <div className="">
          <h3>Located in</h3>
        </div>

        <select value={country} onChange={this.changeCountry}>
          <option value="all">All Countries</option>
          {places.map(c =>
            <option key={c.country.country_code} value={c.country.id} data-countrycode={c.country.country_code}>
              {c.country.country_name}
            </option>
          )}
        </select>

        <select value={city} onChange={this.changeCity}>
          <option value="all">All Cities</option>
          {country !== "all" && places.length
            ? places.find(c => `${c.country.id}` === `${country}`).cities.map(p =>
              <option key={p.id} value={p.id} data-slug={p.slug}>
                {p.state && p.country_code === "usa" ? `${p.name}, ${p.state}` : `${p.name}`}
              </option>
            )
            : null}
        </select>

      </div>
    );
  }

  render2() {

    const {selectedDepth, selectedCountry, selectedPlace, selectedPlaceInCountry, countries, places, placesInCountry} = this.props.explore.place;
    const changeCountry = this.props.changeCountry.bind(this);
    const changePlace = this.props.changePlace.bind(this);
    const changePlaceInCountry = this.props.changePlaceInCountry.bind(this);
    const placeDepthClick = this.props.changePlaceDepth.bind(this);

    return (
      <div className="filter place-control">
        <div className="">
          <h3>Located in</h3>
          <ul className="items options flat-options">
            <li><a href="#" className={selectedDepth === COUNTRY_DEPTH ? "active" : ""} data-depth={COUNTRY_DEPTH} onClick={placeDepthClick}>Country</a></li>
            <li><a href="#" className={selectedDepth === CITY_DEPTH ? "active" : ""} data-depth={CITY_DEPTH} onClick={placeDepthClick}>City</a></li>
          </ul>
        </div>

        { selectedDepth === COUNTRY_DEPTH
          ? <div>
            <select value={selectedCountry} onChange={changeCountry}>
              <option value="all">All Countries</option>
              {countries.map(c =>
                <option key={c.id} value={c.id} data-countrycode={c.country_code}>
                  {c.name}
                </option>
              )}
            </select>

            { placesInCountry.length
              ? <select value={selectedPlaceInCountry} onChange={changePlaceInCountry}>
                <option value="all">All Cities</option>
                {placesInCountry.map(p =>
                  <option key={p.id} value={p.id} data-slug={p.slug}>
                    {p.state && p.country_code === "usa" ? `${p.name}, ${p.state}` : `${p.name}`}
                  </option>
                )}
              </select>
              : null }

          </div>
          : <div>
            <select value={selectedPlace} onChange={changePlace}>
              <option value="all">All Cities</option>
              {places.map(p =>
                <option key={p.id} value={p.id} data-slug={p.slug}>
                  {p.state && p.country_code === "usa" ? `${p.name}, ${p.state}` : `${p.name}`}
                </option>
              )}
            </select>
          </div>
        }
      </div>
    );
  }
}

export default PlaceControl;
