import React from "react";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import ExploreControls from "components/explore/ExploreControls";
import RankingTable from "components/explore/rankings/RankingTable";

const Rankings = () => {
  return (
    <div className="explore">
      <Helmet
        htmlAttributes={{lang: "en", amp: undefined}}
        title="Rankings - Pantheon"
        meta={config.meta}
        link={config.link}
      />
      <ExploreControls />
      <RankingTable />
    </div>
  );
};

export default Rankings;
