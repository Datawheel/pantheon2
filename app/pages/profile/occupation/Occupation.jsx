import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "datawheel-canon";
import Helmet from "react-helmet";
import config from "helmet.js";
import Header from "pages/profile/occupation/Header";
import {plural} from "pluralize";
import ProfileNav from "pages/profile/common/Nav";
import Intro from "pages/profile/occupation/Intro";
import Footer from "pages/profile/occupation/Footer";
import People from "pages/profile/occupation/sections/People";
import Places from "pages/profile/occupation/sections/Places";
import PlacesTime from "pages/profile/occupation/sections/PlacesTime";
import OverlappingLives from "pages/profile/occupation/sections/OverlappingLives";
import RelatedOccupations from "pages/profile/occupation/sections/RelatedOccupations";
import "pages/profile/common/Structure.css";

class Occupation extends Component {

  constructor(props) {
    super(props);
    this.sections = [
      {slug: "people", title: "People"},
      {slug: "places", title: "Places"},
      {slug: "places-over-time", title: "Places Over Time"},
      {slug: "overlapping-lives", title: "Overlapping Lives"},
      {slug: "related-occupations", title: "Related Occupations"}
    ];
  }

  render() {
    const {occupation, occupations, people, peopleInDomain, eras} = this.props.data;

    return (
      <div>
        <Helmet
          title={plural(occupation.occupation)}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: plural(occupation.occupation)} : meta)}
        />
        <Header occupation={occupation} people={people} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro occupation={occupation} occupations={occupations} />
        </div>
        <People occupation={occupation} people={people} />
        <Places people={people} occupation={occupation} />
        <PlacesTime eras={eras} people={people} occupation={occupation} />
        <OverlappingLives people={people} occupation={occupation} />
        <RelatedOccupations peopleInDomain={peopleInDomain} occupation={occupation} occupations={occupations} />
        <Footer />
      </div>
    );
  }
}

const occupationURL = "http://localhost:3100/occupation?occupation_slug=eq.<id>";
const allOccupationsURL = "http://localhost:3100/occupation?order=num_born.desc.nullslast";
const allErasURL = "http://localhost:3100/era?order=start_year";
const peopleURL = "http://localhost:3100/person?occupation=eq.<occupation.id>&order=hpi.desc.nullslast&select=birthplace{id,name,slug},birthcountry{id,continent,country_name,name,slug},deathcountry{id,continent,country_name,name,slug},deathplace{id,name,slug},occupation{*},occupation_id:occupation,*";
const occsInDomainURL = "http://localhost:3100/occupation?domain_slug=eq.<occupation.domain_slug>&select=id";
const peopleInDomainURL = "http://localhost:3100/person?occupation=in.<domain.occIds>&order=langs.desc&select=occupation{*},occupation_id:occupation,*";

Occupation.preneed = [
  fetchData("occupations", allOccupationsURL, res => res),
  fetchData("eras", allErasURL, res => res),
  fetchData("occupation", occupationURL, res => res[0])
];

Occupation.need = [
  fetchData("people", peopleURL, res => res),
  fetchData("domain", occsInDomainURL, res => {
    const occIds = res.reduce((arr, obj) => arr.concat([obj.id]), []);
    return {occIds: `${occIds}`};
  })
];

Occupation.postneed = [
  fetchData("peopleInDomain", peopleInDomainURL, res => res)
];

export default connect(state => ({data: state.data}), {})(Occupation);
