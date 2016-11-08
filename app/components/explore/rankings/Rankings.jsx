import React from "react";
import Helmet from "react-helmet";
import config from 'helmconfig.js';
import styles from "css/components/explore/rankings";
import RankingControls from "components/explore/rankings/RankingControls";
import RankingTable from "components/explore/rankings/RankingTable";

const Rankings = ({children}) => {
  return (
    <div className="rankings">
      <Helmet
        htmlAttributes={{"lang": "en", "amp": undefined}}
        title="Rankings"
        meta={config.meta}
        link={config.link}
      />
      <RankingControls />
      <RankingTable />
    </div>
  );
};

export default Rankings;
