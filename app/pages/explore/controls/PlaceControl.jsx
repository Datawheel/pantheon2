import React, {Component} from "react";

class PlaceControl extends Component {
  constructor(props) {
    super(props);
  }

  changeCity = e => {
    this.props.onChange("city", e.target.value);
  }

  changeCountry = e => {
    this.props.onChange("city", "all");
    this.props.onChange("country", e.target.value);
  }

  changePlaceType = (newPlaceType, e) => {
    e.preventDefault();
    this.props.onChange("placeType", newPlaceType);
  }

  render() {
    const {city, country, places, placeType} = this.props;

    // console.log("places", places);
    // console.log("placeType", placeType);
    // console.log("country", country);

    return (
      <div className="filter place-control">
        <ul className="items options flat-options filter">
          <li><a onClick={e => this.changePlaceType("birthplace", e)} href="#" id="birthplace" className={placeType === "birthplace" ? "active birthplace" : "birthplace"}>Born in</a></li>
          <li><a onClick={e => this.changePlaceType("deathplace", e)} href="#" id="deathplace" className={placeType === "deathplace" ? "active deathplace" : "deathplace"}>Died in</a></li>
        </ul>

        <select value={country} onChange={this.changeCountry}>
          <option value="all">All Countries</option>
          {places.filter(c => c.country.country_code)
            .sort((a, b) => a.country.country.localeCompare(b.country.country))
            .map(c =>
              <option key={`${c.country.country_code}-${c.country.id}`} value={c.country.country_code} data-countrycode={c.country.country_code}>
                {c.country.country}
              </option>
            )}
        </select>

        <select value={city} onChange={this.changeCity}>
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

      </div>
    );
  }
}

export default PlaceControl;
