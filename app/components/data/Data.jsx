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
      {children}
    </div>
  );
};

export default Data;
