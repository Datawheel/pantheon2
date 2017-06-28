import React, {Component} from "react";
import {FORMATTERS} from "types";
import axios from "axios";

class MemMetrics extends Component {

  constructor(props) {
    super(props);
    this.state = {vid: null};
  }

  componentDidMount() {
    const {person} = this.props;
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${person.name}%20${person.occupation.occupation}&maxResults=1&type=video&videoEmbeddable=true&key=AIzaSyB0gtWcJ2moxtxdVGkC0WvIdFvQX4nRNPs`)
      .then(res => {
        const vid = res.data.items[0];
        this.setState({vid});
      });
  }

  render() {
    const {pageviews, person} = this.props;
    const {vid} = this.state;
    const totalPageviews = pageviews
                            .filter(pv => pv.num_pageviews)
                            .map(pv => pv.num_pageviews)
                            .reduce((total, newVal) => total + newVal, 0);
    return (
      <div className="metrics-container">
        <div className="metric-vid">
          {vid ? <iframe width="560" height="315" src={`https://www.youtube.com/embed/${vid.id.videoId}`} frameBorder="0" allowFullScreen></iframe> : <a href="" className="press-play"><i></i></a>}
        </div>
        <ul className="metrics-list">
          <li className="metric">
            <h4>{FORMATTERS.bigNum(totalPageviews)}</h4>
            <p>Page Views (PV)</p>
          </li>
          <li className="metric">
            <h4>{person.hpi}</h4>
            <p>Historical Popularity Index (HPI)</p>
          </li>
          <li className="metric">
            <h4>{person.langs}</h4>
            <p>Different Languages (L)</p>
          </li>
          <li className="metric">
            <h4>7.19</h4>
            <p>Effective Languages (L*)</p>
          </li>
          <li className="metric">
            <h4>0.00459</h4>
            <p>Coefficient of Variation (CV)</p>
          </li>
        </ul>
      </div>
    );
  }
}

export default MemMetrics;
