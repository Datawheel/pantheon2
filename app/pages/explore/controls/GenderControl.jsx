import React from "react";
import {connect} from "react-redux";
import {updateGender} from "actions/vb";

const getClassName = (genderId, genderName, currentGender, loading) => {
  if (genderId === currentGender) {
    if (loading) {
      return `active disabled ${genderName}`;
    }
    return `active ${genderName}`;
  }
  else if (loading) {
    return `disabled ${genderName}`;
  }
  else {
    return genderName;
  }
};

const GenderControl = ({gender, loading, updateGender}) =>
  <div className="filter">
    <h3>Filtered By</h3>
    <ul className="items options flat-options filter">
      <li><a onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateGender(null))} href="#" id="allgender" className={getClassName(null, "allgender", gender, loading)}>All</a></li>
      <li><a onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateGender("F"))} href="#" id="femalegender" className={getClassName("F", "femalegender", gender, loading)}>Females</a></li>
      <li><a onClick={e => loading ? e.preventDefault() : (e.preventDefault(), updateGender("M"))} href="#" id="malegender" className={getClassName("M", "malegender", gender, loading)}>Males</a></li>
    </ul>
  </div>
;

const mapDispatchToProps = {updateGender};

const mapStateToProps = state => ({
  gender: state.vb.gender,
  loading: state.vb.data.loading
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderControl);
