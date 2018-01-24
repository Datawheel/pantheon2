import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "datawheel-canon";
// import Helmet from "react-helmet";
// import config from "helmconfig.js";
import Header from "pages/profile/occupation/Header";
// import ProfileNav from "pages/profile/Nav";
import Intro from "pages/profile/occupation/Intro";
// import Footer from "pages/profile/occupation/Footer";
import People from "pages/profile/occupation/sections/People";
import Places from "pages/profile/occupation/sections/Places";
import PlacesTime from "pages/profile/occupation/sections/PlacesTime";
import OverlappingLives from "pages/profile/occupation/sections/OverlappingLives";
import RelatedOccupations from "pages/profile/occupation/sections/RelatedOccupations";
import "pages/profile/common/Structure.css";

class Occupation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    // console.log(this.props);
    const {occupation, occupations, people, peopleInDomain, eras} = this.props.data;

    return (
      <div>
        <Header occupation={occupation} people={people} />
        <div className="about-section">
          <Intro occupation={occupation} occupations={occupations} />
        </div>
        <People occupation={occupation} people={people} />
        <Places people={people} occupation={occupation} />
        <PlacesTime eras={eras} people={people} occupation={occupation} />
        <OverlappingLives people={people} occupation={occupation} />
        <RelatedOccupations peopleInDomain={peopleInDomain} occupation={occupation} occupations={occupations} />
      </div>
    );
  }
}

const occupationURL = "http://localhost:3100/occupation?occupation_slug=eq.<id>";
const allOccupationsURL = "http://localhost:3100/occupation?order=num_born.desc.nullslast";
const allErasURL = "http://localhost:3100/era?order=start_year";
const peopleURL = "http://localhost:3100/person?occupation=eq.<occupation.id>&order=hpi.desc.nullslast&select=birthplace{id,name,slug},birthcountry{id,continent,country_name,name,slug},deathcountry{id,continent,country_name,name,slug},deathplace{id,name,slug},occupation{*},occupation_id:occupation,*";
const peopleInDomainURL = "http://localhost:3100/";

Occupation.preneed = [
  fetchData("occupations", allOccupationsURL, res => res),
  fetchData("eras", allErasURL, res => res),
  fetchData("occupation", occupationURL, res => {
    const occupation = res[0];

    // const placeRankLow = Math.max(1, parseInt(place.born_rank_unique, 10) - NUM_RANKINGS_PRE);
    // const placeRankHigh = Math.max(NUM_RANKINGS, parseInt(place.born_rank_unique, 10) + NUM_RANKINGS_POST);
    // const sumlevelFilter = place.name === place.country_name ? "is_country=is.true" : "is_country=is.false";

    return Object.assign({}, occupation);
  })
];

Occupation.need = [
  fetchData("people", peopleURL, res => res),
  fetchData("domain", "http://localhost:3100/occupation?domain_slug=eq.<occupation.domain_slug>&select=id", res => {
    const occIds = res.reduce((arr, obj) => arr.concat([obj.id]), []);
    return {occIds: `${occIds}`};
  })
  // fetchData("peopleInDomain", peopleInDomainURL, res => res),
  // fetchData("eras", erasURL, res => res)
];

Occupation.postneed = [
  fetchData("peopleInDomain", "http://localhost:3100/person?occupation=in.<domain.occIds>&order=langs.desc&select=occupation{*},occupation_id:occupation,*", res => res)
];

export default connect(state => ({data: state.data}), {})(Occupation);
