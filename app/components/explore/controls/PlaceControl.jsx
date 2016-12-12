import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changeCountry, changeCity, changeCityInCountry } from "actions/explorer";
import apiClient from 'apiconfig';

const COUNTRY_DEPTH = "COUNTRY";
const CITY_DEPTH = "CITY";

class PlaceControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeDepth: COUNTRY_DEPTH
    }
  }

  placeDepthChange(e) {
    e.preventDefault();
    const placeDepth = e.target.dataset.depth;
    this.setState({ placeDepth });
  }

  render() {

    const {selectedCountry, selectedCity, selectedCityInCountry, countries, cities, citiesInCountry} = this.props.explorer.place;
    const changeCountry = this.props.changeCountry.bind(this);
    const changeCity = this.props.changeCity.bind(this);
    const changeCityInCountry = this.props.changeCityInCountry.bind(this);
    const depthChange = this.placeDepthChange.bind(this);
    const placeDepth = this.state.placeDepth;

    return (
      <div className="filter">
        <h3>Places:</h3>

        <h4>Within:</h4>
        <div>
          <a href="#" data-depth={COUNTRY_DEPTH} onClick={depthChange}>Countries</a> | <a href="#" data-depth={CITY_DEPTH} onClick={depthChange}>Cities</a>
        </div>

        { placeDepth === COUNTRY_DEPTH ?
          <div>
            <select value={selectedCountry} onChange={changeCountry}>
              <option value="all">All</option>
              {countries.map(c =>
                <option key={c.id} value={c.id} data-countrycode={c.country_code}>
                  {c.name}
                </option>
              )}
            </select>

            { citiesInCountry.length ?
            <select value={selectedCityInCountry} onChange={changeCityInCountry}>
              <option value="all">All</option>
              {citiesInCountry.map(p =>
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              )}
            </select>
            : null }

          </div>
        :
          <div>
            <select value={selectedCity} onChange={changeCity}>
              <option value="all">All</option>
              {cities.map(c =>
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              )}
            </select>
          </div>
        }
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    explorer: state.explorer,
  };
}

export default connect(mapStateToProps, { changeCountry, changeCity, changeCityInCountry })(PlaceControl);
