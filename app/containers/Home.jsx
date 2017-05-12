import React, {Component} from "react";
import apiClient from "apiconfig";
import axios from "axios";
import {FORMATTERS} from "types";
import "css/components/home";
import HomeGrid from "components/home/HomeGrid";
import HomeIA from "components/home/HomeIA";
import HomeHead from "components/home/HomeHead";
import {StackedArea} from "d3plus-react";
import {bucketScale, groupBy, groupTooltip, shapeConfig} from "viz/helpers";

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
    const dataUrl = "/person?select=birthyear,id,name,occupation{id,domain,occupation}";

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

      stackedData.forEach(d => {
        d.occupation_name = d.occupation.occupation;
        d.occupation_id = `${d.occupation.id}`;
        d.place = d.birthplace;
        d.logyear = bucketScale(d.birthyear);
      });
    }

    let attrs = false;

    if (occuData) {
      attrs = occuData.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {});
    }

    const ticks = [-3500, -500, 1450, 1600, 1900, 1950, 1995, 2016];
    const logTicks = ticks.map(bucketScale);

    return (
      <div className="home-container">

        <HomeHead />

        <div className="home-body">
          { !stackedData
          ? <div>Loading...</div>
          : <div className="viz-container">
              <StackedArea
                config={{
                  data: stackedData,
                  groupBy: ["domain"].map(groupBy(attrs)),
                  legendConfig: {
                    shapeConfig: {
                      labelConfig: {
                        fontColor: "#4B4A48",
                        fontFamily: () => "Amiko",
                        fontResize: false,
                        fontSize: () => 12
                      },
                      height: () => 11,
                      labelPadding: 0,
                      width: () => 11
                    }
                  },
                  legendPosition: "bottom",
                  shapeConfig: Object.assign({Area: {label: false}}, shapeConfig(attrs)),
                  time: "logyear",
                  timeline: false,
                  tooltipConfig: Object.assign({duration: 0}, groupTooltip(stackedData)),
                  x: "logyear",
                  xConfig: {
                    labels: logTicks,
                    ticks: [],
                    tickFormat: d => FORMATTERS.year(ticks[logTicks.indexOf(new Date(d).getFullYear())])
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
