import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import InputRange from "react-input-range";
import { FORMATTERS } from "types";
import { polyfill } from "es6-promise";
import axios from "axios";
import { changeCountry, changePlace, changeDomain, changeProfession, changeType, changeYearType, changeYears, fetchRankings } from "actions/rankings";
const ENTER_KEY_CODE = 13;
import Rcslider from "rc-slider";

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
    }
    this.changeType = this.props.changeType.bind(this);
    this.changeYearType = this.props.changeYearType.bind(this);
    this.changeYears = this.props.changeYears;
    this.changeCountry = this.props.changeCountry.bind(this);
    this.changePlace = this.props.changePlace.bind(this);
    this.changeDomain = this.props.changeDomain.bind(this);
    this.changeProfession = this.props.changeProfession.bind(this);
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
    // let tempInputYears = this.state.tempInputYears;
    const tempYearStart = e.target.value;
    this.setState({tempYearStart});
    if(e.type === "blur"){
      const sanitizedYear = this.sanitizeYear(tempYearStart);
      this.changeYears([sanitizedYear, years[1]]);
      this.setState({tempYearStart:null});
    }
    //
    // switch(e.type){
    //   case "keydown":
    //     if (e.keyCode === ENTER_KEY_CODE) {
    //       let newYear = this.sanitizeYear(rawYear);
    //       newYear = Math.min(Math.max(newYear, -2000), years.max);
    //       this.changeYears({ min:newYear, max:years.max });
    //       tempInputYears.min = FORMATTERS.year(newYear);
    //       break;
    //     }
    //     tempInputYears.min = rawYear;
    //     break;
    //   case "blur":
    //     let newYear = this.sanitizeYear(rawYear);
    //     newYear = Math.min(Math.max(newYear, -2000), years.max);
    //     this.changeYears({ min:newYear, max:years.max })
    //     tempInputYears.min = FORMATTERS.year(newYear);
    //     break;
    //   default:
    //     tempInputYears.min = rawYear;
    // }
    //
    // this.setState({tempInputYears});
  }

  maxYearKeyDown(e){
    const {years} = this.props.rankings;
    // let tempInputYears = this.state.tempInputYears;
    const tempYearEnd = e.target.value;
    this.setState({tempYearEnd});
    if(e.type === "blur"){
      const sanitizedYear = this.sanitizeYear(tempYearEnd);
      this.changeYears([years[0], sanitizedYear]);
      this.setState({tempYearEnd:null});
    }
    // const {years} = this.props.rankings;
    // let tempInputYears = this.state.tempInputYears;
    // const rawYear = e.target.value;
    //
    // switch(e.type){
    //   case "keydown":
    //     if (e.keyCode === ENTER_KEY_CODE) {
    //       let newYear = this.sanitizeYear(rawYear);
    //       newYear = Math.min(Math.max(newYear, years.min), 2016);
    //       this.changeYears({ min:years.min, max:newYear })
    //       tempInputYears.max = FORMATTERS.year(newYear);
    //       break;
    //     }
    //     tempInputYears.max = rawYear;
    //     break;
    //   case "blur":
    //     let newYear = this.sanitizeYear(rawYear);
    //     newYear = Math.min(Math.max(newYear, years.min), 2016);
    //     this.changeYears({ min:years.min, max:newYear })
    //     tempInputYears.max = FORMATTERS.year(newYear);
    //     break;
    //   default:
    //     tempInputYears.max = rawYear;
    // }
    //
    // this.setState({tempInputYears});
  }

  render() {
    const marks = {
      '-4000': '4000 BC',
      0: <strong>0 AD</strong>,
      2013: '2013',
    };
    const {type, years, country, place, domain, profession} = this.props.rankings;
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
        </section>

        <section className="control-group">
          <h3>Filter Rankings</h3>
          <ul className="flat-options">
            <li><a href="#" id="birthyear" onClick={this.changeYearType} className="active">Births</a></li>
            <li><a href="#" id="deathyear" onClick={this.changeYearType}>Deaths</a></li>
          </ul>


          <h3>Between:</h3>
          <div className="year-inputs">
            <input type="text" id='startYear' value={tempYearStart ? tempYearStart : FORMATTERS.year(years[0])} onChange={minYearKeyDown} onKeyDown={minYearKeyDown} onBlur={minYearKeyDown} />
            <span>and</span>
            <input type="text" id='endYear' value={tempYearEnd ? tempYearEnd : FORMATTERS.year(years[1])} onChange={maxYearKeyDown} onKeyDown={maxYearKeyDown} onBlur={maxYearKeyDown} />
          </div>
          <Rcslider range pushable={1} min={-4000} max={2013} step={1} marks={marks} tipFormatter={(v) => FORMATTERS.year(v)} allowCross={false} onAfterChange={this.changeYears} defaultValue={years} />

          { !["birthcountry", "birthplace"].includes(type) ?
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
        </section>

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

export default connect(mapStateToProps, { fetchRankings, changeType, changeYearType, changeYears, changeCountry, changePlace, changeDomain, changeProfession })(RankingControls);
