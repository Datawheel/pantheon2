import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {changeCountry, changeCity, changeCityInCountry, changePlaceDepth} from "actions/explorer";
import {COUNTRY_DEPTH, CITY_DEPTH} from "types";

class PlaceControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeDepth: COUNTRY_DEPTH
    };
  }

  render() {

    const {selectedDepth, selectedCountry, selectedCity, selectedCityInCountry, countries, cities, citiesInCountry} = this.props.explorer.place;
    const changeCountry = this.props.changeCountry.bind(this);
    const changeCity = this.props.changeCity.bind(this);
    const changeCityInCountry = this.props.changeCityInCountry.bind(this);
    const placeDepthClick = this.props.changePlaceDepth.bind(this);

    return (
      <div className="filter place-control">
        <div className="flat-options-w-title">
          <h3>Place:</h3>
          <ul className="options flat-options">
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

            { citiesInCountry.length
            ? <select value={selectedCityInCountry} onChange={changeCityInCountry}>
              <option value="all">All Cities</option>
              {citiesInCountry.map(p =>
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              )}
            </select>
            : null }

          </div>
        : <div>
            <select value={selectedCity} onChange={changeCity}>
              <option value="all">All Cities</option>
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
}


const mapStateToProps = state => ({
  explorer: state.explorer
});

// function mapDispatchToProps(dispatch) {
  // return {
  //   actions: bindActionCreators({changeCountry, changeCity, changeCityInCountry, changePlaceDepth}, dispatch)
  // };
// }
const mapDispatchToProps = dispatch => ({
  changeCountry: e => {
    const countryId = e.target.value;
    const countryCode = e.target.options[e.target.selectedIndex].dataset.countrycode;
    dispatch(changeCountry(countryCode, countryId, true));
  },
  changeCity: e => {
    const newPlace = e.target.value;
    dispatch(changeCity(newPlace));
  },
  changeCityInCountry: e => {
    const newPlace = e.target.value;
    dispatch(changeCityInCountry(newPlace));
  },
  changePlaceDepth: e => {
    const depth = e.target.dataset.depth;
    dispatch(changePlaceDepth(depth));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaceControl);
