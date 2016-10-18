import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import config from "helmconfig.js";

const About = ({children}) => {
  return (
    <div className="about">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="About Pantheon"
        meta={config.meta}
        link={config.link}
      />
      <h1 className="header">About Pantheon</h1>
      <nav className="subNav" role="navigation">
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
