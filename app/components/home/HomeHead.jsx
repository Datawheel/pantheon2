import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {activateSearch} from "actions/nav";
import "css/components/home/homehead";
import HelpText from "components/utils/HelpText";
import searchSvg from "images/icons/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";

const HomeHead = ({activateSearch}) =>
  <div className="home-head">
    <h1><img src={pantheonLogoSvg} alt="Pantheon" /></h1>
    <div className="home-head-content">
      <div className="home-search">
        <img src={searchSvg} alt="Search" />
        <a onClick={activateSearch}>Search people, places, & occupations</a>
      </div>
      <div className="post">
        <p><strong>Pantheon</strong> is a dataset, visualization tool,
        and research effort, that enables you to explore human collective
        memory. <strong>Pantheon</strong> gathers information on nearly 50,000 biographies to
        help you understand the <a href="/profile/place">places</a>, <a href="/profile/person">people</a>, <a href="/profile/occupation">occupations</a> and <a href="/profile/era">eras</a>,
        of human collective memory.</p>
      </div>
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
