import React, { Component, PropTypes } from "react";
import { Link } from 'react-router';
import { connect } from "react-redux";
import { changeGrouping } from "actions/explorer";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import OccupationControl from "components/explore/controls/OccupationControl";
import emIconSvg from "images/icon-email.svg";
import fbIconSvg from "images/icon-facebook.svg";
import twIconSvg from "images/icon-twitter.svg";

class VizControls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { grouping } = this.props.explorer;
    const changeGrouping = this.props.changeGrouping.bind(this);

    return (
      <div className='explore-controls viz-explorer'>
        <div className='control-header'>
          <h2 className='viz-explorer'>Visual Explorer</h2>
          <i className='control-hide'></i>
        </div>
        <section className="control-group key-group">
          <h3>Show People Grouped By</h3>
          <select value={grouping} onChange={changeGrouping}>
            <option value="places">Places</option>
            <option value="professions">Professions</option>
          </select>
        </section>
        <section className="control-group">
          <h4>Filter Data by:</h4>
          <ul className="flat-options">
            <li><a href="#" id="birthyear" className="active birthyear">Births</a></li>
            <li><a href="#" id="deathyear" className="deathyear">Deaths</a></li>
          </ul>

          <YearControl />
          <PlaceControl />
          <OccupationControl />
        </section>
        <section className="control-group flat-group">
          <h4>Share</h4>
          <ul className="flat-options">
            <li><Link to="#" className="em"><img src={emIconSvg} alt={`Email this visualization`}/></Link></li>
            <li><Link to="#" className="fb"><img src={fbIconSvg} alt={`Share this visualization on Facebook`}/></Link></li>
            <li><Link to="#" className="tw"><img src={twIconSvg} alt={`Share this visualization on Twitter`}/></Link></li>
          </ul>
        </section>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

export default connect(mapStateToProps, { changeGrouping })(VizControls);
