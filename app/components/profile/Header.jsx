import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Header = ({ person }) => {

  return (
    <header>
      <p className={cx('description')}>Cultural Memory of</p>
      <h2>{person.occupation.name}</h2>
      <h1>{person.name}</h1>
      <p>{person.birthyear.name} &mdash; {person.deathyear}</p>
      <pre>[VIZ] SPARK LINE HERE</pre>
    </header>
  );
}

Header.propTypes = {
  person: PropTypes.object
};

export default Header;
