import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames/bind';
import styles from 'css/components/about';

const cx = classNames.bind(styles);

const Explore = () => {
  return (
    <div className={cx('explore')}>
      <h1 className={cx('header')}>Explore</h1>
    </div>
  );
};

export default Explore;
