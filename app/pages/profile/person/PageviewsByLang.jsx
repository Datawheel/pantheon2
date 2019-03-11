import React, {Component} from "react";
import axios from "axios";
import {FORMATTERS} from "types/index";
import {LinePlot} from "d3plus-react";
import langFamilies from "json/langFamilies.json";

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
              // console.log("langlinks", langlinks);
              // console.log("langlinksLookup", langlinksLookup);
              // let langReqs = [axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${person.name}/monthly/20150701/20190301`)];
              const langReqs = langlinks.map(ll => axios.get(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${ll.lang}.wikipedia/all-access/all-agents/${ll["*"]}/monthly/20150701/20190301`));
              let langsTs = [];
              axios.all(langReqs)
                .then(langResults => {
                  // console.log("langResults", langResults);
                  langResults.forEach(lr => {
                    if (lr.data) {
                      if (lr.data.items) {
                        const wikiLangCode = lr.data.items[0].project.split(".")[0];
                        const langFamily = langFamilies[wikiLangCode] || {};
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
        // console.log("res!", res.data);
      });
  }

  render() {
    const {person} = this.props;
    const {data} = this.state;
    // console.log("pvbl data", new Set(data.map(d => d.primary_family_name)));
    return (
      <div>
        <p>
              Page views for {person.name}.
        </p>
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
                title: d => `${person.name} (${d.language})`,
                tbody: [
                  ["Month", d => {
                    const dObj = new Date(d.date);
                    return dObj.toLocaleDateString("en-US", {year: "numeric", month: "long"});
                  }],
                  ["Edition", d => d.project],
                  // ["URL", d => d.pageUrl],
                  ["Language", d => d.language],
                  ["Language Family", d => d.family_name],
                  ["Primary Language Family", d => d.primary_family_name],
                  ["Page Views", d => FORMATTERS.commas(d.views)]
                ]
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
