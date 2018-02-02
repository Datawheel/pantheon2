import React, {Component} from "react";
import Helmet from "react-helmet";
// import Controls from "pages/explore/controls/Index";
// import RankingTable from "pages/explore/rankings/RankingTable";
import {FORMATTERS} from "types";
import "pages/explore/Explore.css";
import "pages/explore/rankings/Rankings.css";

class Rankings extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const show = "OCCUPATIONS";
    return (
      <div className="rankings">
        <Helmet title={`${show} Rankings`} />
        <div className="explore-head">
          <h1 className="explore-title">SHOW</h1>
          <h3 className="explore-date">{FORMATTERS.year(0)} - {FORMATTERS.year(2013)}</h3>
        </div>
        <div className="explore-body">

        </div>
      </div>
    );
  }
  // render2() {
  //   const {show, years} = this.props.explore;
  //
  //   return (
  //     <div className="rankings">
  //       <Helmet title={`${show.type} Rankings`} />
  //       <div className="explore-head">
  //         <h1 className="explore-title">{show.type}</h1>
  //         <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
  //       </div>
  //       <div className="explore-body">
  //         <Controls page="rankings" />
  //         <RankingTable />
  //       </div>
  //     </div>
  //   );
  // }
}

export default Rankings;
