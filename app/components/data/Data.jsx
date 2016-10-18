import React from "react";
import { Link } from "react-router";
import Helmet from "react-helmet";
import config from 'helmconfig.js';

const Data = ({children}) => {
  return (
    <div className='data'>
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Data"
        meta={config.meta}
        link={config.link}
      />
      <h1 className='header'>Data</h1>

      {children}
    </div>
  );
};

export default Data;
