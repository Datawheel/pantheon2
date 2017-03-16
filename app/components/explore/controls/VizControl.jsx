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

    const {type} = this.props.explorer.viz;
    const changeVizClick = this.changeVizClick.bind(this);
    const allVizTypes = [
      {id: "Treemap", name: "Tree Map"},
      {id: "StackedArea", name: "Stacked"}
    ];

    return (
      <div>
        <section className="control-group key-group">
          <h3>View As</h3>
          <ul className="options list-options">
          {allVizTypes.map(v =>
            <li key={v.id}><a href="#" data-viz={v.id} className={type === v.id ? "active" : ""} onClick={changeVizClick}>{v.name}</a></li>
          )}
          </ul>
        </section>

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
