import React, { Component, PropTypes } from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from 'helmconfig.js';
import styles from "css/components/explore/rankings";
import VizControls from "components/explore/viz/VizControls";
import VizShell from "components/explore/viz/VizShell";
import { fetchAllCountries, fetchAllCities } from "actions/explorer";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchAllCountries,
    fetchAllCities
  ]

  render() {
    return (
      <div className="rankings">
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title="Viz Explorer"
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
