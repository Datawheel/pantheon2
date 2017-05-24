import React, {Component} from "react";
import {connect} from "react-redux";
import {changeMetric} from "actions/explore";
import {HPI_RANGE, LANGS_RANGE} from "types";

class AdvancedControl extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  changeCurrentFilter(newFilter, e) {
    e.preventDefault();
    this.setState({currentFilter: newFilter});
  }

  changeCutoff(e) {
    const {metricType} = this.props.explore.metric;
    const currentFilter = this.state.currentFilter === undefined ? metricType || "" : this.state.currentFilter;
    this.props.changeMetric(currentFilter, e.target.value);
  }

  render() {
    const {metricType, cutoff} = this.props.explore.metric;
    const changeCurrentFilter = this.changeCurrentFilter.bind(this);
    const changeCutoff = this.changeCutoff.bind(this);
    const currentFilter = this.state.currentFilter === undefined ? metricType || "" : this.state.currentFilter;
    const metricVals = currentFilter === "hpi" ? HPI_RANGE : LANGS_RANGE;

    return (
      <div className="flat-options">
        <ul className="items options flat-options filter">
          <li><a onClick={e => changeCurrentFilter("hpi", e)} href="#" id="hpimetric" className={currentFilter === "hpi" ? "active metric" : "metric"}>HPI</a></li>
          <li><a onClick={e => changeCurrentFilter("langs", e)} href="#" id="lmetric" className={currentFilter === "langs" ? "active metric" : "metric"}>L</a></li>
        </ul>
        <span>></span>
        <select value={cutoff} onChange={changeCutoff}>
          {metricVals.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  changeMetric: (metricType, cutoff) => {
    dispatch(changeMetric(metricType, cutoff));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedControl);
