import React, {Component} from "react";
import {FORMATTERS} from "types";
import {connect} from "react-redux";
import {updateYears, updateYearType} from "actions/vb";

const ENTER_KEY_CODE = 13;
const MAX_ALLOWED_YEAR = new Date().getFullYear();

class YearControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tempYearStart: null,
      tempYearEnd: null
    };
    // this.changeYears = this.props.changeYears;
  }

  sanitizeYear = yr => {
    const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
    if (yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr, 10) < 0) {
      return yearAsNumber * -1;
    }
    return yearAsNumber;
  }

  yearChange = e => {
    // const {years} = this.props.explore;
    const {years} = this.props;
    const tempYear = e.target.value;
    const tempYearKey = e.target.id.includes("end") ? "tempYearEnd" : "tempYearStart";
    this.setState({[tempYearKey]: tempYear});
    if (e.type === "blur" || e.type === "keydown" && e.keyCode === ENTER_KEY_CODE) {
      let sanitizedYear = this.sanitizeYear(tempYear);
      if (e.target.id.includes("end")) {
        sanitizedYear = Math.min(Math.max(sanitizedYear, years[0]), MAX_ALLOWED_YEAR);
        if (sanitizedYear !== years[1]) {
          this.props.updateYears([years[0], sanitizedYear]);
        }
      }
      else {
        sanitizedYear = Math.min(Math.max(sanitizedYear, -4000), years[1]);
        if (sanitizedYear !== years[0]) {
          this.props.updateYears([sanitizedYear, years[1]]);
        }
      }
      this.setState({[tempYearKey]: null});
    }
  }

  // componentWillMount() {
  //   const {years} = this.props;
  //   if (years) {
  //     this.changeYears(years, false);
  //   }
  // }

  changeYearType = (newYearType, e) => {
    e.preventDefault();
    this.props.updateYearType(newYearType);
  }

  render() {
    // const timelineMarks = {
    //   "-4000": "4000 BC",
    //   "0": <strong>0 AD</strong>,
    //   "2013": "2013"
    // };
    // const {years} = this.props.explore;
    const {years, yearType} = this.props;
    const {tempYearStart, tempYearEnd} = this.state;

    return (
      <div className="year-control filter">
        <ul className="items options flat-options filter">
          <li><a onClick={e => this.changeYearType("birthyear", e)} href="#" id="birthyear" className={yearType === "birthyear" ? "active birthyear" : "birthyear"}>Born</a></li>
          <li><a onClick={e => this.changeYearType("deathyear", e)} href="#" id="deathyear" className={yearType === "deathyear" ? "active deathyear" : "deathyear"}>Died</a></li>
        </ul>
        <div className="year-inputs">
          <input type="text" id="startYear" value={tempYearStart !== null && !tempYearEnd ? tempYearStart : FORMATTERS.year(years[0])} onChange={this.yearChange} onKeyDown={this.yearChange} onBlur={this.yearChange} />
          <span>and</span>
          <input type="text" id="endYear" value={!tempYearStart && tempYearEnd !== null ? tempYearEnd : FORMATTERS.year(years[1])} onChange={this.yearChange} onKeyDown={this.yearChange} onBlur={this.yearChange} />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {updateYearType, updateYears};

const mapStateToProps = state => ({
  yearType: state.vb.yearType,
  years: state.vb.years
});

export default connect(mapStateToProps, mapDispatchToProps)(YearControl);
