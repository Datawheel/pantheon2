import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {changeViz} from "actions/explorer";

class VizControl extends Component {

  constructor(props) {
    super(props);
  }

  changeVizClick(e) {
    e.preventDefault();
    this.props.actions.changeViz(e.target.dataset.viz);
  }

  render() {

    const {type} = this.props.explorer.viz;
    const changeVizClick = this.changeVizClick.bind(this);
    const allVizTypes = [
      {id: "Treemap", name: "Tree Map"},
      {id: "StackedArea", name: "Stacked"}
    ];

    return (
      <div className="filter">
        <h3>Viz Type:</h3>

        <div className="flat-options-w-title">
          <ul className="flat-options">
          {allVizTypes.map(v =>
            <li key={v.id}><a href="#" data-viz={v.id} className={type === v.id ? "active" : ""} onClick={changeVizClick}>{v.name}</a></li>
          )}
          </ul>
        </div>

      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeViz}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VizControl);
