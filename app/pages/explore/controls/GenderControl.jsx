import React from "react";
import {connect} from "react-redux";
import {updateGender} from "actions/vb";

const GenderControl = ({gender, updateGender}) =>
  <div className="filter">
    <h3>Filtered By</h3>
    <ul className="items options flat-options filter">
      <li><a onClick={e => (e.preventDefault(), updateGender(null))} href="#" id="allgender" className={gender === null ? "active allgender" : "allgender"}>All</a></li>
      <li><a onClick={e => (e.preventDefault(), updateGender("F"))} href="#" id="femalegender" className={gender === "F" ? "active femalegender" : "femalegender"}>Females</a></li>
      <li><a onClick={e => (e.preventDefault(), updateGender("M"))} href="#" id="malegender" className={gender === "M" ? "active malegender" : "malegender"}>Males</a></li>
    </ul>
  </div>
;

const mapDispatchToProps = {updateGender};

const mapStateToProps = state => ({
  gender: state.vb.gender
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderControl);
