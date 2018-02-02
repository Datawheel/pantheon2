import React, {Component} from "react";
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

  changeCutoff = e => {
    // const {metricType} = this.props.explore.metric;
    // const currentFilter = this.state.currentFilter === undefined ? metricType || "" : this.state.currentFilter;
    this.props.changeMetric("metricCutoff", e.target.value);
  }

  changeMetricType = e => {
    e.preventDefault();
    this.props.changeMetric("metricType", e.target.id);
  }

  render() {
    const {metricType, matricCutoff} = this.props;
    // const changeCutoff = this.changeCutoff.bind(this);
    // const currentFilter = this.state.currentFilter === undefined ? metricType || "" : this.state.currentFilter;
    const metricVals = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

    return (
      <div className="flat-options">
        <ul className="items options flat-options filter">
          <li><a onClick={this.changeMetricType} href="#" id="hpi" className={metricType === "hpi" ? "active metric" : "metric"}>HPI</a></li>
          <li><a onClick={this.changeMetricType} href="#" id="langs" className={metricType === "langs" ? "active metric" : "metric"}>L</a></li>
        </ul>
        <span />
        <select value={matricCutoff} onChange={this.changeCutoff}>
          {metricVals.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    );
  }
}

export default AdvancedControl;
