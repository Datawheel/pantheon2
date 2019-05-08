import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/era/Header";
import "pages/profile/common/Structure.css";

class EraScreenshot extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {era} = this.props.data;

    return (
      <div>
        <Helmet
          title={era.name}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: era.name} : meta)}
        />
        <Header era={era} />
      </div>
    );
  }

}

const eraURL = "/era?slug=eq.<id>";

EraScreenshot.preneed = [
  fetchData("era", eraURL, res => res[0])
];

export default connect(state => ({data: state.data}), {})(EraScreenshot);
