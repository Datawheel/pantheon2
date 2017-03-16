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
    const {page} = this.props;

    return (
      <div className="explore-controls viz-explorer">
        <div className="control-header">
          <h2 className="viz-explorer">{page === "rankings" ? "Rankings" : "Visual Explorer"}</h2>
          <i className="control-hide"></i>
        </div>

        <ShowControl page={page} />

        <section className="control-group">
          <h4>Filter Data by</h4>
          <ul className="options flat-options">
            <li><a href="#" id="birthyear" className="active birthyear">Births</a></li>
            <li><a href="#" id="deathyear" className="deathyear">Deaths</a></li>
          </ul>

          <YearControl />
          <PlaceControl />
          <OccupationControl />
        </section>
        <section className="control-group advanced-options">
          <h4>Advanced Options</h4>
        </section>
        <section className="control-group flat-group share-group">
          <h4>Share</h4>
          <ul className="options flat-options">
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
