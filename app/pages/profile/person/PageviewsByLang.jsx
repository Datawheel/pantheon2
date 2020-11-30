import React, {Component} from "react";
import axios from "axios";
import {FORMATTERS} from "types/index";
import {LinePlot, StackedArea} from "d3plus-react";
import {max as D3Max, mean as D3Mean, sum as D3Sum} from "d3-array";
import {nest} from "d3-collection";
import langFamilies from "json/langFamilies.json";
import moment from "moment";
import {Tooltip} from "@blueprintjs/core";
import AnchorList from "components/utils/AnchorList";

const langFamColors = {
  "afa": "#cdc84c",
  "cau": "#0E5E5B",
  "": "#67AF8C",
  "ine": "#B12D11",
  "nic": "#732945",
  "tut": "#4C5ED7",
  "crp": "#4F680A",
  "sit": "#D28629",
  "map": "#260348",
  "urj": "#160B5B",
  "dra": "#162A6D",
  "tai": "#255A7F"
};

/** turn a date object into a string in YYYYMMDD format. */
function yyyymmdd(dateIn) {
  const mm = dateIn.getMonth() + 1; // getMonth() is zero-based
  const dd = dateIn.getDate();

  return [dateIn.getFullYear(),
    (mm > 9 ? "" : "0") + mm,
    (dd > 9 ? "" : "0") + dd
  ].join("");
}

