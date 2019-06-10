import React from "react";
import {Link} from "react-router";
import Helmet from "react-helmet";

import "pages/about/Misc.css";
import "pages/about/About.css";

const About = ({children}) =>
  <div className="about-page">
    <Helmet title="About Pantheon" />
    <nav className="page-nav" role="navigation">
      <ul className="page-items">
        <li className="item">
          <Link to="/about/vision" className="item-link" activeClassName="is-active">Vision</Link>
        </li>
        <li className="item">
          <Link to="/about/methods" className="item-link" activeClassName="is-active">Methods</Link>
        </li>
        <li className="item">
          <Link to="/about/team" className="item-link" activeClassName="is-active">Team</Link>
        </li>
        <li className="item">
          <Link to="/about/publications" className="item-link" activeClassName="is-active">Publications</Link>
        </li>
        <li className="item">
          <Link to="/about/data_sources" className="item-link" activeClassName="is-active">Data Sources</Link>
        </li>
        <li className="item">
          <Link to="/about/contact" className="item-link" activeClassName="is-active">Contact</Link>
        </li>
      </ul>
    </nav>
    {children}
  </div>;

export default About;
