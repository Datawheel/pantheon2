import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import {fetchData} from "@datawheel/canon-core";
import {Helmet} from "react-helmet-async";
import axios from "axios";
import config from "helmet.js";
import {plural} from "pluralize";
import {toTitleCase} from "viz/helpers";
import ProfileNav from "pages/profile/common/Nav";
import Header from "pages/profile/occupation-country/Header";
import Intro from "pages/profile/occupation-country/Intro";
import TopTen from "pages/profile/occupation-country/sections/TopTen";
import Footer from "pages/profile/occupation-country/sections/Footer";
import People from "pages/profile/occupation-country/sections/People";
import OverlappingLives from "pages/profile/occupation-country/sections/OverlappingLives";
import NotFound from "components/NotFound";
import "pages/profile/common/Structure.css";

class OccupationCountry extends Component {

  constructor(props) {
    super(props);
    this.sections = [
      {slug: "top-10", title: "Top 10"},
      {slug: "people", title: "People"},
      {slug: "overlapping-lives", title: "Overlapping Lives"}
    ];
  }

  render() {
    const {allCountriesInOccupation, allOccupationsInCountry, country, occupation, people: peopleObj, wikiSummaries} = this.props.data;
    const people = peopleObj.people;

    if (occupation === undefined || occupation.id === null) {
      return <NotFound />;
    }

    if (!people.length) {
      return <NotFound />;
    }

    return (
      <div>
        <Helmet
          title={`Greatest ${country.demonym} ${toTitleCase(plural(occupation.occupation))} | Famous ${toTitleCase(plural(occupation.occupation))} from ${country.country}`}
          meta={config.meta.map(meta => {
            if (meta.property && meta.property === "og:title") {
              return {property: "og:title", content: `Greatest ${country.demonym} ${toTitleCase(plural(occupation.occupation))} Of All Time`};
            }
            if (meta.property && meta.property === "og:description") {
              return {property: "og:description", content: `A list of the best ${country.demonym} ${toTitleCase(plural(occupation.occupation))} including a ranking of the top 10 most famous ${toTitleCase(plural(occupation.occupation))} from ${country.country}.`};
            }
            return meta;
          })}
        />
        <Header country={country} occupation={occupation} people={people} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro country={country} occupation={occupation} allCountriesInOccupation={allCountriesInOccupation} allOccupationsInCountry={allOccupationsInCountry} />
        </div>
        <TopTen country={country} occupation={occupation} people={people} wikiSummaries={wikiSummaries} />
        <People occupation={occupation} people={people} />
        <OverlappingLives people={people} occupation={occupation} />
        {/*
        <PlacesTime eras={eras} people={people} occupation={occupation} />
        <RelatedOccupations occupation={occupation} occupations={occupations} /> */}
        <Footer allCountriesInOccupation={allCountriesInOccupation} allOccupationsInCountry={allOccupationsInCountry} />
      </div>
    );
  }
}

const occupationURL = "/occupation?occupation_slug=eq.<occupationSlug>";
const countryURL = "/country?slug=eq.<countrySlug>";
const allOccupationsInCountryURL = "/occupation_country?country=eq.<country.id>&order=num_people.desc.nullslast";
const allCountriesInOccupationURL = "/occupation_country?occupation=eq.<occupation.occupation>&order=num_people.desc.nullslast";
const peopleURL = "/person?occupation=eq.<occupation.id>&bplace_country=eq.<country.id>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(id,occupation,domain,num_born,hpi,l,occupation_slug,domain_slug),occupation_id:occupation,name,slug,id,hpi,gender,birthyear,deathyear,alive,hpi_prev,l";
const occsInDomainURL = "/occupation?domain_slug=eq.<occupation.domain_slug>&select=id";
const wikiSummariesURL = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=<people.top10Ids>";
// const peopleInDomainURL = "/person?occupation=in.(<domain.occIds>)&order=l.desc&select=occupation(*),occupation_id:occupation,*";

OccupationCountry.preneed = [
  fetchData("occupation", occupationURL, res => res[0] || {id: null, domain_slug: null}),
  fetchData("country", countryURL, res => res[0] || {id: null, domain_slug: null})
];

OccupationCountry.need = [
  fetchData("people", peopleURL, res => {
    const people = res;
    const top10Ids = people.slice(0, 10).map(p => p.id).join("|");
    return {people, top10Ids};
  }),
  fetchData("domain", occsInDomainURL, res => {
    const occIds = res.reduce((arr, obj) => arr.concat([obj.id]), []);
    return {occIds: `${occIds}`};
  }),
  fetchData("allOccupationsInCountry", allOccupationsInCountryURL, res => res),
  fetchData("allCountriesInOccupation", allCountriesInOccupationURL, res => res)
];

OccupationCountry.postneed = [
  fetchData("wikiSummaries", wikiSummariesURL, res => res)
];


export default connect(state => ({data: state.data}), {})(hot(OccupationCountry));
