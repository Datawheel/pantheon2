import React, {Component} from "react";
import axios from "axios";
import {FORMATTERS} from "types/index";
import {AreaPlot} from "d3plus-react";
import {colorLighter} from "d3plus-color";
import moment from "moment";
import {COLORS_DOMAIN} from "types";
import "pages/profile/person/MemMetrics.css";

/**
  * returns slope, intercept and r-square of the line
  */
function leastSquares(xSeries, ySeries) {
  const reduceSumFunc = (prev, cur) => prev + cur;

  const xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
  const yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

  const ssXX = xSeries
    .map(d => Math.pow(d - xBar, 2))
    .reduce(reduceSumFunc);

  const ssYY = ySeries
    .map(d => Math.pow(d - yBar, 2))
    .reduce(reduceSumFunc);

  const ssXY = xSeries.map((d, i) => (d - xBar) * (ySeries[i] - yBar))
    .reduce(reduceSumFunc);

  const slope = ssXY / ssXX;
  const intercept = yBar - xBar * slope;
  const rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

  return [slope, intercept, rSquare];
}

class MemMetrics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      youtubeId: null,
      wikiPageViewsPast30Days: []
    };
  }

  componentDidMount() {
    const {person} = this.props;
    const wikiTrendingURL = `/api/wikiTrendDetails?pid=${person.id}`;
    axios.get(wikiTrendingURL)
      .then(res => {
        this.setState({wikiPageViewsPast30Days: res.data});
      });
    if (!person.youtube) {
      axios.get(`/api/youtube/${person.id}`)
        .then(res => {
          if (res.data && res.data.youtube) {
            this.setState({youtubeId: res.data.youtube});
          }
        });
    }
  }

  render() {
    const {pageViews, person} = this.props;
    const {wikiPageViewsPast30Days} = this.state;
    const isTrending = wikiPageViewsPast30Days && wikiPageViewsPast30Days.length;
    const domainColor = COLORS_DOMAIN[person.occupation.domain.toLowerCase().replace("& ", "").replace(/ /g, "-")];
    // console.log(person, COLORS_DOMAIN, person.occupation.domain.toLowerCase().replace("& ", "").replace(/ /g, "-"));
    const trendData = wikiPageViewsPast30Days.map((d, i) => ({...d, index: i, color: domainColor}));
    const totalPageviews = pageViews && pageViews.items ? pageViews.items
      .filter(pv => pv.views)
      .map(pv => pv.views)
      .reduce((total, newVal) => total + newVal, 0) : 0;

    let [intercept, rSquare, slope, trendLineData2] = [null, null, null, []];
    if (isTrending) {
      [slope, intercept, rSquare] = leastSquares(trendData.map(d => d.index), trendData.map(d => d.views));
      // console.log("slope, intercept and r-square!!!", [slope, intercept, rSquare]);
      trendLineData2 = trendData.map((d, i) => ({date: d.date, views: Math.max(slope * i + intercept, 0), pid: "Slope", color: colorLighter(domainColor, 0.5)}));
    }
    const youtubeId = this.state.youtubeId || person.youtube;

    return (
      <div className="metrics-container">
        <div className="metric-vid">
          {youtubeId
            ? <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              max-width="560"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
            />
            : <button className="press-play" aria-label="Press to play video" disabled tabIndex="-1"><i /></button>
          }
        </div>
        {isTrending
          ? <div className="metric-trending">
            <AreaPlot config={{
              height: 200,
              // data: trendLineData2.concat(trendData),
              data: trendData,
              groupBy: "pid",
              discrete: "x",
              x: "date",
              y: "views",
              legend: false,
              shapeConfig: {
                Area: {
                  curve: "monotoneX",
                  fill: d => d.color
                }
              },
              yConfig: {
                title: "Wikipedia Pageviews"
              },
              time: "date",
              title: "Pageviews for the past 30 days",
              titleConfig: {
                fontColor: "#4B4A48",
                fontFamily: () => ["Amiko", "Arial Narrow", "sans-serif"]
              },
              tooltipConfig: {
                footer: d => `${FORMATTERS.commas(d.views)} Page Views`,
                title: d => `<span class="center">${moment(d.date, "YYYY-MM-DD").format("LL")}</span>`,
                titleStyle: {"text-align": "center"},
                width: "200px",
                footerStyle: {
                  "font-size": "12px",
                  "text-transform": "none",
                  "color": "#4B4A48"
                }
              }
            }} />
          </div>
          : null
        }
        <ul className="metrics-list">
          <li className="metric">
            <h4>{FORMATTERS.bigNum(totalPageviews)}</h4>
            <p>Page Views (PV)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.hpi)}</h4>
            <p>Historical Popularity Index (HPI)</p>
          </li>
          <li className="metric">
            <h4>{person.l}</h4>
            <p>Languages Editions (L)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.l_)}</h4>
            <p>Effective Languages (L*)</p>
          </li>
          <li className="metric">
            <h4>{FORMATTERS.decimal(person.coefficient_of_variation)}</h4>
            <p>Coefficient of Variation (CV)</p>
          </li>
          {/* {isTrending
            ? <li className="metric">
              <h4>{FORMATTERS.decimal(slope)}</h4>
              <p>30 day pageview slope</p>
            </li>
            : null} */}
        </ul>
      </div>
    );
  }
}

export default MemMetrics;
