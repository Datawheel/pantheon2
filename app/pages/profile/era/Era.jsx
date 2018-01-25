import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "datawheel-canon";
// import Helmet from "react-helmet";
// import config from "helmconfig.js";
// import ProfileNav from "pages/profile/Nav";
import Header from "pages/profile/era/Header";
import Intro from "pages/profile/era/Intro";
// import Footer from "pages/profile/era/Footer";
import PeopleRanking from "pages/profile/era/sections/PeopleRanking";
import Occupations from "pages/profile/era/sections/Occupations";
import OccupationsOverTime from "pages/profile/era/sections/OccupationsOverTime";
import GeomapBirth from "pages/profile/era/sections/GeomapBirth";
import GeomapDeath from "pages/profile/era/sections/GeomapDeath";
import OverlappingLives from "pages/profile/era/sections/OverlappingLives";
import "pages/profile/common/Structure.css";

class Era extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {era, eras, occupations, peopleBornInEra, peopleDiedInEra} = this.props.data;

    return (
      <div>
        <Header era={era} />
        <div className="about-section">
          <Intro era={era} eras={eras} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        </div>
        <PeopleRanking era={era} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <Occupations era={era} occupations={occupations} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <OccupationsOverTime occupations={occupations} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />
        <GeomapBirth era={era} peopleBorn={peopleBornInEra} />
        <GeomapDeath era={era} peopleDied={peopleDiedInEra} />
        <OverlappingLives era={era} occupations={occupations} peopleBorn={peopleBornInEra} />
      </div>
    );
  }

}

const eraURL = "http://localhost:3100/era?slug=eq.<id>";
const allErasURL = "http://localhost:3100/era?order=start_year";
const peopleBornInEraURL = "http://localhost:3100/person?birthyear=gte.<era.start_year>&birthyear=lte.<era.end_year>&order=hpi.desc.nullslast&select=birthplace{id,name,slug,lat_lon},birthcountry{id,continent,country_code,country_name,name,slug},occupation{*},occupation_id:occupation,*";
const peopleDiedInEraURL = "http://localhost:3100/person?deathyear=gte.<era.start_year>&deathyear=lte.<era.end_year>&order=hpi.desc.nullslast&select=deathcountry{id,continent,country_code,country_name,name,slug},deathplace{id,name,slug,lat_lon},occupation{*},occupation_id:occupation,*";
const allOccupationsURL = "http://localhost:3100/occupation?order=num_born.desc.nullslast";

Era.preneed = [
  fetchData("era", eraURL, res => res[0]),
  fetchData("eras", allErasURL, res => res),
  fetchData("occupations", allOccupationsURL, res => res)
];

Era.need = [
  fetchData("peopleBornInEra", peopleBornInEraURL, res => res),
  fetchData("peopleDiedInEra", peopleDiedInEraURL, res => res)
];

export default connect(state => ({data: state.data}), {})(Era);
