import React from "react";
import {connect} from "react-redux";
import {updateOnlyShowNew} from "actions/vb";

const OnlyShowNewControl = ({onlyShowNew, updateOnlyShowNew}) =>
  <div className="flat-options">
    <label
      className={onlyShowNew ? "active" : ""}
      htmlFor="onlyNew">Only new biographies (2020)</label>
    <input type="checkbox" id="onlyNew" name="scales" onChange={e => updateOnlyShowNew(e.target.checked)} checked={onlyShowNew} />
  </div>
  ;

const mapDispatchToProps = {updateOnlyShowNew};

const mapStateToProps = state => ({
  onlyShowNew: state.vb.onlyShowNew
});

export default connect(mapStateToProps, mapDispatchToProps)(OnlyShowNewControl);
