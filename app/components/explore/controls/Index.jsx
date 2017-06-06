import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import YearControl from "components/explore/controls/YearControl";
import PlaceControl from "components/explore/controls/PlaceControl";
import OccupationControl from "components/explore/controls/OccupationControl";
import ShowControl from "components/explore/controls/ShowControl";
import VizControl from "components/explore/controls/VizControl";
import AdvancedControl from "components/explore/controls/AdvancedControl";
import GenderControl from "components/explore/controls/GenderControl";
import YearTypeControl from "components/explore/controls/YearTypeControl";
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
    const evt = window.document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }

  render() {
    const {page} = this.props.explore;

    return (
      <div className="explore-controls viz-explorer" id="side-panel">
        <div className="control-header">
          <h2 className="viz-explorer"><span className="helper-text">Open&nbsp;</span>{page === "rankings" ? "Rankings" : "Visualizations"}<span className="helper-text">&nbsp;Panel</span></h2>
          <i className="control-toggle" onClick={this.toggleSidePanel}></i>
        </div>

        <section className="control-group main-selector">
          {page === "viz" ? <VizControl /> : null}
          <ShowControl page={page} />
        </section>

        <section className="control-group">
          <GenderControl />
          <YearTypeControl />
          <YearControl />
          <PlaceControl />
          <OccupationControl />
        </section>
        <section className="control-group advanced-group">
          <h3>Advanced Options</h3>
          <AdvancedControl />
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
