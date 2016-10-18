import React, { Component, PropTypes } from 'react';
import { polyfill } from 'es6-promise';
import axios from 'axios';
import {connect} from "react-redux";
import { activateSearch } from 'actions/users';
import styles from 'css/components/search';

polyfill();

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      professionResults: [],
      placeResults: [],
      personResults: []
    }
  }

  onChange(e) {
    const userQuery = e.target.value;
    if (userQuery.length < 3) return;
    if (userQuery.length === 0) this.setState({ professionResults:[], placeResults:[], personResults:[] });

    let userQueryCleaned = userQuery.split(" ")
    if(userQueryCleaned.length > 1){
      const lastItem = userQueryCleaned[userQueryCleaned.length-1];
      userQueryCleaned[userQueryCleaned.length-1] = `${lastItem}:*`;
      userQueryCleaned = userQueryCleaned.join("&");
    }
    else {
      userQueryCleaned = userQuery;
    }

    const professionQuery = axios.get(`http://localhost:3100/profession?name=@@.${e.target.value}&select=slug,name,domain`);
    const placeQuery = axios.get(`http://localhost:3100/place?name=@@.${e.target.value}&select=slug,name,country_name`);
    const personQuery = axios.get(`http://localhost:3100/person?name=@@.${userQueryCleaned}&order=langs.desc.nullslast&select=slug,name,profession{id,name},birthcountry{id,name}`);

    Promise.all([professionQuery, placeQuery, personQuery])
      .then((queryResults) => {
        const professionResults = queryResults[0].data;
        const placeResults = queryResults[1].data;
        const personResults = queryResults[2].data;
        this.setState({ professionResults, placeResults, personResults });
      })
  }

  componentDidMount() {
    this._searchInput.focus();
  }

  render() {
    const { activateSearch } = this.props;
    return (
      <div className={'search'}>
        <div className={'search-close'}>
          <i onClick={ activateSearch }>✕</i>
        </div>
        <div className={'search-results'}>
          <div className={'search-result-input'}>
            <input type={'text'} ref={(el) => this._searchInput = el} onChange={this.onChange.bind(this)}/ >
          </div>
          <ul className={'results-list'}>
            {this.state.professionResults.map((result) =>
              <li key={`profession_${result.slug}`} className={'result-profession'}>
                <a href={`/profile/profession/${result.slug}`}>{result.name}</a>
              </li>
            )}
            {this.state.placeResults.map((result) =>
              <li key={`place_${result.slug}`} className={'result-place'}>
                <a href={`/profile/place/${result.slug}`}>{result.name}</a>
                <sub>
                  <span>{result.name !== result.country_name ? result.country_name : null}</span>
                </sub>
              </li>
            )}
            {this.state.personResults.map((result) =>
              <li key={`person_${result.slug}`} className={'result-person'}>
                <a href={`/profile/person/${result.slug}`}>{result.name}</a>
                <sub>
                  <span>{result.profession.name}</span>
                  <span>{result.birthcountry ? result.birthcountry.name : null}</span>
                </sub>
              </li>
            )}
          </ul>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    placeProfile: state.placeProfile
  };
}

export default connect(mapStateToProps, { activateSearch })(Search);
