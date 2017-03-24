import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import Controls from "components/explore/controls/Index";
import VizShell from "components/explore/viz/VizShell";
import {initExplore, initExplorePlace, initExploreOccupation, setExplorePage} from "actions/explore";
import {FORMATTERS} from "types";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    setExplorePage("viz");
  }

  render() {
    const {show, years} = this.props.explore;

    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title="Explorer - Pantheon"
          meta={config.meta}
          link={config.link}
        />
        <div className="explore-head">
          <h1 className="explore-title">How have the {show.type} of all globally remembered people changed over time?</h1>
          <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
        </div>
        <div className="explore-body">
          <Controls />
          <VizShell />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

Viz.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];

export default connect(mapStateToProps, {setExplorePage})(Viz);
