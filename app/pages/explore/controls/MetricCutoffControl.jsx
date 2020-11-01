import React from "react";
import {connect} from "react-redux";
import {HPI_RANGE, LANGS_RANGE} from "types";
import {updateMetricType, updateMetricCutoff} from "actions/vb";

const MetricCutoffControl = ({metricType, updateMetricType, metricCutoff, updateMetricCutoff}) => {
  const metricVals = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

  return (
    <div className="flat-options">
      <ul className="items options flat-options filter">
        <li><a onClick={e => (e.preventDefault(), updateMetricType("hpi"))} href="#" id="hpi" className={metricType === "hpi" ? "active metric" : "metric"}>HPI</a></li>
        <li><a onClick={e => (e.preventDefault(), updateMetricType("l"))} href="#" id="langs" className={metricType === "l" ? "active metric" : "metric"}>L</a></li>
      </ul>
      <span>&gt;</span>
      <select value={metricCutoff} onChange={e => updateMetricCutoff(e.target.value)}>
        {metricVals.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );
};

const mapDispatchToProps = {updateMetricType, updateMetricCutoff};

const mapStateToProps = state => ({
  metricType: state.vb.metricType,
  metricCutoff: state.vb.metricCutoff
});

export default connect(mapStateToProps, mapDispatchToProps)(MetricCutoffControl);
