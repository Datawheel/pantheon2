import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';
import sparklineSvg from 'images/sparkline.svg';
import placeholderImg from 'images/placeholder_prof_hero.jpg';

const Header = ({ profession }) => {

  return (
    <header className='hero'>
      <div className='bg-container'>
        <div className='bg-img-mask profession'>
          <div className='bg-img bg-img-t'>
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
          </div>
          <div className='bg-img bg-img-m'>
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
          </div>
          <div className='bg-img bg-img-b'>
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
            <img src={placeholderImg} />
          </div>
          <div className='bg-img-mask-after'></div>
        </div>
      </div>
      <div className='info'>
        <p className='top-desc'>Cultural Production of</p>
        <h2 className='profile-type'>Occupation</h2>
        <h1 className='profile-name'>{profession.name}</h1>
        <pre>
          <img className='sparkline' src={sparklineSvg} alt={`Sparkline here`} />
        </pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  profession: PropTypes.object
};

export default Header;
