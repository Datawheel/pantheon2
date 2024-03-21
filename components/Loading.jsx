import React, {Component} from "react";
import {connect} from "react-redux";
import {translate} from "react-i18next";
// import {NonIdealState, ProgressBar} from "@blueprintjs/core";
import Navigation from "components/Navigation";
import Spinner from "components/Spinner";
import "./Loading.css";

/**
  This component is displayed when the needs of another component are being
  loaded into the redux store.
*/
class Loading extends Component {
  render() {
    // const {progress, t, total} = this.props;
    // return <NonIdealState
    //   className="Loading"
    //   title={ t("Loading.title") }
    //   description={ t("Loading.description", {progress, total}) }
    // >
    //   <ProgressBar value={progress / total} />
    // </NonIdealState>;

    return (
      <React.Fragment>
        <Navigation />
        <Spinner />
      </React.Fragment>
    );
  }
}

export default translate()(
  connect(state => ({
    total: state.loadingProgress.requests,
    progress: state.loadingProgress.fulfilled,
  }))(Loading)
);
