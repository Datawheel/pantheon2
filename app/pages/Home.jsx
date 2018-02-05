import React, {Component} from "react";
import axios from "axios";
import HomeGrid from "pages/HomeGrid";
import "pages/Home.css";

class Home extends Component {

  componentDidMount() {
    const dataUrl = "http:localhost:3100/person?select=birthyear,id,name,occupation{id,domain,occupation}";
    axios.all([axios.get("http:localhost:3100/occupation?select=id,occupation,industry,domain_slug,domain"), axios.get(dataUrl)]).then(res => {
      console.log("axios get!", res)
      this.setState({occuData: res[0].data, personData: res[1].data});
    });
  }

  activateSearch = e => {
    console.log(e);
    return false;
  }

  render() {
    const stackedData = [];

    return (
      <div className="home-container">
        <div className="home-head">
          <h1><img src="/images/logos/logo_pantheon.svg" alt="Pantheon" /></h1>
          <div className="home-head-content">
            <div className="home-search">
              <img src="/images/icons/icon-search.svg" alt="Search" />
              <a href="#" onClick={this.activateSearch}>Search people, places, & occupations</a>
            </div>
            <div className="post">
              <p><strong>Pantheon</strong> is a dataset, visualization tool,
              and research effort, that enables you to explore human collective
              memory. <strong>Pantheon</strong> gathers information on nearly 50,000 biographies to
              help you understand the <a href="/profile/place">places</a>, <a href="/profile/person">people</a>, <a href="/profile/occupation">occupations</a> and <a href="/profile/era">eras</a>,
              of human collective memory.</p>
            </div>
          </div>
        </div>

        <div className="home-body">
          {!stackedData
            ? <div>Loading...</div>
            : <div className="viz-container">
              Stacked here...
            </div>}
        </div>

        <div className="ia">
          <h3>How Pantheon Works</h3>
          <p className="post">Pantheon helps you visually explore data of more than 50,000 biographies with a presence of <strong>14+ language editions</strong> on Wikipedia. You can explore pantheon data by looking at:</p>
          <ul className="items ia-top">
            <li className="item ia-top-item viz">
              <a href="/explore/viz"><h2 className="viz-explorer">Visualizations</h2></a>
              <p>
              Create custom charts and maps using the Pantheon data. <a href="/explore/viz" className="deep-link">View Visualizations</a>
              </p>
            </li>
            <li className="item ia-top-item profiles">
              <h2 className="profiles">Profiles</h2>
              <p>
              Explore interactive stories for <a href="/profile/place">places</a>, <a href="/profile/person">people</a>, <a href="/profile/occupation">occupations</a> and <a href="/profile/era">eras</a>.
              </p>
            </li>
            <li className="item ia-top-item ranks">
              <a href="/explore/rankings"><h2 className="ranks">Rankings</h2></a>
              <p>
              Rank <a href="/profile/person">people</a>, <a href="/profile/place">places</a>, and <a href="/profile/occupation">occupations</a>. <a href="/explore/rankings" className="deep-link">View Rankings</a>
              </p>
            </li>
          </ul>
        </div>

        <HomeGrid />

        <div className="floating-content l-1">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>

        <div className="floating-content l-2">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>

      </div>
    );

  }
}

export default Home;
