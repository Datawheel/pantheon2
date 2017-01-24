import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {FORMATTERS} from "types";
import {polyfill} from "es6-promise";
import Rcslider from "rc-slider";
import {changeCountry, changePlace, changeDomain, changeOccupation, changeType,
          changeTypeNesting, changeYearType, changeYears, fetchRankings} from "actions/rankings";
import apiClient from "apiconfig";

const ENTER_KEY_CODE = 13;

polyfill();

class ExploreControls extends Component {

  constructor(props) {
    super(props);
    this.rankingType = [
      {id: "person", name: "People"},
      {id: "occupation", name: "Occupations"},
      {id: "place", name: "Place"}
    ];
    this.state = {
      countries: [],
      places: [],
      domains: [],
      occupations: [],
      tempYearStart: null,
      tempYearEnd: null
    };
    this.changeType = this.props.changeType.bind(this);
    this.changeTypeNesting = this.props.changeTypeNesting.bind(this);
    this.changeYearType = this.props.changeYearType.bind(this);
    this.changeYears = this.props.changeYears;
    this.changeCountry = this.props.changeCountry.bind(this);
    this.changePlace = this.props.changePlace.bind(this);
    this.changeDomain = this.props.changeDomain.bind(this);
    this.changeOccupation = this.props.changeOccupation.bind(this);
  }

  componentDidMount() {
    apiClient.get("/place?is_country=is.true&order=name&select=id,name,country_code")
      .then(res => {
        this.setState({countries: res.data});
      });
    apiClient.get("/occupation?select=id,occupation,domain_slug,domain")
      .then(res => {
        const uniqueDomains = res.data.filter(function(item, pos) {
          return res.data.findIndex(d => d.domain_slug === item.domain_slug) === pos;
        });
        this.setState({domains: uniqueDomains});
      });
  }

