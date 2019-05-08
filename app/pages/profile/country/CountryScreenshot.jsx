import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/country/Header";
import "pages/profile/common/Structure.css";

class CountryScreenshot extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {country, peopleBornHere, wikiSummary, wikiPageViews} = this.props.data;

    return (
      <div>
        <Helmet
          title={country.country}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: country.country} : meta)}
        />
        <Header country={country} people={peopleBornHere} wikiSummary={wikiSummary} wikiPageViews={wikiPageViews} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const countryURL = "/country?slug=eq.<id>";
const peopleBornHereURL = "/person?bplace_country=eq.<country.id>&order=hpi.desc.nullslast&select=bplace_country(id,country,slug),occupation(*),occupation_id:occupation,*";
const wikiSummaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/<country.country>";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<country.country>/monthly/20110101/${year}${month}01`;

CountryScreenshot.preneed = [
  fetchData("country", countryURL, res => res[0])
];

CountryScreenshot.need = [
  fetchData("peopleBornHere", peopleBornHereURL, res => res),
  fetchData("wikiSummary", wikiSummaryUrl),
  fetchData("wikiPageViews", wikiPageViewsURL)
];

export default connect(state => ({data: state.data}), {})(CountryScreenshot);

