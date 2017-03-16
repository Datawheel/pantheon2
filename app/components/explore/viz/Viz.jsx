import React, {Component} from "react";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import Controls from "components/explore/controls/Index";
import VizShell from "components/explore/viz/VizShell";
import ViewControls from "components/explore/viz/ViewControls";
import {initExplore, initExplorePlace, initExploreOccupation} from "actions/explore";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title="Visual Explorer - Pantheon"
          meta={config.meta}
          link={config.link}
        />
        <Controls page="viz" />
        <VizShell />
        <ViewControls />
      </div>
    );
  }
}

Viz.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];


export default Viz;
