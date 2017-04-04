import React, {Component} from "react";
import apiClient from "apiconfig";
import axios from "axios";
import "css/components/home";
import HomeGrid from "components/home/HomeGrid";
import HomeIA from "components/home/HomeIA";
import searchSvg from "images/icons/icon-search.svg";
import pantheonLogoSvg from "images/logo.svg";
import iaPng from "images/home/ia_placeholder.png";
import {StackedArea} from "d3plus-react";
import {bucketScale, groupBy, groupTooltip, shapeConfig} from "viz/helpers";
import {FORMATTERS, YEAR_BUCKETS} from "types";
import {extent} from "d3-array";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
class Home extends Component {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const dataUrl = "/person?select=birthyear,id,occupation{id,domain,occupation}";

    axios.all([apiClient.get("/occupation?select=id,occupation,industry,domain_slug,domain"), apiClient.get(dataUrl)]).then(res => {
      this.setState({occuData: res[0].data, personData: res[1].data});
    });
  }

  render() {

    const {personData} = this.state;
    const {occuData} = this.state;

    let stackedData = [];

    if (personData) {
      stackedData = personData
        .filter(p => p.birthyear !== null)
        .sort((a, b) => b.langs - a.langs);

      let birthyearSpan = extent(stackedData, d => d.birthyear);
      birthyearSpan = birthyearSpan[1] - birthyearSpan[0];

      stackedData.forEach(d => {
        d.occupation_name = d.occupation.occupation;
        d.occupation_id = `${d.occupation.id}`;
        d.place = d.birthplace;
        d.logyear = birthyearSpan < YEAR_BUCKETS * 2
                  ? d.birthyear
                  : bucketScale(d.birthyear);
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

        <div className="flying-plane"></div>

        <div className="home-head">
          <h1><img src={pantheonLogoSvg} alt="Pantheon" /></h1>
          <h3>Mapping Cultural Memory</h3>
          <div className="home-search">
            <img src={searchSvg} alt="Search" />
            <input type={"text"} placeholder={"Napoleon, fine arts, Syria"} />
          </div>
        </div>
        <div className="home-body">
          <div className="post">
            <p><strong>Pantheon</strong> is an <a href="https://www.media.mit.edu/projects/pantheon-new/overview/" target="_blank">MIT Media Lab</a> research project celebrating the development of collective learning that endows our species with fantastic capacities. This site visualizes data on over 47,000 of the most globally memorable individuals around the world. We invite you to explore and engage with our research. To begin, choose a <strong>Communication Technology Era</strong> to see its profile:</p>
          </div>

          <div className="viz-container">
          { !stackedData
            ? <div>Loading...</div>
            : <div>
              <StackedArea
                config={{
                  data: stackedData,
                  groupBy: ["domain"].map(groupBy(attrs)),
                  legendConfig: {
                    shapeConfig: {
                      fontColor: "#4B4A48",
                      fontFamily: () => "Amiko",
                      fontResize: false,
                      fontSize: () => 12,
                      height: () => 11,
                      labelPadding: 0,
                      width: () => 11
                    }
                  },
                  legendPosition: "bottom",
                  shapeConfig: Object.assign({Area: {label: false}}, shapeConfig(attrs)),
                  time: "logyear",
                  timeline: false,
                  tooltipConfig: groupTooltip(stackedData),
                  x: "logyear",
                  xConfig: {
                    tickFormat: d => FORMATTERS.year(bucketScale.invert(d))
                  },
                  y: d => d.id instanceof Array ? d.id.length : 1,
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
                    <p><a href="/profile/era/personal_computer">Computer</a></p>
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
              <h4 className="legend-title">Domains</h4>
            </div>
          }
          </div>

          <HomeIA />

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
      </div>
    );
  }
}

export default Home;
