import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Header = ({ domain }) => {

  return (
    <header>
      <p className={cx('description')}>Cultural Production Of</p>
      <h2>Occupation</h2>
      <h1>{domain.name}</h1>
      <pre>[VIZ] SPARK LINE HERE</pre>
    </header>
  );
}

Header.propTypes = {
  domain: PropTypes.object
};

export default Header;
