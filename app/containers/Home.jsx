import React, {Component} from "react";
import apiClient from "apiconfig";
import axios from "axios";
import "css/components/home";
import HomeGrid from "components/home/HomeGrid";
import HomeIA from "components/home/HomeIA";
import HomeHead from "components/home/HomeHead";
import {StackedArea} from "d3plus-react";
import {calculateYearBucket, groupBy, groupTooltip, shapeConfig} from "viz/helpers";

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

    const [yearBuckets, ticks] = calculateYearBucket(personData);
    console.log(yearBuckets);
    console.log(ticks);

    if (personData) {
      stackedData = personData
        .filter(p => p.birthyear !== null)
        .sort((a, b) => b.langs - a.langs);

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

    // const eras = [-500, 1450, 1600, 1900, 1950, 1995];

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
