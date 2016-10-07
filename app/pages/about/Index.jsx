import React from 'react';
import { Link } from 'react-router';

const About = ({children}) => {
  return (
    <div className={cx('about')}>
      <h1 className={cx('header')}>About Pantheon</h1>
      <nav className={cx('subNav')} role="navigation">
        <Link to="/about/vision" className='item' activeClassName='active'>Vision</Link>
        <Link to="/about/methods" className='item' activeClassName='active'>Methods</Link>
        <Link to="/about/team" className='item' activeClassName='active'>Team</Link>
        <Link to="/about/publications" className='item' activeClassName='active'>Publications</Link>
        <Link to="/about/data_sources" className='item' activeClassName='active'>Data Sources</Link>
        <Link to="/about/resources" className='item' activeClassName='active'>Resources</Link>
        <Link to="/about/references" className='item' activeClassName='active'>References</Link>
        <Link to="/about/contact" className='item' activeClassName='active'>Contact</Link>
      </nav>

      {children}
    </div>
  );
};

export default About;
