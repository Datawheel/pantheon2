import React from "react";
import { connect } from "react-redux";
import { updateOnlyShowNew } from "actions/vb";

const OnlyShowNewControl = ({ loading, onlyShowNew, updateOnlyShowNew }) => (
  <div className="flat-options">
    <label
      disabled={loading}
      className={onlyShowNew ? "active" : ""}
      htmlFor="onlyNew"
    >
      Only new biographies (2022)
    </label>
    <input
      disabled={loading}
      type="checkbox"
      id="onlyNew"
      name="scales"
      onChange={(e) => updateOnlyShowNew(e.target.checked)}
      checked={onlyShowNew}
    />
  </div>
);
const mapDispatchToProps = { updateOnlyShowNew };

const mapStateToProps = (state) => ({
  loading: state.vb.data.loading,
  onlyShowNew: state.vb.onlyShowNew,
});

export default connect(mapStateToProps, mapDispatchToProps)(OnlyShowNewControl);
