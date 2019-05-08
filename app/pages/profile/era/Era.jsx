import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import Helmet from "react-helmet";
import config from "helmet.js";
import ProfileNav from "pages/profile/common/Nav";
import Header from "pages/profile/era/Header";
import Intro from "pages/profile/era/Intro";
import Footer from "pages/profile/era/Footer";
import PeopleRanking from "pages/profile/era/sections/PeopleRanking";
import Occupations from "pages/profile/era/sections/Occupations";
import OccupationsOverTime from "pages/profile/era/sections/OccupationsOverTime";
import GeomapBirth from "pages/profile/era/sections/GeomapBirth";
import GeomapDeath from "pages/profile/era/sections/GeomapDeath";
import OverlappingLives from "pages/profile/era/sections/OverlappingLives";
import NotFound from "components/NotFound";
import "pages/profile/common/Structure.css";

class Era extends Component {

  constructor(props) {
    super(props);
    this.sections = [
      {slug: "most-remembered", title: "Most Remembered"},
      {slug: "occupations", title: "Occupations"},
      {slug: "occupations-over-time", title: "Occupations Over Time"},
      {slug: "major-cities-by-number-of-births", title: "Major Cities By Number of Births"},
      {slug: "major-cities-by-number-of-deaths", title: "Major Cities By Number of Deaths"},
      {slug: "overlapping-lives", title: "Overlapping Lives"}
    ];
  }

  componentDidMount() {
    // generate screenshot on page load
    const {id: slug} = this.props.params;
    const screenshotUrl = `/api/screenshot/era/${slug}/`;
    axios.get(screenshotUrl);
  }

  render() {
    const {era, eras, occupations, peopleBornInEra, peopleDiedInEra} = this.props.data;

    if (era === undefined || era.id === null) {
      return <NotFound />;
    }

    return (
      <div>
        <Helmet
          title={era.name}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: era.name} : meta)}
        />
        <Header era={era} />
        <div className="about-section">
          <ProfileNav sections={this.sections} />
          <Intro era={era} eras={eras} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        </div>
        <PeopleRanking era={era} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <Occupations era={era} occupations={occupations} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <OccupationsOverTime occupations={occupations} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <GeomapBirth era={era} peopleBorn={peopleBornInEra} />
        <GeomapDeath era={era} peopleDied={peopleDiedInEra} />
        <OverlappingLives era={era} occupations={occupations} peopleBorn={peopleBornInEra} />
        <Footer />
      </div>
    );
  }

}

const eraURL = "/era?slug=eq.<id>";
const allErasURL = "/era?order=start_year";
const peopleBornInEraURL = "/person?birthyear=gte.<era.start_year>&birthyear=lte.<era.end_year>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug,lat,lon),bplace_country(id,continent,country_code,country,slug),occupation(*),occupation_id:occupation,*";
const peopleDiedInEraURL = "/person?deathyear=gte.<era.start_year>&deathyear=lte.<era.end_year>&order=hpi.desc.nullslast&select=dplace_country(id,continent,country_code,country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(*),occupation_id:occupation,*";
const allOccupationsURL = "/occupation?order=num_born.desc.nullslast";

Era.preneed = [
  fetchData("era", eraURL, res => res[0] || {id: null, start_year: 0, end_year: 0}),
  fetchData("eras", allErasURL, res => res),
  fetchData("occupations", allOccupationsURL, res => res)
];

Era.need = [
  fetchData("peopleBornInEra", peopleBornInEraURL, res => res),
  fetchData("peopleDiedInEra", peopleDiedInEraURL, res => res)
];

export default connect(state => ({data: state.data}), {})(Era);
