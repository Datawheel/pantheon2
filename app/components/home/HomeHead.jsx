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
    <h3>Mapping Cultural Memory</h3>
    <div className="home-head-content">
      <div className="post">
        <p><strong>Pantheon</strong> is an <a href="https://www.media.mit.edu/projects/pantheon-new/overview/" target="_blank">MIT Media Lab</a> research project celebrating the development of collective learning that endows our species with fantastic capacities. How has <HelpText text="cultural memory" msg="Defined as the accumulation of globally relevant historical characters." /> changed with the introduction of each of these <strong>Communication Technologies</strong>?</p>
      </div>
      <div className="home-search">
        <img src={searchSvg} alt="Search" />
        <a onClick={activateSearch}>Search people, places, & occupations</a>
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
