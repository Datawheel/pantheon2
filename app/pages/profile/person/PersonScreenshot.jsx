import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import {fetchData} from "@datawheel/canon-core";

import config from "helmet.js";
import Header from "pages/profile/person/Header";
import {NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";

class PersonScreenshot extends Component {

  /*
   * This replaces getInitialState. Likewise getDefaultProps and propTypes are just
   * properties on the constructor
   * Read more here: https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes
   */
  constructor(props) {
    super(props);
  }

  render() {
    const {person, wikiPageViews} = this.props.data;

    return (
      <div className="person">
        <Helmet
          title={person.name}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: person.name} : meta)}
        />
        <Header person={person} wikiPageViews={wikiPageViews} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const personURL = "/person?slug=eq.<id>&select=occupation(*),birthcountry(*),birthplace(*),birthyear(*),deathcountry(*),deathplace(*),deathyear(*),*,birthyearId:birthyear,deathyearId:deathyear";
const pageViewsURL = "/indicators?person=eq.<person.id>&order=pageview_date&num_pageviews=not.is.null";
const occupationRanksURL = "/person?occupation=eq.<person.occupation.id>&occupation_rank_unique=gte.<person.occupationRankLow>&occupation_rank_unique=lte.<person.occupationRankHigh>&order=occupation_rank_unique&select=occupation(*),birthcountry(*),hpi,langs,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear";
const birthYearRanksURL = "/person?birthyear=eq.<person.birthyearId>&birthyear_rank_unique=gte.<person.birthYearRankLow>&birthyear_rank_unique=lte.<person.birthYearRankHigh>&order=birthyear_rank_unique&select=occupation(id,domain_slug),birthcountry(*),langs,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,birthyear,deathyear";
const deathYearRanksURL = "/person?deathyear=eq.<person.deathyearId>&deathyear_rank_unique=gte.<person.deathYearRankLow>&deathyear_rank_unique=lte.<person.deathYearRankHigh>&order=deathyear_rank_unique&select=occupation(id,domain_slug),deathcountry(*),langs,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,deathyear,birthyear";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<person.wikiSlug>/monthly/20110101/${year}${month}01`;

PersonScreenshot.preneed = [
  fetchData("person", personURL, res => {
    const person = res[0];

    const occupationRankLow = Math.max(1, parseInt(person.occupation_rank_unique, 10) - NUM_RANKINGS_PRE);
    const occupationRankHigh = Math.max(NUM_RANKINGS, parseInt(person.occupation_rank_unique, 10) + NUM_RANKINGS_POST);

    const birthYearRankLow = Math.max(1, parseInt(person.birthyear_rank_unique, 10) - NUM_RANKINGS_PRE);
    const birthYearRankHigh = Math.max(NUM_RANKINGS, parseInt(person.birthyear_rank_unique, 10) + NUM_RANKINGS_POST);

    const deathYearRankLow = person.deathyear_rank_unique ? Math.max(1, parseInt(person.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE) : "9999";
    const deathYearRankHigh = person.deathyear_rank_unique ? Math.max(NUM_RANKINGS, parseInt(person.deathyear_rank_unique, 10) + NUM_RANKINGS_POST) : "9999";

    const deathyearId = person.deathyearId || "9999";
    const deathyear_rank_unique = person.deathyear_rank_unique || "9999";

    const wikiSlug = person.name.replace(/ /g, "_");

    return {...person, deathyear_rank_unique, deathyearId, occupationRankLow, occupationRankHigh, birthYearRankLow, birthYearRankHigh, deathYearRankLow, deathYearRankHigh, wikiSlug};
  })
];

PersonScreenshot.need = [
//   fetchPerson,
// //   fetchOccupationRanks,
// //   fetchCountryRanks,
// //   fetchYearRanks,
  fetchData("pageViews", pageViewsURL, res => res),
  fetchData("occupationRanks", occupationRanksURL, res => res),
  fetchData("birthYearRanks", birthYearRanksURL, res => res),
  fetchData("deathYearRanks", deathYearRanksURL, res => res),
  fetchData("wikiPageViews", wikiPageViewsURL)
// //   fetchCreationdates
];

// function mapStateToProps(state) {
//   return {
//     personProfile: state.personProfile
//   };
// }
//
// export default connect(mapStateToProps)(Person);

export default connect(state => ({
  data: state.data,
  env: state.env,
  location: state.location
}), {})(PersonScreenshot);
