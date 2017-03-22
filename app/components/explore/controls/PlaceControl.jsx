import React, {Component} from "react";
import {connect} from "react-redux";
import {changeCountry, changePlace, changePlaceInCountry, changePlaceDepth} from "actions/explore";
import {COUNTRY_DEPTH, CITY_DEPTH} from "types";

class PlaceControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      placeDepth: COUNTRY_DEPTH
    };
  }

  // componentWillMount() {
  //   const {city, country} = this.props;
  //   if (country) {
  //     const [countryCode, countryId] = country;
  //     this.props.changeCountry(countryCode, countryId);
  //     if (city) {
  //       this.props.changePlaceInCountry(city);
  //     }
  //     this.props.changePlaceDepth(COUNTRY_DEPTH);
  //   }
  //   else if (city) {
  //     this.props.changePlace(city);
  //     this.props.changePlaceDepth(CITY_DEPTH);
  //   }
  // }

  render() {

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
                  {p.name}
                </option>
              )}
            </select>
            : null }

          </div>
        : <div>
            <select value={selectedPlace} onChange={changePlace}>
              <option value="all">All Cities</option>
              {places.map(c =>
                <option key={c.id} value={c.id} data-slug={c.slug}>
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
  explore: state.explore
});

// function mapDispatchToProps(dispatch) {
  // return {
  //   actions: bindActionCreators({changeCountry, changePlace, changePlaceInCountry, changePlaceDepth}, dispatch)
  // };
// }
const mapDispatchToProps = dispatch => ({
  changeCountry: (eventOrCountryCode, countryId) => {
    const countryCode = eventOrCountryCode.target ? eventOrCountryCode.target.options[eventOrCountryCode.target.selectedIndex].dataset.countrycode : eventOrCountryCode;
    countryId = eventOrCountryCode.target ? eventOrCountryCode.target.value : countryId;
    dispatch(changeCountry(countryCode, countryId, true));
  },
  changePlace: e => {
    const placeId = e.target.value;
    const placeSlug = e.target.options[e.target.selectedIndex].dataset.slug;
    dispatch(changePlace(placeId, placeSlug));
  },
  changePlaceInCountry: e => {
    const placeId = e.target.value;
    const placeSlug = e.target.options[e.target.selectedIndex].dataset.slug;
    dispatch(changePlaceInCountry(placeId, placeSlug));
  },
  changePlaceDepth: e => {
    e.preventDefault();
    const depth = e.target.dataset.depth;
    dispatch(changePlaceDepth(depth));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaceControl);
