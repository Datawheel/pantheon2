import React, {Component} from "react";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import VizControls from "components/explore/viz/VizControls";
import VizShell from "components/explore/viz/VizShell";
import ViewControls from "components/explore/viz/ViewControls";
import {fetchAllCountries, fetchAllCities, fetchAllOccupations} from "actions/explorer";

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
        <VizControls />
        <VizShell queryParams={this.props.location.query} />
        <ViewControls />
      </div>
    );
  }
}

Viz.need = [
  fetchAllCountries,
  fetchAllCities,
  fetchAllOccupations
];

export default Viz;
