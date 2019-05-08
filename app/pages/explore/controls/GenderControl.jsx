import React, {Component} from "react";

class GenderControl extends Component {

  constructor(props) {
    super(props);
  }

  changeCurrentGender = (newGender, e) => {
    e.preventDefault();
    this.props.changeGender("gender", newGender);
  }

  render() {
    const {gender} = this.props;

    return (
      <div className="filter">
        <h3>Filtered By</h3>
        <ul className="items options flat-options filter">
          <li><a onClick={e => this.changeCurrentGender(null, e)} href="#" id="allgender" className={gender === null ? "active allgender" : "allgender"}>All</a></li>
          <li><a onClick={e => this.changeCurrentGender("F", e)} href="#" id="femalegender" className={gender === "F" ? "active femalegender" : "femalegender"}>Females</a></li>
          <li><a onClick={e => this.changeCurrentGender("M", e)} href="#" id="malegender" className={gender === "M" ? "active malegender" : "malegender"}>Males</a></li>
        </ul>
      </div>
    );
  }
}

export default GenderControl;
