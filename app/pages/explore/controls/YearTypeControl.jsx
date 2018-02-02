import React, {Component} from "react";

class YearTypeControl extends Component {

  constructor(props) {
    super(props);
  }

  changeYearType = (newYearType, e) => {
    e.preventDefault();
    this.props.changeYearType("yearType", newYearType);
  }

  render() {
    // const {yearType} = this.props.explore;
    const {yearType} = this.props;

    return (
      <div className="filter">
        <h3>Filtered By</h3>
        <ul className="items options flat-options filter">
          <li><a onClick={e => this.changeYearType("birthyear", e)} href="#" id="birthyear" className={yearType === "birthyear" ? "active birthyear" : "birthyear"}>Births</a></li>
          <li><a onClick={e => this.changeYearType("deathyear", e)} href="#" id="deathyear" className={yearType === "deathyear" ? "active deathyear" : "deathyear"}>Deaths</a></li>
        </ul>
      </div>
    );
  }
}

export default YearTypeControl;
