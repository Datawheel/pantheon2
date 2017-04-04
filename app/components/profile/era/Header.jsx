import React, {PropTypes} from "react";
import "css/components/profile/header";
import placeholderViz from "images/profile/placeholder_era_viz.png";
import {FORMATTERS} from "types";

const Header = ({era}) =>
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask era">
          <div className="bg-img" style={{backgroundImage: `url(/era/${era.id}.jpg)`}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production of</p>
        <h2 className="profile-type">Time Period</h2>
        <h1 className="profile-name">{era.name}</h1>
        <h2 className="date-subtitle">{FORMATTERS.year(era.start_year)} - {FORMATTERS.year(era.end_year)}</h2>
      </div>
    </header>
  ;

Header.propTypes = {
  era: PropTypes.object
};

export default Header;
