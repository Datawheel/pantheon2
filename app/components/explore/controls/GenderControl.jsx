import React, {Component} from "react";
import {connect} from "react-redux";
import {changeGender} from "actions/explore";

class GenderControl extends Component {

  constructor(props) {
    super(props);
  }

  changeCurrentGender(newGender, e) {
    e.preventDefault();
    this.props.changeGender(newGender);
  }

  render() {
    const {gender} = this.props.explore;
    const changeCurrentGender = this.changeCurrentGender.bind(this);

    return (
      <div className="filter">
        <h3>Filtered By</h3>
        <ul className="items options flat-options filter">
          <li><a onClick={e => changeCurrentGender(null, e)} href="#" id="allgender" className={gender === null ? "active allgender" : "allgender"}>All</a></li>
          <li><a onClick={e => changeCurrentGender(false, e)} href="#" id="femalegender" className={gender === false ? "active femalegender" : "femalegender"}>Females</a></li>
          <li><a onClick={e => changeCurrentGender(true, e)} href="#" id="malegender" className={gender === true ? "active malegender" : "malegender"}>Males</a></li>
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
  changeGender: gender => {
    dispatch(changeGender(gender));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderControl);
