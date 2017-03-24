import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import "css/components/explore/rankings";
import Controls from "components/explore/controls/Index";
import RankingTable from "components/explore/rankings/RankingTable";
import {initExplore, initExplorePlace, initExploreOccupation, setExplorePage} from "actions/explore";
import {FORMATTERS} from "types";

class Rankings extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.setExplorePage("rankings");
  }

  render() {
    const {show, years} = this.props.explore;
    console.log(show);

    return (
      <div className="rankings">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title="Rankings - Pantheon"
          meta={config.meta}
          link={config.link}
        />
        <div className="explore-head">
          <h1 className="explore-title">Most Globally Remembered {show.type}</h1>
          <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
        </div>
        <div className="explore-body">
          <Controls page="rankings" />
          <RankingTable />
        </div>
      </div>
    );
  }
}

Rankings.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];

function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

export default connect(mapStateToProps, {setExplorePage})(Rankings);
