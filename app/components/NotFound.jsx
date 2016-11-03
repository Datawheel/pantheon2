import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';

const NotFound = ({children}) => {
  return (
    <div className='not-found'>
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Erorr 404"
        meta={config.meta}
        link={config.link}
      />
      <h1>Error (404): Page Not Found</h1>
      <img src="https://media.giphy.com/media/10bKPDUM5H7m7u/giphy.gif" />
    </div>
  );
};

export default NotFound;
