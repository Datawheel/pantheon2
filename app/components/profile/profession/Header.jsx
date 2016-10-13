import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';

const Header = ({ profession }) => {

  return (
    <header>
      <div className='info'>
        <p className='topDesc'>Cultural Memory of</p>
        <h2 className='topSubtitle'>Occupation</h2>
        <h1 className='title'>{profession.name}</h1>
        <pre>[VIZ] SPARK LINE HERE</pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  profession: PropTypes.object
};

export default Header;
