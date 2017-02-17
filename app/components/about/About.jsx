import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import styles from "css/components/miscpage";

const About = ({children}) => {
  return (
    <div className="about">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="About Pantheon"
        meta={config.meta}
        link={config.link}
      />
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          <li className="item">
            <Link to="/about/vision" className="item-link" activeClassName="active">Vision</Link>
          </li>
          <li className="item">
            <Link to="/about/methods" className="item-link" activeClassName="active">Methods</Link>
          </li>
          <li className="item">
            <Link to="/about/team" className="item-link" activeClassName="active">Team</Link>
          </li>
          <li className="item">
            <Link to="/about/publications" className="item-link" activeClassName="active">Publications</Link>
          </li>
          <li className="item">
            <Link to="/about/data_sources" className="item-link" activeClassName="active">Data Sources</Link>
          </li>
          <li className="item">
            <Link to="/about/resources" className="item-link" activeClassName="active">Resources</Link>
          </li>
          <li className="item">
            <Link to="/about/references" className="item-link" activeClassName="active">References</Link>
          </li>
          <li className="item">
            <Link to="/about/contact" className="item-link" activeClassName="active">Contact</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default About;
