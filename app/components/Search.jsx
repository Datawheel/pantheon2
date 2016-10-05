import React, { Component, PropTypes } from 'react';
import { polyfill } from 'es6-promise';
import axios from 'axios';
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from 'css/components/search';

const cx = classNames.bind(styles);

polyfill();

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      domainResults: [],
      placeResults: [],
      personResults: []
    }
  }

  onChange(e) {
    const userQuery = e.target.value;
    if (userQuery.length < 3) return;
    if (userQuery.length === 0) this.setState({ domainResults:[], placeResults:[], personResults:[] });

    const domainQuery = axios.get(`http://localhost:3100/occupation?name=@@.${e.target.value}`);
    const placeQuery = axios.get(`http://localhost:3100/place?name=@@.${e.target.value}`);
    const personQuery = axios.get(`http://localhost:3100/person?name=@@.${e.target.value}&order=langs.desc.nullslast`);

    Promise.all([domainQuery, placeQuery, personQuery])
      .then((queryResults) => {
        const domainResults = queryResults[0].data;
        const placeResults = queryResults[1].data;
        const personResults = queryResults[2].data;
        this.setState({ domainResults, placeResults, personResults });
      })
  }

  render() {
    return (
      <div className={cx('search')}>
        <input type="text" onChange={this.onChange.bind(this)}/ >
        <ul>
          {this.state.domainResults.map((result) =>
            <li>
              <a href={`/profile/domain/${result.slug}`}>{result.name}</a>
            </li>
          )}
          {this.state.placeResults.map((result) =>
            <li>
              <a href={`/profile/place/${result.slug}`}>{result.name}</a>
            </li>
          )}
          {this.state.personResults.map((result) =>
            <li>
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

export default connect(mapStateToProps)(Search);
