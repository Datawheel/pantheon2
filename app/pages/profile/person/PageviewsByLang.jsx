import React, {Component} from "react";
import axios from "axios";
import {FORMATTERS} from "types/index";
import {LinePlot} from "d3plus-react";
import {max as D3Max, mean as D3Mean, sum as D3Sum} from "d3-array";
import {nest} from "d3-collection";
import langFamilies from "json/langFamilies.json";
import moment from "moment";
import {Tooltip} from "@blueprintjs/core";
import AnchorList from "components/utils/AnchorList";

class PageviewsByLang extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: []
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
              const langReqs = langlinks.map(ll => axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${ll.lang}.wikipedia/all-access/all-agents/${ll["*"]}/monthly/20150701/20190301`).catch(err => console.log("Page view data fetch error:", err)));
              let langsTs = [];
              axios.all(langReqs)
                .then(langResults => {
                  // console.log("langResults", langResults);
                  langResults.forEach(lr => {
                    if (lr && lr.data) {
                      if (lr.data.items) {
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
                  this.setState({loading: false, data: langsTs});
                });
            }
          }
        }
      });
  }

  genText = () => {
    const {person} = this.props;
    const {data} = this.state;

    // get most recent month
    const latestDate = D3Max(data, d => moment(d.date, "YYYY/MM/DD"));

    // get prev year, and 2 years ago for year bounds
    const dataPastYear = data.filter(d => moment(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(1, "year"));
    const dataPrevPastYear = data.filter(d => moment(d.date, "YYYY/MM/DD") > latestDate.clone().subtract(2, "year") && moment(d.date, "YYYY/MM/DD") <= latestDate.clone().subtract(1, "year"));

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
    const {data} = this.state;

    return (
      <div>
        {data.length
          ? this.genText()
          : null}
        <br />
        {data.length
          ? <LinePlot
            config={{
              height: 600,
              data,
              groupBy: ["primary_family_code", "project"],
              depth: 1,
              shapeConfig: {
                // fill: d => "red",
                Line: {
                  // fill: "none",
                  // stroke: "red",
                  strokeWidth: 2
                }
              },
              legendConfig: {
                label: d => d.primary_family_name
              },
              legendTooltip: {
                title: d => d.primary_family_name,
                tbody: []
              },
              time: "date",
              timeline: false,
              tooltipConfig: {
                // title: d => `${person.name} (${d.language})`,
                title: d => {
                  const dObj = new Date(d.date);
                  return dObj.toLocaleDateString("en-US", {year: "numeric", month: "long"});
                },
                body: d => `<ul>
                  <li class="large">
                    ${FORMATTERS.commas(d.views)}
                    <span>page views</span>
                  </li>
                  <li class="large">
                    ${d.project}
                    <span>${d.language}</span>
                  </li>
                </ul>`
              },
              x: "date",
              // xConfig: {tickFormat: d => FORMATTERS.year(new Date(d).getFullYear())},
              y: "views",
              yConfig: {
                scale: "log",
                title: "Count of pageviews by language edition"
              }
            }} /> : null}
      </div>
    );
  }
}

export default PageviewsByLang;