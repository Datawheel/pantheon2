import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';
import styles from "css/components/explore/rankings";
import ExploreControls from "components/explore/ExploreControls";
import VizShell from "components/explore/viz/VizShell";

const Viz = ({children}) => {
  return (
    <div className="rankings">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Viz Explorer"
        meta={config.meta}
        link={config.link}
      />
      <ExploreControls />
      <VizShell />
    </div>
  );
};

export default Viz;
