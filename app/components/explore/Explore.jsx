import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';
// import Meta from 'components/Meta';

const Explore = () => {
  return (
    <div className='explore'>
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="EXPLORE"
        meta={config.meta}
        link={config.link}
      />
      <h1 className='header'>Explore</h1>
    </div>
  );
};

export default Explore;
