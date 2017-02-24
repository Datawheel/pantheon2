import React, {Component} from "react";
import {connect} from "react-redux";
import {FORMATTERS} from "types";
import {Range} from "rc-slider";
import {changeYears} from "actions/explorer";

const ENTER_KEY_CODE = 13;

class YearControl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tempYearStart: null,
      tempYearEnd: null
    };
    this.changeYears = this.props.changeYears;
  }

  sanitizeYear(yr) {
    const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
    if (yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr, 10) < 0) {
      return yearAsNumber * -1;
    }
    return yearAsNumber;
  }

  yearChange(e) {
    const {years} = this.props.explorer;
    const tempYear = e.target.value;
    const tempYearKey = e.target.id.includes("end") ? "tempYearEnd" : "tempYearStart";
    this.setState({[tempYearKey]: tempYear});
    if (e.type === "blur" || (e.type === "keydown" && e.keyCode === ENTER_KEY_CODE)) {
      let sanitizedYear = this.sanitizeYear(tempYear);
      if (e.target.id.includes("end")) {
        sanitizedYear = Math.min(Math.max(sanitizedYear, years[0]), 2013);
        this.changeYears([years[0], sanitizedYear]);
      }
      else {
        sanitizedYear = Math.min(Math.max(sanitizedYear, -4000), years[1]);
        this.changeYears([sanitizedYear, years[1]]);
      }
      this.setState({[tempYearKey]: null});
    }
  }

  render() {
    const timelineMarks = {
      "-4000": "4000 BC",
      "0": <strong>0 AD</strong>,
      "2013": "2013"
    };
    const {years} = this.props.explorer;
    const {tempYearStart, tempYearEnd} = this.state;
    const yearChange = this.yearChange.bind(this);

    return (
      <div className="year-control">
        <h3>Between:</h3>
        <div className="year-inputs">
          <input type="text" id="startYear" value={tempYearStart !== null && !tempYearEnd ? tempYearStart : FORMATTERS.year(years[0])} onChange={yearChange} onKeyDown={yearChange} onBlur={yearChange} />
          <span>and</span>
          <input type="text" id="endYear" value={!tempYearStart && tempYearEnd !== null ? tempYearEnd : FORMATTERS.year(years[1])} onChange={yearChange} onKeyDown={yearChange} onBlur={yearChange} />
        </div>
        <Range
          pushable={1}
          min={-4000}
          max={2013}
          step={1}
          marks={timelineMarks}
          tipFormatter={v => FORMATTERS.year(v)} allowCross={false}
          onChange={v => { this.setState({tempYearStart: v[0], tempYearEnd: v[1]}); } }
          onAfterChange={v => { this.setState({tempYearStart: null, tempYearEnd: null}); this.changeYears(v); } }
          value={tempYearStart && tempYearEnd ? [tempYearStart, tempYearEnd] : years}
          defaultValue={years} />
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

export default connect(mapStateToProps, {changeYears})(YearControl);
