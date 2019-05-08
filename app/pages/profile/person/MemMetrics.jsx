import React, {Component} from "react";
import {connect} from "react-redux";
import {FORMATTERS} from "types/index";
import axios from "axios";
import "pages/profile/person/MemMetrics.css";

class MemMetrics extends Component {

  constructor(props) {
    super(props);
    this.state = {vid: null};
  }

  componentDidMount() {
    const {env, person} = this.props;

    // Note: this key is restricted to Pantheon domains, if you want to use this in your
    // codebase, please generate a key: https://developers.google.com/youtube/v3/docs/
    const apiKey = env.YOUTUBE_API_KEY;
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${person.name}%20${person.occupation.occupation}&maxResults=1&type=video&videoEmbeddable=true&key=${apiKey}`)
      .then(res => {
        const vid = res.data.items[0];
        this.setState({vid});
      });
  }

  render() {
    const {pageViews, person} = this.props;
    const {vid} = this.state;
    const totalPageviews = pageViews.items
      .filter(pv => pv.views)
      .map(pv => pv.views)
      .reduce((total, newVal) => total + newVal, 0);

    return (
      <div className="metrics-container">
        <div className="metric-vid">
          {vid ? <iframe max-width="560" width="100%" height="315" src={`https://www.youtube.com/embed/${vid.id.videoId}`} frameBorder="0" allowFullScreen></iframe> : <a href="" className="press-play"><i></i></a>}
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

export default connect(state => ({env: state.env}), {})(MemMetrics);
