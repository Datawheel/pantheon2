import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import styles from "css/components/explore/rankings";
import Viz from "components/viz/Index";
import { updateRankingsTable } from "actions/rankings";
import { fetchAllPlaces } from "actions/explorer";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchAllPlaces
  ]

  componentDidMount(){
  }

  render() {
    return (
      <div className="viz-shell">
        <h2>Most Globally Remembered People</h2>
        <div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings,
    explorer: state.explorer
  };
}

export default connect(mapStateToProps, {updateRankingsTable})(VizShell);
