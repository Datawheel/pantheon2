import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/place/Header";
import ProfileNav from "pages/profile/common/Nav";
import Intro from "pages/profile/place/Intro";
import Footer from "pages/profile/place/Footer";
import PeopleRanking from "pages/profile/place/sections/PeopleRanking";
import Occupations from "pages/profile/place/sections/Occupations";
import OccupationTrends from "pages/profile/place/sections/OccupationTrends";
import GeomapBirth from "pages/profile/place/sections/GeomapBirth";
import GeomapDeath from "pages/profile/place/sections/GeomapDeath";
import Lifespans from "pages/profile/place/sections/Lifespans";
import LivingPeople from "pages/profile/place/sections/LivingPeople";
import NotFound from "components/NotFound";
import {NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";
import "pages/profile/common/Structure.css";

class Place extends Component {

  constructor(props) {
    super(props);
    this.sections = [
      {slug: "people", title: "People"},
      {slug: "occupations", title: "Occupations"},
      {slug: "occupational-trends", title: "Occupational Trends"},
      {slug: "death-places", title: "Death places"},
      {slug: "birth-places", title: "Birth places"},
      {slug: "overlapping-lives", title: "Overlapping Lives"},
      {slug: "living-people", title: "Living People"}
    ];
  }

  componentDidMount() {
    // generate screenshot on page load
    const {id: slug} = this.props.params;
    const {place} = this.props.data;
    if (place !== undefined) {
      const screenshotUrl = `/api/screenshot/place/${slug}/`;
      axios.get(screenshotUrl);
    }
  }

  render() {
    const {place, country, peopleBornHere, peopleDiedHere, placeRanks, occupations, peopleBornHereAlive, wikiExtract, wikiSummary, wikiImg, wikiPageViews} = this.props.data;
    if (place === undefined) {
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
          return {property: "og:title", content: place.place};
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
          title={place.place}
          meta={pageHeaderMetaTags}
        />
        <Header place={place} country={country} people={peopleBornHere} wikiSummary={wikiSummary} wikiPageViews={wikiPageViews} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro place={place} country={country} placeRanks={placeRanks} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} wikiSummary={wikiSummary} />
        </div>
        <PeopleRanking country={country} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <Occupations attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        {peopleBornHere.length > 10 ? <OccupationTrends attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} occupations={occupations} /> : null}
        {peopleBornHere.filter(p => p.birthyear !== null && p.dplace_geonameid).length ? <GeomapBirth place={place} peopleBorn={peopleBornHere} /> : null}
        {peopleDiedHere.filter(p => p.deathyear !== null).length ? <GeomapDeath place={place} peopleDied={peopleDiedHere} /> : null}
        {peopleBornHere.filter(p => p.deathyear !== null && p.birthyear > 1699).length && place.country ? <Lifespans attrs={attrs} place={place} peopleBorn={peopleBornHere} /> : null}

        {/* <LivingPeople place={place} data={peopleBornHereAlive} /> */}
        <Footer occupations={occupations} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const placeURL = "/place?slug=eq.<id>";
const countryURL = "/country?id=eq.<place.country>";
// const peopleBornHereURL = "/person?<place.birthPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=birthplace(id,name,slug,lat_lon),occupation(*),occupation_id:occupation,*";
const peopleBornHereURL = "/person?bplace_geonameid=eq.<place.id>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*";
// const peopleDiedHereURL = "/person?<place.deathPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=deathplace(id,name,slug,lat_lon),occupation(*),occupation_id:occupation,*";
const peopleDiedHereURL = "/person?dplace_geonameid=eq.<place.id>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*";
const placeRanksURL = "/place?born_rank_unique=gte.<place.placeRankLow>&born_rank_unique=lte.<place.placeRankHigh>&order=born_rank_unique";
const occupationsURL = "/occupation?order=num_born.desc.nullslast";
const peopleBornHereAliveURL = "/person?bplace_geonameid=eq.<place.id>&limit=3&order=hpi.desc.nullslast&alive=is.true";
// const wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=600&explaintext&format=json&exlimit=1&titles=<place.place>&origin=*";
// const wikiImgURL = "https://en.wikipedia.org/w/api.php?action=query&titles=<place.place>&prop=pageimages&format=json&pithumbsize=1000&origin=*";
const wikiSummaryUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/<place.place>";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<place.place>/monthly/20110101/${year}${month}01`;

Place.preneed = [
  fetchData("place", placeURL, res => {
    const place = res[0];

    const placeRankLow = Math.max(1, parseInt(place.born_rank_unique, 10) - NUM_RANKINGS_PRE);
    const placeRankHigh = Math.max(NUM_RANKINGS, parseInt(place.born_rank_unique, 10) + NUM_RANKINGS_POST);

    return Object.assign({placeRankLow, placeRankHigh}, place);
  })
];


Place.need = [
  fetchData("country", countryURL, res => res.length ? res[0] : null),
  // fetchData("country", countryURL)
  fetchData("peopleBornHere", peopleBornHereURL, res => res),
  fetchData("peopleDiedHere", peopleDiedHereURL, res => res),
  fetchData("placeRanks", placeRanksURL, res => res),
  fetchData("occupations", occupationsURL, res => res),
  // fetchData("peopleBornHereAlive", peopleBornHereAliveURL, res => res),
  fetchData("wikiSummary", wikiSummaryUrl),
  fetchData("wikiPageViews", wikiPageViewsURL)
];

export default connect(state => ({data: state.data, location: state.location}), {})(Place);
