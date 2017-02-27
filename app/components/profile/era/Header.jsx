import React, {PropTypes} from "react";
import "css/components/profile/header";
import placeholderImg from "images/placeholder_place_hero.jpg";

const Header = ({era}) => {
  const backgroundColor = "#343434",
        backgroundImage = placeholderImg;

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask person" style={{backgroundColor}}>
          <div className="bg-img bg-img-l" style={{backgroundColor, backgroundImage}}></div>
          <div className="bg-img bg-img-r" style={{backgroundColor, backgroundImage}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production of</p>
        <h2 className="profile-type">Era</h2>
        <h1 className="profile-name">{era.name}</h1>
        <pre>
        line plot here...
        </pre>
      </div>
    </header>
  );
};

Header.propTypes = {
  era: PropTypes.object
};

export default Header;
