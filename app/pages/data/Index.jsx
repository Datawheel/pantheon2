import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames/bind';
import styles from 'css/components/about';

const cx = classNames.bind(styles);

const Data = ({children}) => {
  return (
    <div className={cx('data')}>
      <h1 className={cx('header')}>Data</h1>
      <nav className={cx('subNav')} role="navigation">
        <Link to="/data/datasets" className={cx('item')} activeClassName={cx('active')}>Datasets</Link>
        <Link to="/data/api" className={cx('item')} activeClassName={cx('active')}>API</Link>
        <Link to="/data/permissions" className={cx('item')} activeClassName={cx('active')}>Permissions</Link>
        <Link to="/data/faq" className={cx('item')} activeClassName={cx('active')}>FAQ</Link>
      </nav>

      {children}
    </div>
  );
};

export default Data;
