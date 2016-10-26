import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';

const Rankings = () => {
  return (
    <div className='rankings'>
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Rankings"
        meta={config.meta}
        link={config.link}
      />
      <h1 className='header'>Rankings</h1>
    </div>
  );
};

export default Rankings;
