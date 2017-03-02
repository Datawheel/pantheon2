import React, {PropTypes} from "react";
import "css/components/profile/header";
import placeholderBg from "images/profile/test_film.jpg";
import placeholderViz from "images/profile/placeholder_era_viz.png";

const Header = ({era}) => {

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask era">
          <div className="bg-img" style={{backgroundImage: `url(${placeholderBg})`}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production of</p>
        <h2 className="profile-type">Time Period</h2>
        <h1 className="profile-name">Film & Radio Era</h1>
        <h2 className="date-subtitle">{era.name}</h2>
        <pre>
          <img className="sparkline" src={placeholderViz} alt="placeholder era viz" />
        </pre>
      </div>
    </header>
  );
};

Header.propTypes = {
  era: PropTypes.object
};

export default Header;
