import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from 'helmconfig.js';
import styles from "css/components/explore/explore";
import VizControls from "components/explore/viz/VizControls";
import VizShell from "components/explore/viz/VizShell";
import { fetchAllCountries, fetchAllCities, fetchAllPofessions } from "actions/explorer";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchAllCountries,
    fetchAllCities,
    fetchAllPofessions
  ]

  render() {
    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title="Visual Explorer"
          meta={config.meta}
          link={config.link}
        />
        <VizControls />
        <VizShell />
      </div>
    );
  }

};

export default Viz;
