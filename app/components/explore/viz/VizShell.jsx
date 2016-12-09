import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import styles from "css/components/explore/rankings";
import Viz from "components/viz/Index";
import { updateRankingsTable } from "actions/rankings";
import { fetchAllProfessions } from "actions/profession";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchAllProfessions
  ]

  componentDidMount(){
    this.props.updateRankingsTable();
  }

  render() {
    const {results, type, typeNesting} = this.props.rankings;
    if (results.loading)
      return <div className="viz-shell">loading...</div>
    const {professions} = this.props.professionProfile;

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
    professionProfile: state.professionProfile
  };
}

export default connect(mapStateToProps, {updateRankingsTable})(VizShell);
