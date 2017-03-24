import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {changeViz} from "actions/explore";

class VizControl extends Component {

  constructor(props) {
    super(props);
  }

  changeVizClick(e) {
    e.preventDefault();
    this.props.actions.changeViz(e.target.dataset.viz);
  }

  render() {

    const {type} = this.props.explore.viz;
    const changeVizClick = this.changeVizClick.bind(this);
    const allVizTypes = [
      {id: "Treemap", name: "Tree Map"},
      {id: "StackedArea", name: "Stacked"},
      {id: "LineChart", name: "Line Chart"},
      {id: "Map", name: "Map"},
    ];

    return (
    <div className="filter">
      <h3>Make a</h3>
      <ul className="items options viztype-options">
        {allVizTypes.map(v =>
          <li key={v.id}><h4><a href="#" data-viz={v.id} className={type === v.id ? `active ${v.id.toLowerCase()}` : v.id.toLowerCase()} onClick={changeVizClick}>{v.name}</a></h4></li>
        )}
      </ul>
    </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({changeViz}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VizControl);