class PageviewsByLang extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      timeSeriesData: [],
      numLangs: 0
    };
  }

  componentDidMount() {
    const {person} = this.props;
    axios.get(`https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&pageids=${person.id}&lllimit=500&llprop=langname|url&format=json&origin=*`)
      .then(res => {
        const {data: wikiData} = res;
        if (wikiData.query) {
          if (wikiData.query.pages) {
            const personResult = wikiData.query.pages[person.id];
            if (personResult) {
              const {langlinks} = personResult;
              langlinks.unshift({"*": person.name, "lang": "en", "langname": "English", "url": `https://en.wikipedia.org/wiki/${person.name}`});
              const langlinksLookup = langlinks.reduce((obj, d) => (obj[d.lang] = d, obj), {});
              const todaysDate = new Date();
              const thisMonth = yyyymmdd(todaysDate);
              const langReqs = langlinks.map(ll => axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${ll.lang}.wikipedia/all-access/all-agents/${ll["*"]}/monthly/20150701/${thisMonth}`).catch(err => console.log("Page view data fetch error:", err)));
              let langsTs = [];
              let numLangs = 0;
              axios.all(langReqs)
                .then(langResults => {
                  langResults.forEach(lr => {
                    if (lr && lr.data) {
                      if (lr.data.items) {
                        numLangs++;
                        const wikiLangCode = lr.data.items[0].project.split(".")[0];
                        const langFamily = langFamilies[wikiLangCode] || {family_code: "", family_name: "", lang_code3: "", language: "", language_local: "", primary_family_code: "", primary_family_name: ""};
                        const localUrl = langlinksLookup[wikiLangCode] || {url: ""};
                        langsTs = [...langsTs, ...lr.data.items.map(lrd => ({
                          ...lrd,
                          ...langFamily,
                          pageUrl: localUrl.url,
                          date: `${lrd.timestamp.substring(0, 4)}/${lrd.timestamp.substring(4, 6)}/${lrd.timestamp.substring(6, 8)}`}))];
                      }
                    }
                  });
                  this.setState({loading: false, timeSeriesData: langsTs, numLangs});
                });
            }
          }
        }
      });
  }

  genText = () => {
    const {person} = this.props;
    const {timeSeriesData} = this.state;

    // get most recent month
    const latestDate = D3Max(timeSeriesData, d => moment(d.date, "YYYY/MM/DD"));

    // get prev year, and 2 years ago for year bounds
    const dataPastYear = timeSeriesData.filter(d => moment(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(1, "year"));
    const dataPrevPastYear = timeSeriesData.filter(d => moment(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(2, "year") && moment(d.date, "YYYY/MM/DD") <= latestDate.clone().subtract(1, "year"));

    // group past year (and year previous) by wiki edition
    const dataPastYearAgg = nest()
      .key(d => d.project)
      .rollup(leaves => ({
        views: D3Sum(leaves, d => d.views),
        project: leaves[0].project,
        article: leaves[0].article,
        language: leaves[0].language,
        language_local: leaves[0].language_local,
        family_name: leaves[0].family_name,
        primary_family_name: leaves[0].primary_family_name,
        pageUrl: leaves[0].pageUrl,
        year: Math.ceil(D3Mean(leaves, d => moment(d.date, "YYYY/MM/DD").year()))
      }))
      .entries(dataPastYear)
      .map(d => d.value)
      .sort((a, b) => b.views - a.views);
    const dataPrevPastYearAgg = nest()
      .key(d => d.project)
      .rollup(leaves => ({
        views: D3Sum(leaves, d => d.views),
        project: leaves[0].project,
        article: leaves[0].article,
        language: leaves[0].language,
        language_local: leaves[0].language_local,
        family_name: leaves[0].family_name,
        primary_family_name: leaves[0].primary_family_name,
        pageUrl: leaves[0].pageUrl,
        year: Math.ceil(D3Mean(leaves, d => moment(d.date, "YYYY/MM/DD").year()))
      }))
      .entries(dataPrevPastYear)
      .map(d => d.value);

    // merge past 2 years and align for growth calculation
    const dataProjectGrowth = nest()
      .key(d => d.project)
      .rollup(leaves => ({
        growth: leaves.length > 1 ? leaves[0].views - leaves[1].views : null,
        growthPct: leaves.length > 1 ? (leaves[0].views - leaves[1].views) / leaves[1].views : null,
        vals: leaves,
        ...leaves[0]
      }))
      .entries(dataPastYearAgg.concat(dataPrevPastYearAgg))
      .map(d => d.value)
      .sort((a, b) => b.growthPct - a.growthPct);
    // console.log("dataPastYear", dataPastYear);
    // console.log("dataPrevPastYear", dataPrevPastYear);
    // console.log("dataPastYearAgg", dataPastYearAgg);
    // console.log("dataPrevPastYearAgg", dataPrevPastYearAgg);
    // console.log("dataProjectGrowth", dataProjectGrowth);

    return <p>Over the past year {person.name} has had the most page views in the <Tooltip content={`${dataPastYearAgg[0].language} (${dataPastYearAgg[0].language_local}) is a ${dataPastYearAgg[0].family_name} language in the ${dataPastYearAgg[0].primary_family_name} family of languages.`}><a href={dataPastYearAgg[0].pageUrl}>{dataPastYearAgg[0].language} wikipedia edition</a></Tooltip> with {FORMATTERS.commas(dataPastYearAgg[0].views)} views, followed by <AnchorList items={dataPastYearAgg.slice(1, 3)} name={d => `${d.language} (${FORMATTERS.commas(d.views)})`} url={d => d.pageUrl} tooltip={d => `${d.language} (${d.language_local}) is a ${d.family_name} language in the ${d.primary_family_name} family of languages.`} newWindow={true} />. In terms of yearly growth of page views the top 3 wikpedia editions are <AnchorList items={dataProjectGrowth.slice(0, 3)} name={d => `${d.language} (${FORMATTERS.share(d.growthPct)})`} url={d => d.pageUrl} tooltip={d => `${d.language} (${d.language_local}) is a ${d.family_name} language in the ${d.primary_family_name} family of languages.`} newWindow={true} /></p>;
  }

  render() {
    const {person} = this.props;
    const {numLangs, timeSeriesData} = this.state;
    // Whether or not we should show the labels on the lines
    // depends on how many unique languages we have. If there are
    // more than 30 the chart becomes too cluttered with the labels.
    const lineLabels = numLangs <= 30;

    return (
      <div>
        {timeSeriesData.length
          ? this.genText()
          : null}
        <br />
        {timeSeriesData.length
          ? <StackedArea
            config={{
              height: 600,
              data: timeSeriesData,
              groupBy: ["primary_family_code", "project"],
              depth: 1,
              discrete: "x",
              shapeConfig: {
                Line: {
                  // fill: "none",
                  stroke: d => langFamColors[d.primary_family_code],
                  strokeWidth: 2,
                  labelConfig: {
                    fontColor: d => langFamColors[d.primary_family_code]
                  }
                }
              },
              label: d => d.language || d.project,
              legendConfig: {
                label: d => Array.isArray(d.primary_family_name) ? d.primary_family_name.filter(Boolean).join(", ") : d.primary_family_name
              },
              legendTooltip: {
                title: d => Array.isArray(d.primary_family_name) ? d.primary_family_name.filter(Boolean).join(", ") : d.primary_family_name,
                tbody: []
              },
              lineLabels,
              time: "date",
              timeline: false,
              tooltipConfig: {
                // title: d => `${person.name} (${d.language})`,
                title: d => {
                  const dObj = new Date(d.date);
                  return dObj.toLocaleDateString("en-US", {year: "numeric", month: "long"});
                },
                body: d => {
                  let projectTxt = d.project;
                  if (Array.isArray(d.project)) {
                    projectTxt = d.project.slice(0, 5).join(", ");
                    if (d.project.length > 5) {
                      projectTxt += `... (${d.project.slice(5).length} more)`;
                    }
                  }
                  return `<ul>
                    <li class="large">
                      ${FORMATTERS.commas(d.views)}
                      <span>page views</span>
                    </li>
                    <li class="large">
                      ${Array.isArray(d.language) ? d.language.join(", ") : d.language}
                      <span>${projectTxt}</span>
                    </li>
                  </ul>`;
                }
              },
              x: "date",
              // xConfig: {tickFormat: d => FORMATTERS.year(new Date(d).getFullYear())},
              y: "views",
              yConfig: {
                // scale: "log",
                title: "Pageviews by language edition",
                titleConfig: {
                  fontSize: () => 18
                },
                labelConfig: {
                  fontSize: () => 18
                },
                shapeConfig: {
                  labelConfig: {
                    fontSize: () => 20
                  }
                }
              }
            }} /> : null}
      </div>
    );
  }
}

export default PageviewsByLang;
