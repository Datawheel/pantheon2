import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/header';

const Header = ({ place }) => {

  return (
    <header>
      <div className='info'>
        <p className='topDesc'>Cultural Memory of</p>
        <h2 className='topSubtitle'>Present Day</h2>
        <h1 className='title'>{place.name}</h1>
        <pre>[VIZ] SPARK LINE HERE</pre>
      </div>
    </header>
  );
}

Header.propTypes = {
  place: PropTypes.object
};

export default Header;