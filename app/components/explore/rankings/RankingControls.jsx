import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import InputRange from 'react-input-range';
import { FORMATTERS } from 'types';
import { polyfill } from "es6-promise";
import axios from "axios";
import { changeCountry, changePlace, changeDomain, changeProfession, changeType, changeYears, fetchRankings } from "actions/rankings";
const ENTER_KEY_CODE = 13;

polyfill();

class RankingControls extends Component {

  constructor(props) {
    super(props);
    this.rankingType = [
      {id:"person", name:"Person"},
      {id:"profession", name:"Profession"},
      {id:"birthcountry", name:"Birth Country"},
      {id:"birthplace", name:"Birth City"}
    ];
    this.state = {
      countries: [],
      places: [],
      domains: [],
      professions: [],
      tempSliderYears: {
        min: -4000,
        max: 2000
      },
      tempInputYears: {
        min: "4000 BC",
        max: "2000"
      },
    }
    this.changeType = this.props.changeType.bind(this);
    this.changeYears = this.props.changeYears;
    this.changeCountry = this.props.changeCountry.bind(this);
    this.changePlace = this.props.changePlace.bind(this);
    this.changeDomain = this.props.changeDomain.bind(this);
    this.changeProfession = this.props.changeProfession.bind(this);
  }

  changeYearsRange(inputRange, vals) {
    this.setState({tempSliderYears: vals});
    this.setState({tempInputYears: {min: FORMATTERS.year(vals.min), max:FORMATTERS.year(vals.max)}});
  }

  componentDidMount(){
    axios.get("http://localhost:3100/place?is_country=is.true&order=name&select=id,name,country_code")
      .then((res) => {
        this.setState({countries: res.data})
      })
    axios.get("http://localhost:3100/profession?select=id,name,domain_slug,domain")
      .then((res) => {
        const uniqueDomains = res.data.filter(function(item, pos) {
          return res.data.findIndex(d => d.domain_slug===item.domain_slug) === pos;
        })
        this.setState({domains: uniqueDomains})
      })
    // const { fetchRankings } = this.props;
    // fetchRankings('test text!!!')
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
    let tempInputYears = this.state.tempInputYears;
    let tempSliderYears = this.state.tempSliderYears;
    const rawYear = e.target.value;

    switch(e.type){
      case "keydown":
        if (e.keyCode === ENTER_KEY_CODE) {
          let newYear = this.sanitizeYear(rawYear);
          newYear = Math.min(Math.max(newYear, -2000), years.max);
          this.changeYears({ min:newYear, max:years.max });
          tempInputYears.min = FORMATTERS.year(newYear);
          tempSliderYears.min = newYear;
          break;
        }
        tempInputYears.min = rawYear;
        break;
      case "blur":
        let newYear = this.sanitizeYear(rawYear);
        newYear = Math.min(Math.max(newYear, -2000), years.max);
        this.changeYears({ min:newYear, max:years.max })
        tempInputYears.min = FORMATTERS.year(newYear);
        tempSliderYears.min = newYear;
        break;
      default:
        tempInputYears.min = rawYear;
    }

    this.setState({tempInputYears});
    this.setState({tempSliderYears});
  }

  maxYearKeyDown(e){
    const {years} = this.props.rankings;
    let tempInputYears = this.state.tempInputYears;
    let tempSliderYears = this.state.tempSliderYears;
    const rawYear = e.target.value;

    switch(e.type){
      case "keydown":
        if (e.keyCode === ENTER_KEY_CODE) {
          let newYear = this.sanitizeYear(rawYear);
          newYear = Math.min(Math.max(newYear, years.min), 2016);
          this.changeYears({ min:years.min, max:newYear })
          tempInputYears.max = FORMATTERS.year(newYear);
          tempSliderYears.max = newYear;
          break;
        }
        tempInputYears.max = rawYear;
        break;
      case "blur":
        let newYear = this.sanitizeYear(rawYear);
        newYear = Math.min(Math.max(newYear, years.min), 2016);
        this.changeYears({ min:years.min, max:newYear })
        tempInputYears.max = FORMATTERS.year(newYear);
        tempSliderYears.max = newYear;
        break;
      default:
        tempInputYears.max = rawYear;
    }

    this.setState({tempInputYears});
  }

  render() {
    const {type, years, country, place, domain, profession} = this.props.rankings;
    const {countries, places, domains, professions, tempSliderYears, tempInputYears} = this.state;
    const changeYearsRange = this.changeYearsRange.bind(this);
    const minYearKeyDown = this.minYearKeyDown.bind(this);
    const maxYearKeyDown = this.maxYearKeyDown.bind(this);
    const tempEndYear = this.state.tempEndYear || years.max;

    return (
      <div className='ranking-controls'>

        <h2>Show Top Ranked:</h2>
        <select value={type} onChange={this.changeType}>
          {this.rankingType.map(rt =>
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          )}
        </select>

        <h2>Years:</h2>
        <input type="text" id='startYear' value={tempInputYears.min} onChange={minYearKeyDown} onKeyDown={minYearKeyDown} onBlur={minYearKeyDown} />
        to
        <input type="text" id='endYear' value={tempInputYears.max} onChange={maxYearKeyDown} onKeyDown={maxYearKeyDown} onBlur={maxYearKeyDown} />
        <InputRange
          maxValue={2000}
          minValue={-4000}
          value={tempSliderYears}
          formatLabel={v => FORMATTERS.year(v)}
          onChangeComplete={(inputRange, years) => this.changeYears(years)}
          onChange={changeYearsRange}
        />

        { !["birthcountry", "birthplace"].includes(type) ?
          <div className="filter">
            <h2>Locations:</h2>
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

        { country.places.length ?
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
            <h2>Profession:</h2>
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

        { domain.professions.length ?
        <select value={profession} onChange={this.changeProfession}>
          <option value="all">All</option>
          {domain.professions.map(p =>
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          )}
        </select>
        : null }

      </div>
    );
  }
};

RankingControls.propTypes = {
  dispatch: React.PropTypes.func
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps, { fetchRankings, changeType, changeYears, changeCountry, changePlace, changeDomain, changeProfession })(RankingControls);
