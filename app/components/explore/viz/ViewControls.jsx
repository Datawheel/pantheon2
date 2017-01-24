import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import RankingTableMin from "components/explore/rankings/RankingTableMin";
import VizControl from "components/explore/controls/VizControl";

class ViewControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="view-controls">
        <VizControl />
        <RankingTableMin />
      </div>
    );
  }

}

export default ViewControls;
