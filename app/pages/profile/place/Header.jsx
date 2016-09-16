import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Header = ({ place }) => {

  return (
    <header>
      <p className={cx('description')}>Cultural Production In</p>
      <h2>Present Day</h2>
      <h1>{place.name}</h1>
      <pre>[VIZ] SPARK LINE HERE</pre>
    </header>
  );
}

Header.propTypes = {
  place: PropTypes.object
};

export default Header;
