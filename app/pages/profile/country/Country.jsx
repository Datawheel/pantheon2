import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/country/Header";
import ProfileNav from "pages/profile/common/Nav";
import Intro from "pages/profile/country/Intro";
import Footer from "pages/profile/country/Footer";
import PeopleRanking from "pages/profile/country/sections/PeopleRanking";
import Occupations from "pages/profile/country/sections/Occupations";
import OccupationTrends from "pages/profile/country/sections/OccupationTrends";
import GeomapBirth from "pages/profile/country/sections/GeomapBirth";
import GeomapDeath from "pages/profile/country/sections/GeomapDeath";
import Lifespans from "pages/profile/country/sections/Lifespans";
import LivingPeople from "pages/profile/country/sections/LivingPeople";
import NotFound from "components/NotFound";
import {NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";
import "pages/profile/common/Structure.css";

class Country extends Component {

  constructor(props) {
    super(props);
    this.sections = [
      {slug: "people", title: "People"},
      {slug: "occupations", title: "Occupations"},
      {slug: "occupational-trends", title: "Occupational Trends"},
      {slug: "cities-by-births", title: "Cities by Births"},
      {slug: "cities-by-deaths", title: "Cities by Deaths"},
      {slug: "overlapping-lives", title: "Overlapping Lives"},
      {slug: "living-people", title: "Living People"}
    ];
  }

  componentDidMount() {
    // generate screenshot on page load
    const {id: slug} = this.props.params;
    const {country} = this.props.data;
    if (country !== undefined) {
      const screenshotUrl = `/api/screenshot/country/${slug}/`;
      axios.get(screenshotUrl);
    }
  }

  render() {
    const {country, peopleBornHere, peopleDiedHere, countryRanks, occupations, peopleBornHereAlive, wikiExtract, wikiSummary, wikiImg, wikiPageViews} = this.props.data;
    if (country === undefined) {
      return <NotFound />;
    }

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    const pageUrl = this.props.location.href.split("?")[0].replace(/\/$/, "");
    const pageHeaderMetaTags = config.meta.map(meta => {
      if (meta.property) {
        if (meta.property === "og:title") {
          return {property: "og:title", content: country.country};
        }
        if (meta.property === "og:image") {
          return {property: "og:image", content: `${pageUrl.replace("http://", "https://").replace("/profile/", "/images/screenshots/")}.jpg`};
        }
      }
      return meta;
    });

    return (
      <div>
        <Helmet
          title={country.country}
          meta={pageHeaderMetaTags}
        />
        <Header country={country} people={peopleBornHere} wikiSummary={wikiSummary} wikiPageViews={wikiPageViews} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro country={country} countryRanks={countryRanks} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} wikiSummary={wikiSummary} />
        </div>
        <PeopleRanking country={country} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <Occupations attrs={attrs} country={country} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        {peopleBornHere.length > 10 ? <OccupationTrends attrs={attrs} country={country} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} occupations={occupations} /> : null}
        {peopleBornHere.length ? <GeomapBirth country={country} peopleBorn={peopleBornHere} /> : null}
        {peopleBornHere.filter(p => p.deathyear !== null).length ? <GeomapDeath country={country} peopleDied={peopleDiedHere} /> : null}
        {peopleBornHere.filter(p => p.deathyear !== null).length ? <Lifespans attrs={attrs} country={country} peopleBorn={peopleBornHere} /> : null}

        {/* <LivingPeople place={place} data={peopleBornHereAlive} /> */}
        {/* <Footer occupations={occupations} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} /> */}
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const countryURL = "/country?slug=eq.<id>";
const peopleBornHereURL = "/person?bplace_country=eq.<country.id>&order=hpi.desc.nullslast&select=bplace_country(id,country,slug),bplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*";
const peopleDiedHereURL = "/person?dplace_country=eq.<country.id>&order=hpi.desc.nullslast&select=dplace_country(id,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*";
const countryRanksURL = "/place?born_rank_unique=gte.<country.countryRankLow>&born_rank_unique=lte.<country.countryRankHigh>&order=born_rank_unique";
const occupationsURL = "/occupation?order=num_born.desc.nullslast";
const peopleBornHereAliveURL = "/person?bplace_country=eq.<country.id>&limit=3&order=hpi.desc.nullslast&alive=is.true";
const wikiSummaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/<country.country>";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<country.country>/monthly/20110101/${year}${month}01`;

Country.preneed = [
  fetchData("country", countryURL, res => {
    const country = res[0];

    const countryRankLow = Math.max(1, parseInt(country.born_rank_unique, 10) - NUM_RANKINGS_PRE);
    const countryRankHigh = Math.max(NUM_RANKINGS, parseInt(country.born_rank_unique, 10) + NUM_RANKINGS_POST);

    return Object.assign({countryRankLow, countryRankHigh}, country);
  })
];


Country.need = [
  fetchData("country", countryURL, res => res[0]),
  fetchData("peopleBornHere", peopleBornHereURL, res => res),
  fetchData("peopleDiedHere", peopleDiedHereURL, res => res),
  fetchData("countryRanks", countryRanksURL, res => res),
  fetchData("occupations", occupationsURL, res => res),
  fetchData("peopleBornHereAlive", peopleBornHereAliveURL, res => res),
  fetchData("wikiSummary", wikiSummaryUrl),
  fetchData("wikiPageViews", wikiPageViewsURL)
];

export default connect(state => ({data: state.data, location: state.location}), {})(Country);
