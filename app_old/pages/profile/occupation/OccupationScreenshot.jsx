import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {Helmet} from "react-helmet-async";
import config from "helmet.js";
import Header from "pages/profile/occupation/Header";
import {plural} from "pluralize";
import "pages/profile/common/Structure.css";

class OccupationScreenshot extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {occupation, people} = this.props.data;

    return (
      <div>
        <Helmet
          title={plural(occupation.occupation)}
          meta={config.meta.map(meta => meta.property && meta.property === "og:title" ? {property: "og:title", content: plural(occupation.occupation)} : meta)}
        />
        <Header occupation={occupation} people={people} />
      </div>
    );
  }
}

const occupationURL = "/occupation?occupation_slug=eq.<id>";
const peopleURL = "/person?occupation=eq.<occupation.id>&order=hpi.desc.nullslast&select=bplace_geonameid(id,place,slug),bplace_country(id,continent,country,slug),dplace_country(id,continent,country,slug),dplace_geonameid(id,place,slug),occupation(*),occupation_id:occupation,*";

OccupationScreenshot.preneed = [
  fetchData("occupation", occupationURL, res => res[0])
];

OccupationScreenshot.need = [
  fetchData("people", peopleURL, res => res)
];

export default connect(state => ({data: state.data}), {})(OccupationScreenshot);
