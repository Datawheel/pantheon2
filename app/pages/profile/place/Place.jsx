import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "datawheel-canon";
// import config from "helmconfig.js";
import Header from "pages/profile/place/Header";
// import ProfileNav from "pages/profile/Nav";
import Intro from "pages/profile/place/Intro";
// import Footer from "pages/profile/place/Footer";
import PeopleRanking from "pages/profile/place/sections/PeopleRanking";
import Occupations from "pages/profile/place/sections/Occupations";
import OccupationTrends from "pages/profile/place/sections/OccupationTrends";
import GeomapBirth from "pages/profile/place/sections/GeomapBirth";
import GeomapDeath from "pages/profile/place/sections/GeomapDeath";
import Lifespans from "pages/profile/place/sections/Lifespans";
import LivingPeople from "pages/profile/place/sections/LivingPeople";
import "pages/profile/common/Structure.css";
import {NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";

// <ProfileNav sections={sections} />
// <Intro place={place} country={country} placeRanks={placeRanks} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} />

class Place extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {place, country, peopleBornHere, peopleDiedHere, placeRanks, occupations, peopleBornHereAlive} = this.props.data;

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    return (
      <div>
        <Header place={place} country={country} people={peopleBornHere} />
        <div className="about-section">
          <Intro place={place} country={country} placeRanks={placeRanks} peopleBornHere={peopleBornHere} peopleDiedHere={peopleDiedHere} />
        </div>
        <PeopleRanking place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <Occupations attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />
        <OccupationTrends attrs={attrs} place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} occupations={occupations} />
        <GeomapBirth country={country} peopleBorn={peopleBornHere} />
        <GeomapDeath country={country} peopleDied={peopleDiedHere} />
        <Lifespans attrs={attrs} place={place} peopleBorn={peopleBornHere} />
        <LivingPeople place={place} data={peopleBornHereAlive} />
      </div>
    );
  }
}

const placeURL = "http://localhost:3100/place?slug=eq.<id>";
const countryURL = "http://localhost:3100/place?country_code=eq.<place.country_code>&is_country=is.true";
const peopleBornHereURL = "http://localhost:3100/person?<place.birthPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=birthplace{id,name,slug,lat_lon},occupation{*},occupation_id:occupation,*";
const peopleDiedHereURL = "http://localhost:3100/person?<place.deathPlaceColumn>=eq.<place.id>&order=hpi.desc.nullslast&select=deathplace{id,name,slug,lat_lon},occupation{*},occupation_id:occupation,*";
const placeRanksURL = "http://localhost:3100/place?born_rank_unique=gte.<place.placeRankLow>&born_rank_unique=lte.<place.placeRankHigh>&order=born_rank_unique&<place.sumlevelFilter>";
const occupationsURL = "http://localhost:3100/occupation?order=num_born.desc.nullslast";
const peopleBornHereAliveURL = "http://localhost:3100/person?<place.birthPlaceColumn>=eq.<place.id>&limit=3&order=hpi.desc.nullslast&alive=is.true";

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
  fetchData("peopleBornHereAlive", peopleBornHereAliveURL, res => res)
];

export default connect(state => ({data: state.data}), {})(Place);
