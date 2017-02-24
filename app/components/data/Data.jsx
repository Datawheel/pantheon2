import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import styles from "css/components/miscpage";

const Data = ({children}) => {
  return (
    <div className="data">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Data - Pantheon"
        meta={config.meta}
        link={config.link}
      />
      <nav className="page-nav" role="navigation">
        <ul className="page-items">
          <li className="item">
            <Link to="/data/datasets" className="item-link" activeClassName="active">Download</Link>
          </li>
          <li className="item">
            <Link to="/data/api" className="item-link" activeClassName="active">API</Link>
          </li>
          <li className="item">
            <Link to="/data/permissions" className="item-link" activeClassName="active">Permissions</Link>
          </li>
          <li className="item">
            <Link to="/data/faq" className="item-link" activeClassName="active">FAQ</Link>
          </li>
        </ul>
      </nav>
      {children}
    </div>
  );
};

export default Data;
