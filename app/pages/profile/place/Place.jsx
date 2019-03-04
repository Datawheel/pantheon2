import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
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
import {NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";
import "pages/profile/common/Structure.css";

class Place extends Component {

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

  render() {
    const {place, country, peopleBornHere, peopleDiedHere, placeRanks, occupations, peopleBornHereAlive, wikiExtract} = this.props.data;

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    return (
      <div>
        <Helmet
          title={place.name}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: place.name} : meta)}
        />
        <Header place={place} country={country} people={peopleBornHere} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro place={place} country={country} placeRanks={placeRanks} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} wikiExtract={wikiExtract} />
        </div>
        <PeopleRanking place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <Occupations attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <OccupationTrends attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} occupations={occupations} />
        <GeomapBirth country={country} peopleBorn={peopleBornHere} />
        {peopleBornHere.filter(p => p.deathyear !== null).length ? <GeomapDeath country={country} peopleDied={peopleDiedHere} /> : null}
        {peopleBornHere.filter(p => p.deathyear !== null).length ? <Lifespans attrs={attrs} place={place} peopleBorn={peopleBornHere} /> : null}

        {/* <LivingPeople place={place} data={peopleBornHereAlive} /> */}
        <Footer />
      </div>
    );
  }
}

const placeURL = "/place?slug=eq.<id>";
const countryURL = "/place?country_code=eq.<place.country_code>&is_country=is.true";
const peopleBornHereURL = "/person?<place.birthPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=birthplace(id,name,slug,lat_lon),occupation(*),occupation_id:occupation,*";
const peopleDiedHereURL = "/person?<place.deathPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=deathplace(id,name,slug,lat_lon),occupation(*),occupation_id:occupation,*";
const placeRanksURL = "/place?born_rank_unique=gte.<place.placeRankLow>&born_rank_unique=lte.<place.placeRankHigh>&order=born_rank_unique&<place.sumlevelFilter>";
const occupationsURL = "/occupation?order=num_born.desc.nullslast";
const peopleBornHereAliveURL = "/person?<place.birthPlaceColumn>=eq.<place.id>&limit=3&order=hpi.desc.nullslast&alive=is.true";
const wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exchars=600&explaintext&format=json&exlimit=1&titles=<place.name>&origin=*";

Place.preneed = [
  fetchData("place", placeURL, res => {
    const place = res[0];

    const birthPlaceColumn = place.name === place.country_name ? "birthcountry" : "birthplace";
    const deathPlaceColumn = place.name === place.country_name ? "deathcountry" : "deathplace";

    const placeRankLow = Math.max(1, parseInt(place.born_rank_unique, 10) - NUM_RANKINGS_PRE);
    const placeRankHigh = Math.max(NUM_RANKINGS, parseInt(place.born_rank_unique, 10) + NUM_RANKINGS_POST);
    const sumlevelFilter = place.name === place.country_name ? "is_country=is.true" : "is_country=is.false";

    return Object.assign({birthPlaceColumn, deathPlaceColumn, placeRankLow, placeRankHigh, sumlevelFilter}, place);
  })
];


Place.need = [
  fetchData("country", countryURL, res => res[0]),
  fetchData("peopleBornHere", peopleBornHereURL, res => res),
  fetchData("peopleDiedHere", peopleDiedHereURL, res => res),
  fetchData("placeRanks", placeRanksURL, res => res),
  fetchData("occupations", occupationsURL, res => res),
  fetchData("peopleBornHereAlive", peopleBornHereAliveURL, res => res),
  fetchData("wikiExtract", wikiURL)
];

export default connect(state => ({data: state.data}), {})(Place);
