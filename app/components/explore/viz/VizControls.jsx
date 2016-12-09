import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import { polyfill } from "es6-promise";
import Rcslider from "rc-slider";
import { changeCountry, changePlace, changeDomain, changeProfession, changeType, changeTypeNesting, changeYearType, changeYears, fetchRankings } from "actions/rankings";
import YearControl from "components/explore/controls/YearControl";
import apiClient from 'apiconfig';

class VizControls extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
  }

  render() {

    return (
      <div className='viz-controls'>
        <YearControl />
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps)(VizControls);
