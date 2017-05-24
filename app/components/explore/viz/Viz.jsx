import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import Controls from "components/explore/controls/Index";
import VizShell from "components/explore/viz/VizShell";
import {initExplore, initExplorePlace, initExploreOccupation, setExplorePage} from "actions/explore";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.setExplorePage("viz");
  }

  render() {
    const {show, years, metric} = this.props.explore;
    const metricRange = metric.metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    let metricSentence;
    if(metric.cutoff > metricRange[0]) {
      if (metric.metricType === "hpi") {
        metricSentence = `Showing people with a Historical Popularity Index (HPI) greater than ${metric.cutoff}.`;
      }
      else {
        metricSentence = `Showing people with more than ${metric.cutoff} Wikipedia language editions.`;
      }
    }

    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title="Visualizations - Pantheon"
          meta={config.meta}
          link={config.link}
        />
        <div className="explore-head">
          <h1 className="explore-title">How have the {show.type} of all globally remembered people changed over time?</h1>
          <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
          {metricSentence ? <p>{metricSentence}</p> : null}
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

const mapDispatchToProps = dispatch => ({
  setExplorePage: page => {
    dispatch(setExplorePage(page));
  }
});

Viz.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];

export default connect(mapStateToProps, mapDispatchToProps)(Viz);
