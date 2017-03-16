import React, {Component} from "react";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import Controls from "components/explore/controls/Index";
import RankingTable from "components/explore/rankings/RankingTable";
import {initExplore, initExplorePlace, initExploreOccupation} from "actions/explore";

export default class Rankings extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title="Rankings - Pantheon"
          meta={config.meta}
          link={config.link}
        />
        <Controls page="rankings" />
        <RankingTable />
      </div>
    );
  }
}

Rankings.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];
