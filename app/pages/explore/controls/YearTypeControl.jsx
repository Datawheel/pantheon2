import React from "react";
import {connect} from "react-redux";
import {updateYearType} from "actions/vb";

const YearTypeControl = ({yearType, updateYearType}) => {
    return (
      <div className="filter">
        <h3>Filtered By</h3>
        <ul className="items options flat-options filter">
          <li><a onClick={e => (e.preventDefault(), this.changeYearType("birthyear"))} href="#" id="birthyear" className={yearType === "birthyear" ? "active birthyear" : "birthyear"}>Births</a></li>
          <li><a onClick={e => (e.preventDefault(), this.changeYearType("deathyear"))} href="#" id="deathyear" className={yearType === "deathyear" ? "active deathyear" : "deathyear"}>Deaths</a></li>
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = {updateYearType};

const mapStateToProps = state => ({
  yearType: state.vb.yearType
});

export default connect(mapStateToProps, mapDispatchToProps)(YearTypeControl);
