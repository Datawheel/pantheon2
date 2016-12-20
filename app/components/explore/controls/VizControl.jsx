import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { changeViz } from "actions/explorer";

class VizControl extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {type} = this.props.explorer.viz;
    const changeViz = this.props.actions.changeViz.bind(this);
    const allVizTypes = [
      {id: "Treemap", name:"Tree Map"},
      {id: "StackedArea", name:"Stacked"}
    ]

    return (
      <div className="filter">
        <h3>Viz Type:</h3>

        <div className="flat-options-w-title">
          <ul className="flat-options">
          {allVizTypes.map(v =>
            <li key={v.id}><a href="#" data-viz={v.id} className={type===v.id ? "active" : ""} onClick={changeViz}>{v.name}</a></li>
          )}
          </ul>
        </div>

      </div>
    );
  }
};


function mapStateToProps(state) {
  return {
    explorer: state.explorer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeViz}, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VizControl);
