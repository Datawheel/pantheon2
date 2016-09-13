import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames/bind';
import styles from 'css/components/about';

const cx = classNames.bind(styles);

const About = ({children}) => {
  return (
    <div className={cx('about')}>
      <h1 className={cx('header')}>About Pantheon</h1>
      <nav className={cx('subNav')} role="navigation">
        <Link to="/about/vision" className={cx('item')} activeClassName={cx('active')}>Vision</Link>
        <Link to="/about/methods" className={cx('item')} activeClassName={cx('active')}>Methods</Link>
        <Link to="/about/team" className={cx('item')} activeClassName={cx('active')}>Team</Link>
        <Link to="/about/publications" className={cx('item')} activeClassName={cx('active')}>Publications</Link>
        <Link to="/about/data_sources" className={cx('item')} activeClassName={cx('active')}>Data Sources</Link>
        <Link to="/about/resources" className={cx('item')} activeClassName={cx('active')}>Resources</Link>
        <Link to="/about/references" className={cx('item')} activeClassName={cx('active')}>References</Link>
        <Link to="/about/contact" className={cx('item')} activeClassName={cx('active')}>Contact</Link>
      </nav>

      {children}
    </div>
  );
};

export default About;
