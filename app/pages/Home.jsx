import React, {Component} from "react";
import PropTypes from "prop-types";
import apiClient from "apiConfig";
import axios from "axios";
import HomeGrid from "pages/HomeGrid";
import {StackedArea} from "d3plus-react";
import {calculateYearBucket, groupBy, groupTooltip, shapeConfig} from "viz/helpers";
import "pages/Home.css";

class Home extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const dataUrl = "/person?select=birthyear,id,name,occupation(id,domain,occupation)&occupation=neq.null";

    axios.all([apiClient.get("/occupation?select=id,occupation,industry,domain_slug,domain"), apiClient.get(dataUrl)]).then(res => {
      this.setState({occuData: res[0].data, personData: res[1].data});
    });
  }

  activateSearch = e => false

  render() {
    const {activateSearch} = this.context;
    const {occuData, personData} = this.state;

    let stackedData = [];

    const [yearBuckets, ticks] = calculateYearBucket(personData);

    if (personData) {
      stackedData = personData
        .filter(p => p.birthyear !== null)
        .sort((a, b) => b.l - a.l);

      stackedData.forEach(d => {
        d.occupation_name = d.occupation.occupation;
        d.occupation_id = `${d.occupation.id}`;
        d.place = d.birthplace;
      });
    }

    let attrs = false;

    if (occuData) {
      attrs = occuData.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {});
    }

    return (
      <div className="home-container">
        <div className="home-head">
          <h1><img src="/images/logos/logo_pantheon.svg" alt="Pantheon" /></h1>
          <div className="home-head-content">
            <div className="home-search">
              <img src="/images/icons/icon-search.svg" alt="Search" />
              <a href="#" onClick={activateSearch}>Search people, places, & occupations</a>
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
          {stackedData && attrs &&
            <div className="viz-container">
              <StackedArea
                config={{
                  data: stackedData,
                  depth: 0,
                  groupBy: ["domain", "industry"].map(groupBy(attrs)),
                  height: 500,
                  legendConfig: {
                    shapeConfig: {
                      labelConfig: {
                        fontSize: () => 12
                      },
                      height: () => 11,
                      width: () => 11
                    }
                  },
                  shapeConfig: Object.assign({Area: {label: false}}, shapeConfig(attrs)),
                  timeline: false,
                  tooltipConfig: Object.assign({duration: 0}, groupTooltip(stackedData)),
                  xConfig: {
                    labels: ticks,
                    tickFormat: d => yearBuckets[d]
                  },
                  yConfig: {
                    gridConfig: {
                      "stroke-width": 0
                    }
                  }
                }} />
              <div className="timeline-container">
                <ul className="items">
                  <li className="item era computer">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/personal_computer">Internet</a></p>
                  </li>
                  <li className="item era television">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/television">Television</a></p>
                  </li>
                  <li className="item era film-radio">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/radio_and_film">Film & Radio</a></p>
                  </li>
                  <li className="item era newspaper">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/newspaper">Newspaper</a></p>
                  </li>
                  <li className="item era printing">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/printing">Printing</a></p>
                  </li>
                  <li className="item era scribal">
                    <div className="era-img"></div>
                    <p><a href="/profile/era/scribal">Scribal</a></p>
                  </li>
                </ul>
              </div>
              <h4 className="legend-title">Domains of all <span>Occupations</span></h4>
            </div>
          }
        </div>

        <div className="ia">
          <h3>How Pantheon Works</h3>
          <p className="post">Pantheon helps you visually explore data of more than 50,000 biographies with a presence of <strong>14+ language editions</strong> on Wikipedia. You can explore pantheon data by looking at:</p>
          <ul className="items ia-top">
            <li className="item ia-top-item viz">
              <a href="/explore/viz"><h2 className="viz-explorer">Visualizations</h2></a>
              <p>
              Create custom charts and maps using the Pantheon data. <a href="/explore/viz" className="deep-link">View Visualizations</a>
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
              Rank <a href="/profile/person">people</a>, <a href="/profile/place">places</a>, and <a href="/profile/occupation">occupations</a>. <a href="/explore/rankings" className="deep-link">View Rankings</a>
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

Home.contextTypes = {
  activateSearch: PropTypes.func
};

export default Home;
