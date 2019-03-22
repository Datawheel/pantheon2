import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/place/Header";
import "pages/profile/common/Structure.css";

class PlaceScreenshot extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {place, country, peopleBornHere, wikiSummary, wikiPageViews} = this.props.data;

    return (
      <div>
        <Helmet
          title={place.name}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: place.name} : meta)}
        />
        <Header place={place} country={country} people={peopleBornHere} wikiSummary={wikiSummary} wikiPageViews={wikiPageViews} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const placeURL = "/place?slug=eq.<id>";
const countryURL = "/place?country_code=eq.<place.country_code>&is_country=is.true";
const peopleBornHereURL = "/person?<place.birthPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=birthplace(id,name,slug,lat_lon),occupation(*),occupation_id:occupation,*";
const wikiSummaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/<place.name>";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<place.name>/monthly/20110101/${year}${month}01`;

PlaceScreenshot.preneed = [
  fetchData("place", placeURL, res => {
    const place = res[0];
    const birthPlaceColumn = place.name === place.country_name ? "birthcountry" : "birthplace";
    return {birthPlaceColumn, ...place};
  })
];


PlaceScreenshot.need = [
  fetchData("country", countryURL, res => res[0]),
  fetchData("peopleBornHere", peopleBornHereURL, res => res),
  fetchData("wikiSummary", wikiSummaryUrl),
  fetchData("wikiPageViews", wikiPageViewsURL)
];

export default connect(state => ({data: state.data}), {})(PlaceScreenshot);

