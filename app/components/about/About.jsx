import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import styles from 'css/components/about';

const About = ({children}) => {
  return (
    <div className="about">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="About Pantheon"
        meta={config.meta}
        link={config.link}
      />
      <nav className="about-nav" role="navigation">
        <ul className='items'>
          <li className='item'>
            <Link to="/about/vision" className='item' activeClassName='active'>Vision</Link>
          </li>
          <li className='item'>
            <Link to="/about/methods" className='item' activeClassName='active'>Methods</Link>
          </li>
          <li className='item'>
            <Link to="/about/team" className='item' activeClassName='active'>Team</Link>
          </li>
          <li className='item'>
            <Link to="/about/publications" className='item' activeClassName='active'>Publications</Link>
          </li>
          <li className='item'>
            <Link to="/about/data_sources" className='item' activeClassName='active'>Data Sources</Link>
          </li>
          <li className='item'>
            <Link to="/about/resources" className='item' activeClassName='active'>Resources</Link>
          </li>
          <li className='item'>
            <Link to="/about/references" className='item' activeClassName='active'>References</Link>
          </li>
          <li className='item'>
            <Link to="/about/contact" className='item' activeClassName='active'>Contact</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default About;
