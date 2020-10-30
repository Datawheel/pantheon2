import React, {Component} from "react";
import {connect} from "react-redux";
import Spinner from "components/Spinner";
import PTreemap from "pages/explore/viz/vizTypes/PTreemap";
import PStacked from "pages/explore/viz/vizTypes/PStacked";
import PLine from "pages/explore/viz/vizTypes/PLine";
import PMap from "pages/explore/viz/vizTypes/PMap";
import "pages/explore/Explore.css";
import "pages/explore/viz/Viz.css";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, occupations, show, viz, yearType} = this.props;

    if (data.loading) {
      return <div className="explore-viz-container">
        <Spinner />
      </div>;
    }

    if (!data.data.length) {
      return <div className="explore-viz-container">
        <div className="loading-img">
          <p>No data found.</p>
        </div>
      </div>;
    }

    let MyViz;
    switch (viz) {
      case "stackedarea":
        MyViz = PStacked;
        break;
      case "treemap":
        MyViz = PTreemap;
        break;
      case "linechart":
        MyViz = PLine;
        break;
      case "map":
        MyViz = PMap;
        break;
      default:
        MyViz = PTreemap;
    }

    return (
      <div className="explore-viz-container">
        {data.data.length
          ? <MyViz data={data.data} show={show} occupations={occupations} yearType={yearType} />
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.vb.data
});

export default connect(mapStateToProps)(VizShell);
