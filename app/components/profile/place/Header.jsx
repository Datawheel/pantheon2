import React, {PropTypes} from "react";
import styles from "css/components/profile/header";
import sparklineSvg from "images/sparkline.svg";
import placeholderImg from "images/placeholder_place_hero.jpg";
import {FORMATTERS} from "types";

const Header = ({place, country}) => {
  const placeImg = place.img_link ? `/place/${place.id}.jpg` : country.img_link ? `/place/${country.id}.jpg` : placeholderImg;

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask place">
          <div className="bg-img bg-img-t" style={{backgroundImage: `url(${placeImg})`}}></div>
          <div className="bg-img bg-img-b" style={{backgroundImage: `url(${placeImg})`}}></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">Cultural Production in</p>
        <h2 className="profile-type">Present Day</h2>
        <h1 className="profile-name">{place.name}</h1>
        { place.name !== place.country_name ? <p className="date-subtitle"><a href={`/profile/place/${country.slug}`}>{place.country_name}</a></p> : null}
        <p className="date-subtitle">{FORMATTERS.year(country.soverign_date)} - Present</p>
        <pre>
          <img className="sparkline" src={sparklineSvg} alt="Sparkline here" />
        </pre>
      </div>
    </header>
  );
};

Header.propTypes = {
  country: PropTypes.object,
  place: PropTypes.object
};

export default Header;
