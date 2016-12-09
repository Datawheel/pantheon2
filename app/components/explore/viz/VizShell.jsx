import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import styles from "css/components/explore/rankings";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="viz-shell">
        <h2>Most Globally Remembered People</h2>
        <div>
        viz will go here...
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    rankings: state.rankings
  };
}

export default connect(mapStateToProps)(VizShell);
