import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { FORMATTERS } from "types";
import { polyfill } from "es6-promise";
import Rcslider from "rc-slider";
import { changeCountry, changePlace, changeDomain, changeProfession, changeType, changeTypeNesting, changeYearType, changeYears, fetchRankings } from "actions/rankings";
import apiClient from 'apiconfig';

const ENTER_KEY_CODE = 13;

polyfill();

class ExploreControls extends Component {

  constructor(props) {
    super(props);
    this.rankingType = [
      {id:"person", name:"People"},
      {id:"profession", name:"Professions"},
      {id:"place", name:"Place"},
    ];
    this.state = {
      countries: [],
      places: [],
      domains: [],
      professions: [],
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
    this.changeProfession = this.props.changeProfession.bind(this);
  }

  componentDidMount(){
    apiClient.get("/place?is_country=is.true&order=name&select=id,name,country_code")
      .then((res) => {
        this.setState({countries: res.data})
      })
    apiClient.get("/profession?select=id,name,domain_slug,domain")
      .then((res) => {
        const uniqueDomains = res.data.filter(function(item, pos) {
          return res.data.findIndex(d => d.domain_slug===item.domain_slug) === pos;
        })
        this.setState({domains: uniqueDomains})
      })
  }

  sanitizeYear(yr) {
    const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
    if(yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr) < 0){
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
    const {type, typeNesting, yearType, years, country, place, domain, profession} = this.props.rankings;
    const {countries, places, domains, professions, tempYearStart, tempYearEnd} = this.state;
    const minYearKeyDown = this.minYearKeyDown.bind(this);
    const maxYearKeyDown = this.maxYearKeyDown.bind(this);
    const tempEndYear = this.state.tempEndYear || years.max;

    return (
      <div className='ranking-controls'>

        <h2>Rankings</h2>

        <section className="control-group">
          <h3>Show Top Ranked</h3>
          <select value={type} onChange={this.changeType}>
            {this.rankingType.map(rt =>
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            )}
          </select>
          { type === "profession" ?
          <div className="flat-options-w-title">
            <h3>Level:</h3>
            <ul className="flat-options">
              <li><a href="#" id="profession" onClick={this.changeTypeNesting} className={typeNesting === "profession" ? "active" : null}>Prof</a></li>
              <li><a href="#" id="industry" onClick={this.changeTypeNesting} className={typeNesting === "industry" ? "active" : null}>Ind</a></li>
              <li><a href="#" id="domain" onClick={this.changeTypeNesting} className={typeNesting === "domain" ? "active" : null}>Dom</a></li>
            </ul>
          </div>
          : null}
          { type === "place" ?
          <div className="flat-options-w-title">
            <h3>Level:</h3>
            <ul className="flat-options">
              <li><a href="#" id="place" onClick={this.changeTypeNesting} className={typeNesting === "place" ? "active" : null}>Cities</a></li>
              <li><a href="#" id="country" onClick={this.changeTypeNesting} className={typeNesting === "country" ? "active" : null}>Countries</a></li>
            </ul>
          </div>
          : null}
        </section>

        <section className="control-group">
          <h3>Filter Rankings</h3>
          <ul className="flat-options">
            <li><a href="#" id="birthyear" onClick={this.changeYearType} className={yearType === "birthyear" ? "active" : null}>Births</a></li>
            <li><a href="#" id="deathyear" onClick={this.changeYearType} className={yearType === "deathyear" ? "active" : null}>Deaths</a></li>
          </ul>


          <h3>Between:</h3>
          <div className="year-inputs">
            <input type="text" id='startYear' value={tempYearStart!==null && !tempYearEnd ? tempYearStart : FORMATTERS.year(years[0])} onChange={minYearKeyDown} onKeyDown={minYearKeyDown} onBlur={minYearKeyDown} />
            <span>and</span>
            <input type="text" id='endYear' value={!tempYearStart && tempYearEnd!==null ? tempYearEnd : FORMATTERS.year(years[1])} onChange={maxYearKeyDown} onKeyDown={maxYearKeyDown} onBlur={maxYearKeyDown} />
          </div>
          <Rcslider range pushable={1} min={-4000} max={2013} step={1} marks={timelineMarks} tipFormatter={(v) => FORMATTERS.year(v)} allowCross={false} onChange={(v) => {this.setState({tempYearStart:v[0], tempYearEnd:v[1]})}} onAfterChange={(v) => {this.setState({tempYearStart:null, tempYearEnd:null}); this.changeYears(v);}} value={tempYearStart && tempYearEnd ? [tempYearStart, tempYearEnd] : years} defaultValue={years} />

          { type !== "place" ?
            <div className="filter">
              <h3>Locations:</h3>
              <select value={country.id} onChange={this.changeCountry}>
                <option value="all">All</option>
                {countries.map(c =>
                  <option key={c.id} value={c.id} data-countrycode={c.country_code}>
                    {c.name}
                  </option>
                )}
              </select>
            </div>
          : null }

          { type !== "place" && country.places.length ?
          <select value={place} onChange={this.changePlace}>
            <option value="all">All</option>
            {country.places.map(p =>
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            )}
          </select>
          : null }

          { type !== "profession" ?
            <div className="filter">
              <h3>Profession:</h3>
              <select value={domain.id} onChange={this.changeDomain}>
                <option value="all">All</option>
                {domains.map(d =>
                  <option key={d.domain_slug} value={d.domain_slug} data-domainslug={d.domain_slug}>
                    {d.domain}
                  </option>
                )}
              </select>
            </div>
          : null }

          { type !== "profession" && domain.professions.length ?
          <select value={profession} onChange={this.changeProfession}>
            <option value="all">All</option>
            {domain.professions.map(p =>
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            )}
          </select>
          : null }
        </section>

      </div>
    );
  }
};

ExploreControls.propTypes = {
  dispatch: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, { fetchRankings, changeType, changeTypeNesting, changeYearType, changeYears, changeCountry, changePlace, changeDomain, changeProfession })(ExploreControls);
