import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import axios from "axios";
import config from "helmet.js";
import Header from "pages/profile/occupation/Header";
import {plural} from "pluralize";
import {toTitleCase} from "viz/helpers";
import ProfileNav from "pages/profile/common/Nav";
import Intro from "pages/profile/occupation/Intro";
import Footer from "pages/profile/occupation/Footer";
import People from "pages/profile/occupation/sections/People";
import Places from "pages/profile/occupation/sections/Places";
import PlacesTime from "pages/profile/occupation/sections/PlacesTime";
import OverlappingLives from "pages/profile/occupation/sections/OverlappingLives";
import RelatedOccupations from "pages/profile/occupation/sections/RelatedOccupations";
import NotFound from "components/NotFound";
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

  componentDidMount() {
    // generate screenshot on page load
    const {id: slug} = this.props.params;
    const screenshotUrl = `/api/screenshot/occupation/${slug}/`;
    axios.get(screenshotUrl);
  }

  render() {
    // const {occupation, occupations, people, peopleInDomain, eras} = this.props.data;
    const {occupation, occupations, people, eras} = this.props.data;

    if (occupation === undefined || occupation.id === null) {
      return <NotFound />;
    }

    return (
      <div>
        <Helmet
          title={toTitleCase(plural(occupation.occupation))}
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
        <RelatedOccupations occupation={occupation} occupations={occupations} />
        <Footer />
      </div>
    );
  }
}

const occupationURL = "/occupation?occupation_slug=eq.<id>";
const allOccupationsURL = "/occupation?order=num_born.desc.nullslast&select=id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug";
const allErasURL = "/era?order=start_year";
const peopleURL = "/person?occupation=eq.<occupation.id>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,hpi,gender,birthyear,deathyear,occupation_rank_unique,alive";
const occsInDomainURL = "/occupation?domain_slug=eq.<occupation.domain_slug>&select=id";
// const peopleInDomainURL = "/person?occupation=in.(<domain.occIds>)&order=l.desc&select=occupation(*),occupation_id:occupation,*";

Occupation.preneed = [
  fetchData("occupations", allOccupationsURL, res => res),
  fetchData("eras", allErasURL, res => res),
  fetchData("occupation", occupationURL, res => res[0] || {id: null, domain_slug: null})
];

Occupation.need = [
  fetchData("people", peopleURL, res => res),
  fetchData("domain", occsInDomainURL, res => {
    const occIds = res.reduce((arr, obj) => arr.concat([obj.id]), []);
    return {occIds: `${occIds}`};
  })
];

// Occupation.postneed = [
//   fetchData("peopleInDomain", peopleInDomainURL, res => res)
// ];

export default connect(state => ({data: state.data}), {})(Occupation);
