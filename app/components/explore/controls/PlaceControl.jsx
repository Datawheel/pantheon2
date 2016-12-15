import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { changeCountry, changeCity, changeCityInCountry, changePlaceDepth } from "actions/explorer";
import apiClient from 'apiconfig';
import { COUNTRY_DEPTH, CITY_DEPTH } from 'types';

class PlaceControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeDepth: COUNTRY_DEPTH
    }
  }

  placeDepthClick(e) {
    e.preventDefault();
    this.props.actions.changePlaceDepth(e.target.dataset.depth);
  }

  render() {

    const {selectedDepth, selectedCountry, selectedCity, selectedCityInCountry, countries, cities, citiesInCountry} = this.props.explorer.place;
    const changeCountry = this.props.actions.changeCountry.bind(this);
    const changeCity = this.props.actions.changeCity.bind(this);
    const changeCityInCountry = this.props.actions.changeCityInCountry.bind(this);
    const placeDepthClick = this.placeDepthClick.bind(this);

    return (
      <div className="filter">
        <h3>Places:</h3>

        <div className="flat-options-w-title">
          <h3>Within:</h3>
          <ul className="flat-options">
            <li><a href="#" className={selectedDepth===COUNTRY_DEPTH ? "active" : ""} data-depth={COUNTRY_DEPTH} onClick={placeDepthClick}>Countries</a></li>
            <li><a href="#" className={selectedDepth===CITY_DEPTH ? "active" : ""} data-depth={CITY_DEPTH} onClick={placeDepthClick}>Cities</a></li>
          </ul>
        </div>

        { selectedDepth === COUNTRY_DEPTH ?
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeCountry, changeCity, changeCityInCountry, changePlaceDepth}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceControl);
