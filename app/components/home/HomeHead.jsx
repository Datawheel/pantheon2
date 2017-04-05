import React, {PropTypes} from "react";
import {connect} from "react-redux";
import {activateSearch} from "actions/nav";
import "css/components/home/homehead";
import searchSvg from "images/icons/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";

const HomeHead = ({activateSearch}) =>
  <div className="home-head">
    <h1><img src={pantheonLogoSvg} alt="Pantheon" /></h1>
    <h3>Mapping Cultural Memory</h3>
    <div className="home-search">
      <img src={searchSvg} alt="Search" />
      <a onClick={activateSearch}>Start a search</a>
    </div>
  </div>
  ;

HomeHead.propTypes = {
  activateSearch: PropTypes.func.isRequired
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {activateSearch})(HomeHead);
