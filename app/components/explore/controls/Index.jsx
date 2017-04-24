import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import OccupationControl from "components/explore/controls/OccupationControl";
import ShowControl from "components/explore/controls/ShowControl";
import VizControl from "components/explore/controls/VizControl";
import emIconSvg from "images/icons/icon-email.svg";
import fbIconSvg from "images/icons/icon-facebook.svg";
import twIconSvg from "images/icons/icon-twitter.svg";

class Controls extends Component {

  constructor(props) {
    super(props);
  }

  toggleSidePanel(e) {
    e.preventDefault();
    document.getElementById("side-panel").classList.toggle("hide");
  }

  render() {
    const {page} = this.props.explore;

    return (
      <div className="explore-controls viz-explorer" id="side-panel">
        <div className="control-header">
          <h2 className="viz-explorer"><span className="helper-text">Open&nbsp;</span>{page === "rankings" ? "Rankings" : "Explorer"}<span className="helper-text">&nbsp;Panel</span></h2>
          <i className="control-toggle" onClick={this.toggleSidePanel}></i>
        </div>

        <section className="control-group">
          {page === "viz" ? <VizControl /> : null}
          <ShowControl page={page} />
        </section>

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
            <h3>Filtered by</h3>
            <ul className="items options flat-options filter">
              <li><a href="#" id="birthyear" className="active birthyear">Births</a></li>
              <li><a href="#" id="deathyear" className="deathyear">Deaths</a></li>
            </ul>
          </div>

          <YearControl />
          <PlaceControl />
          <OccupationControl />
        </section>
        <section className="control-group advanced-group">
          <h3>Advanced Options</h3>
          <div className="flat-options">
            <ul className="items options flat-options filter">
              <li><a href="#" id="hpimetric" className="active hpimetric">HPI</a></li>
              <li><a href="#" id="lmetric" className="lmetric">L</a></li>
            </ul>
            <span>></span>
            <select>
              <option>10</option>
              <option selected>15</option>
              <option>20</option>
              <option>25</option>
              <option>30</option>
            </select>
          </div>
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
