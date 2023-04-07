import React from "react";
import {connect} from "react-redux";
import {HPI_RANGE, LANGS_RANGE} from "types";
import {updateMetricType, updateMetricCutoff} from "actions/vb";

const MetricCutoffControl = ({loading, metricType, updateMetricType, metricCutoff, updateMetricCutoff}) => {
  const metricVals = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;

  return (
    <div className="flat-options">
      <ul className="items options flat-options filter">
        <li><a onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateMetricType("hpi"))} href="#" id="hpi" className={`${loading ? "disabled" : ""} ${metricType === "hpi" ? "active" : ""} metric`}>HPI</a></li>
        <li><a onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateMetricType("l"))} href="#" id="langs" className={`${loading ? "disabled" : ""} ${metricType === "l" ? "active" : ""} metric`}>L</a></li>
      </ul>
      <span>&gt;</span>
      <select disabled={loading} value={metricCutoff} onChange={e => updateMetricCutoff(e.target.value)}>
        {metricVals.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
    </div>
  );
};

const mapDispatchToProps = {updateMetricType, updateMetricCutoff};

const mapStateToProps = state => ({
  loading: state.vb.data.loading,
  metricType: state.vb.metricType,
  metricCutoff: state.vb.metricCutoff
});

export default connect(mapStateToProps, mapDispatchToProps)(MetricCutoffControl);
