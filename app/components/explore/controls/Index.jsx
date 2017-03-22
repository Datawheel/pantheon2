import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import OccupationControl from "components/explore/controls/OccupationControl";
import ShowControl from "components/explore/controls/ShowControl";
import emIconSvg from "images/icons/icon-email.svg";
import fbIconSvg from "images/icons/icon-facebook.svg";
import twIconSvg from "images/icons/icon-twitter.svg";

class Controls extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {page} = this.props.explore;

    return (
      <div className="explore-controls viz-explorer">
        <div className="control-header">
          <h2 className="viz-explorer">{page === "rankings" ? "Rankings" : "Visual Explorer"}</h2>
          <i className="control-hide"></i>
        </div>

        <ShowControl page={page} />

        <section className="control-group">
          <div className="filter">
            <h3>Filtered By</h3>
            <ul className="items options flat-options filter">
              <li><a href="#" id="femalegender" className="femalegender">Females</a></li>
              <li><a href="#" id="malegender" className="malegender">Males</a></li>
              <li><a href="#" id="allgender" className="active allgender">All</a></li>
            </ul>
          </div>

          <div className="filter">
            <h3>Filtered by years of</h3>
            <ul className="items options flat-options filter">
              <li><a href="#" id="birthyear" className="active birthyear">Birth</a></li>
              <li><a href="#" id="deathyear" className="deathyear">Death</a></li>
            </ul>
          </div>

          <YearControl />
          <PlaceControl />
          <OccupationControl />
        </section>
        <section className="control-group advanced-options">
          <h3>Advanced Options</h3>
        </section>
        <section className="control-group flat-group share-group">
          <h3>Share</h3>
          <ul className="items flat-options">
            <li><Link to="#" className="em"><img src={emIconSvg} alt="Email this visualization"/></Link></li>
            <li><Link to="#" className="fb"><img src={fbIconSvg} alt="Share this visualization on Facebook"/></Link></li>
            <li><Link to="#" className="tw"><img src={twIconSvg} alt="Share this visualization on Twitter"/></Link></li>
          </ul>
        </section>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  explore: state.explore
});

// const mapDispatchToProps = dispatch => ({
//   changeGrouping: e => {
//     const grouping = e.target.value;
//     dispatch(changeGrouping(grouping));
//   }
// });

export default connect(mapStateToProps)(Controls);
