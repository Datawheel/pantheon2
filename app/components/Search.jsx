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

    const professionQuery = axios.get(`http://localhost:3100/profession?name=@@.${e.target.value}`);
    const placeQuery = axios.get(`http://localhost:3100/place?name=@@.${e.target.value}`);
    const personQuery = axios.get(`http://localhost:3100/person?name=@@.${e.target.value}&order=langs.desc.nullslast`);

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
      <div className='search'>
        <div className='search-close'>
          <div onClick={ activateSearch }>X</div>
        </div>
        <input type="text" ref={(el) => this._searchInput = el} onChange={this.onChange.bind(this)}/ >
        <ul>
          {this.state.professionResults.map((result) =>
            <li key={`profession_${result.slug}`}>
              <a href={`/profile/profession/${result.slug}`}>{result.name}</a>
            </li>
          )}
          {this.state.placeResults.map((result) =>
            <li key={`place_${result.slug}`}>
              <a href={`/profile/place/${result.slug}`}>{result.name}</a>
            </li>
          )}
          {this.state.personResults.map((result) =>
            <li key={`person_${result.slug}`}>
              <a href={`/profile/person/${result.slug}`}>{result.name}</a>
            </li>
          )}
        </ul>
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
