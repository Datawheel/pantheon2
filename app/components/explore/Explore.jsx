import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';

const Explore = ({children}) => {
  return (
    <div className='explore-container'>
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Explore"
        meta={config.meta}
        link={config.link}
      />
      {children ? !<h1 className='header'>Explore</h1> : null }
      {children}
    </div>
  );
};

export default Explore;
