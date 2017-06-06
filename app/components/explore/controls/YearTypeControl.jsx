import React, {Component} from "react";
import {connect} from "react-redux";
import {changeYearType} from "actions/explore";

class YearTypeControl extends Component {

  constructor(props) {
    super(props);
  }

  changeYearType(newYearType, e) {
    e.preventDefault();
    this.props.changeYearType(newYearType);
  }

  render() {
    const {yearType} = this.props.explore;
    const changeYearType = this.changeYearType.bind(this);

    return (
      <div className="filter">
        <h3>Filtered By</h3>
        <ul className="items options flat-options filter">
          <li><a onClick={e => changeYearType("birthyear", e)} href="#" id="birthyear" className={yearType === "birthyear" ? "active birthyear" : "birthyear"}>Births</a></li>
          <li><a onClick={e => changeYearType("deathyear", e)} href="#" id="deathyear" className={yearType === "deathyear" ? "active deathyear" : "deathyear"}>Deaths</a></li>
        </ul>
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
  changeYearType: yearType => {
    dispatch(changeYearType(yearType));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(YearTypeControl);
