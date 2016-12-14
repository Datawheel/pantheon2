import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changePlace } from "actions/explorer";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import ProfessionControl from "components/explore/controls/ProfessionControl";

class VizControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='viz-controls'>
        <YearControl />
        <PlaceControl />
        <ProfessionControl />
      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

export default connect(mapStateToProps, { changePlace })(VizControls);
