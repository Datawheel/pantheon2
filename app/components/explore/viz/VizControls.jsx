import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changeGrouping } from "actions/explorer";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import ProfessionControl from "components/explore/controls/ProfessionControl";

class VizControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { grouping } = this.props.explorer;
    const changeGrouping = this.props.changeGrouping.bind(this);

    return (
      <div className='viz-controls'>
        <div className="filter">
          <h3>Showing individuals grouped by:</h3>
          <select value={grouping} onChange={changeGrouping}>
            <option value="places">Places</option>
            <option value="professions">Professions</option>
          </select>
        </div>
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

export default connect(mapStateToProps, { changeGrouping })(VizControls);
