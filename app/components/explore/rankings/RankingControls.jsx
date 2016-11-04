import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import InputRange from 'react-input-range';
import { FORMATTERS } from 'types';
import { polyfill } from "es6-promise";
import axios from "axios";

polyfill();

class RankingControls extends Component {

  constructor(props) {
    super(props);
    this.rankingType = [
      {id:"person", name:"Person"},
      {id:"birthplace", name:"Birth Place"},
      {id:"deathplace", name:"Death Place"},
      {id:"profession", name:"Profession"},
    ];
    this.state = {
      countries: [],
      places: [],
      domains: [],
      professions: [],
      years: {min:-2000, max:1300}
    }
  }

  changeType(e) {
    const newType = e.target.value;
    this.props.dispatch({
      type: "CHANGE_RANKING_TYPE",
      data: newType
    });
  }

  changeYearsComplete(inputRange, vals) {
    this.props.dispatch({
      type: "CHANGE_RANKING_YEARS",
      data: vals
    });
  }

  changeYears(inputRange, vals) {
    this.setState({
      years: vals,
    });
  }

  changeCountry(e) {
    const countryId = e.target.value;
    const countryCode = e.target.options[e.target.selectedIndex].dataset.countrycode;
    if(countryId !== "all"){
      axios.get(`http://localhost:3100/place?is_country=is.false&country_code=eq.${countryCode}&order=name&select=id,name`)
        .then((res) => {
          this.setState({places: res.data})
        })
    }
    else {
      this.setState({places: []})
    }

    this.props.dispatch({
      type: "CHANGE_RANKING_COUNTRY",
      data: countryId
    });
  }

  changePlace(e) {
    const placeId = e.target.value;
    this.props.dispatch({
      type: "CHANGE_RANKING_PLACE",
      data: placeId
    });
  }

  changeDomain(e) {
    const domainSlug = e.target.value;
    if(domainSlug !== "all"){
      axios.get(`http://localhost:3100/profession?domain_slug=eq.${domainSlug}&order=name&select=id,name`)
        .then((res) => {
          this.setState({professions: res.data})
        })
    }
    else {
      this.setState({professions: []})
    }

    this.props.dispatch({
      type: "CHANGE_RANKING_DOMAIN",
      data: domainSlug
    });
  }

  changeProfession(e) {
    const professionId = e.target.value;
    this.props.dispatch({
      type: "CHANGE_RANKING_PROFESSION",
      data: professionId
    });
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
  }

  render() {
    const {type, country, place, domain, profession} = this.props.rankingControls;
    const {years, countries, places, domains, professions} = this.state;
    const changeType = this.changeType.bind(this);
    const changeYears = this.changeYears.bind(this);
    const changeYearsComplete = this.changeYearsComplete.bind(this);
    const changeCountry = this.changeCountry.bind(this);
    const changePlace = this.changePlace.bind(this);
    const changeDomain = this.changeDomain.bind(this);
    const changeProfession = this.changeProfession.bind(this);

    return (
      <div className='ranking-controls'>

        <h2>Show Top Ranked:</h2>
        <select value={type} onChange={changeType}>
          {this.rankingType.map(rt =>
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          )}
        </select>

        <h2>Years:</h2>
        <input type="text" value={FORMATTERS.year(years.min)} />
        to
        <input type="text" value={FORMATTERS.year(years.max)} />
        <InputRange
          maxValue={2000}
          minValue={-4000}
          value={years}
          formatLabel={v => FORMATTERS.year(v)}
          onChangeComplete={changeYearsComplete}
          onChange={changeYears}
        />

        <h2>Locations:</h2>
        <select value={country} onChange={changeCountry}>
          <option value="all">All</option>
          {countries.map(c =>
            <option key={c.id} value={c.id} data-countrycode={c.country_code}>
              {c.name}
            </option>
          )}
        </select>

        { places.length ?
        <select value={place} onChange={changePlace}>
          <option value="all">All</option>
          {places.map(p =>
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          )}
        </select>
        : null }

        <h2>Profession:</h2>
        <select value={domain} onChange={changeDomain}>
          <option value="all">All</option>
          {domains.map(d =>
            <option key={d.domain_slug} value={d.domain_slug} data-domainslug={d.domain_slug}>
              {d.domain}
            </option>
          )}
        </select>

        { professions.length ?
        <select value={profession} onChange={changeProfession}>
          <option value="all">All</option>
          {professions.map(p =>
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
    rankingControls: state.rankingControls
  };
}

export default connect(mapStateToProps)(RankingControls);
