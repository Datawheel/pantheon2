import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';
import sparklineSvg from 'images/sparkline.svg';
import placeholderImg from 'images/placeholder_place_hero.jpg';

const Header = ({ place }) => {

  return (
    <header className='hero'>
      <div className='bg-container'>
        <div className='bg-img-mask place'>
          <div className='bg-img bg-img-t'>
            <img src={placeholderImg} />
          </div>
          <div className='bg-img bg-img-b'>
            <img src={placeholderImg} />
          </div>
        </div>
      </div>
      <div className='info'>
        <p className='top-desc'>Cultural Production in</p>
        <h2 className='profile-type'>Present Day</h2>
        <h1 className='profile-name'>{place.name}</h1>
        <p className='date-subtitle'>9000 - Present</p>
        <pre>
          <img className='sparkline' src={sparklineSvg} alt={`Sparkline here`} />
        </pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  place: PropTypes.object
};

export default Header;