  sanitizeYear(yr) {
    const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
    if (yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr) < 0) {
      return yearAsNumber * -1;
    }
    return yearAsNumber;
  }

  minYearKeyDown(e){
    const {years} = this.props.rankings;
    const tempYearStart = e.target.value;
    this.setState({tempYearStart});
    if(e.type === "blur" || (e.type === "keydown" && e.keyCode === ENTER_KEY_CODE)){
      let sanitizedYear = this.sanitizeYear(tempYearStart);
      sanitizedYear = Math.min(Math.max(sanitizedYear, -4000), years[1]);
      this.changeYears([sanitizedYear, years[1]]);
      this.setState({tempYearStart:null});
    }
  }

  maxYearKeyDown(e){
    const {years} = this.props.rankings;
    const tempYearEnd = e.target.value;
    this.setState({tempYearEnd});
    if(e.type === "blur" || (e.type === "keydown" && e.keyCode === ENTER_KEY_CODE)){
      let sanitizedYear = this.sanitizeYear(tempYearEnd);
      sanitizedYear = Math.min(Math.max(sanitizedYear, years[0]), 2013);
      this.changeYears([years[0], sanitizedYear]);
      this.setState({tempYearEnd:null});
    }
  }

  render() {
    const timelineMarks = {
      '-4000': '4000 BC',
      0: <strong>0 AD</strong>,
      2013: '2013',
    };
    const {type, typeNesting, yearType, years, country, place, domain, occupation} = this.props.rankings;
    const {countries, places, domains, occupations, tempYearStart, tempYearEnd} = this.state;
    const minYearKeyDown = this.minYearKeyDown.bind(this);
    const maxYearKeyDown = this.maxYearKeyDown.bind(this);
    const tempEndYear = this.state.tempEndYear || years.max;

    return (
      <div className="explore-controls rankings">

        <div className="control-header">
          <h2 className="rankings">Rankings</h2>
          <i className="control-hide"></i>
        </div>

        <section className="control-group key-group">
          <h3>Show Top Ranked</h3>
          <select value={type} onChange={this.changeType}>
            {this.rankingType.map(rt =>
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            )}
          </select>
          { type === "occupation" ?
          <div className="flat-options-w-title">
            <h3>Level:</h3>
            <ul className="options flat-options">
              <li><a href="#" id="occupation" onClick={this.changeTypeNesting} className={typeNesting === "occupation" ? "active" : null}>Occ</a></li>
              <li><a href="#" id="industry" onClick={this.changeTypeNesting} className={typeNesting === "industry" ? "active" : null}>Ind</a></li>
              <li><a href="#" id="domain" onClick={this.changeTypeNesting} className={typeNesting === "domain" ? "active" : null}>Dom</a></li>
            </ul>
          </div>
          : null}
          { type === "place" ?
          <div className="flat-options-w-title">
            <h3>Level:</h3>
            <ul className="options flat-options">
              <li><a href="#" id="place" onClick={this.changeTypeNesting} className={typeNesting === "place" ? "active" : null}>Cities</a></li>
              <li><a href="#" id="country" onClick={this.changeTypeNesting} className={typeNesting === "country" ? "active" : null}>Countries</a></li>
            </ul>
          </div>
          : null}
        </section>

        <section className="control-group">
          <h4>Filter Rankings</h4>
          <ul className="options flat-options">
            <li><a href="#" id="birthyear" onClick={this.changeYearType} className={yearType === "birthyear" ? "active" : null}>Births</a></li>
            <li><a href="#" id="deathyear" onClick={this.changeYearType} className={yearType === "deathyear" ? "active" : null}>Deaths</a></li>
          </ul>

          <h3 className="year-label">Between:</h3>
          <div className="year-inputs">
            <input type="text" id="startYear" value={tempYearStart!==null && !tempYearEnd ? tempYearStart : FORMATTERS.year(years[0])} onChange={minYearKeyDown} onKeyDown={minYearKeyDown} onBlur={minYearKeyDown} />
            <span>and</span>
            <input type="text" id="endYear" value={!tempYearStart && tempYearEnd!==null ? tempYearEnd : FORMATTERS.year(years[1])} onChange={maxYearKeyDown} onKeyDown={maxYearKeyDown} onBlur={maxYearKeyDown} />
          </div>

          { type !== "place" ?
            <div className="filter place-control">
              <div className="flat-options-w-title">
                <h3 className="place-filter">Place:</h3>
                <ul className="options flat-options">
                  <li><a href="#" className="active">Country</a></li>
                  <li><a href="#" className="">City</a></li>
                </ul>
              </div>

              <select value={country.id} onChange={this.changeCountry}>
                <option value="all">All Countries</option>
                {countries.map(c =>
                  <option key={c.id} value={c.id} data-countrycode={c.country_code}>
                    {c.name}
                  </option>
                )}
              </select>
            </div>
          : null }

          { type !== "place" && country.places.length ?
          <select className="add-control-input" value={place} onChange={this.changePlace}>
            <option value="all">All Cities</option>
            {country.places.map(p =>
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            )}
          </select>
          : null }

          { type !== "occupation" ?
            <div className="filter prof-control">
              <div className="flat-options-w-title">
                <h3 className="prof-filter">Occ:</h3>
                <ul className="options flat-options">
                  <li><a href="#" className="active">Domain</a></li>
                  <li><a href="#">Occupation</a></li>
                </ul>
              </div>

              <select value={domain.id} onChange={this.changeDomain}>
                <option value="all">All Domains</option>
                {domains.map(d =>
                  <option key={d.domain_slug} value={d.domain_slug} data-domainslug={d.domain_slug}>
                    {d.domain}
                  </option>
                )}
              </select>
            </div>
          : null }

          { type !== "occupation" && domain.occupations.length ?
            <select className="add-control-input" value={occupation} onChange={this.changeOccupation}>
              <option value="all">All Occupations</option>
              {domain.occupations.map(p =>
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              )}
            </select>
          : null }
        </section>
        <Link to="/explore/viz" className="switch-explore-link">Go to Visual Explorer</Link>

      </div>
    );
  }
}

ExploreControls.propTypes = {
  dispatch: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, {fetchRankings, changeType, changeTypeNesting, changeYearType, changeYears, changeCountry, changePlace, changeDomain, changeOccupation})(ExploreControls);
