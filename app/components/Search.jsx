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
      results: []
    }
  }

  onChange(e) {
    const userQuery = e.target.value;
    if (userQuery.length < 3) return;
    if (userQuery.length === 0) this.setState({ professionResults:[], placeResults:[], personResults:[] });

    let userQueryCleaned = userQuery.split(" ")
    // if(userQueryCleaned.length > 1){
    //   const lastItem = userQueryCleaned[userQueryCleaned.length-1];
    //   userQueryCleaned[userQueryCleaned.length-1] = `${lastItem}:*`;
    //   userQueryCleaned = userQueryCleaned.join("%26");
    // }
    // else {
    //   userQueryCleaned = userQuery;
    // }
    const lastItem = userQueryCleaned[userQueryCleaned.length-1];
    userQueryCleaned[userQueryCleaned.length-1] = `${lastItem}:*`;
    userQueryCleaned = userQueryCleaned.join("%26");

    const searchQuery = axios.get(`http://localhost:3100/search?document=@@.${userQueryCleaned}&order=weight.desc.nullslast&limit=100`);

    Promise.all([searchQuery])
      .then((queryResults) => {
        const results = queryResults[0].data;
        this.setState({ results });
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
            {this.state.results.map((result) =>
              <li key={`person_${result.slug}`} className={'result-person'}>
                <a href={`/profile/${result.profile_type}/${result.slug}`}>{result.name}</a>
                <sub>
                  {result.primary_meta ? <span>{result.primary_meta}</span> : null}
                  {result.secondary_meta ? <span>{result.secondary_meta}</span> : null}
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
