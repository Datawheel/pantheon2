import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { changeGrouping } from "actions/explorer";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import ProfessionControl from "components/explore/controls/ProfessionControl";
import VizControl from "components/explore/controls/VizControl";

class VizControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { grouping } = this.props.explorer;
    const changeGrouping = this.props.changeGrouping.bind(this);

    return (
      <div className='explore-controls data-explorer'>
        <div className='control-header'>
          <h2 className='data-explorer'>Data Explorer</h2>
          <i className='control-hide'></i>
        </div>
        <section className="control-group">
          <h3>Showing individuals grouped by:</h3>
          <select value={grouping} onChange={changeGrouping}>
            <option value="places">Places</option>
            <option value="professions">Professions</option>
          </select>
        </section>
        <section className="control-group">
          <YearControl />
          <PlaceControl />
          <ProfessionControl />
          <VizControl />
        </section>
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
