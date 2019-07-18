import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {Link} from "react-router";
import NotFound from "components/NotFound";

import "pages/about/Misc.css";
import "pages/about/About.css";
import "pages/apps/yearbook/Yearbook.css";

class Yearbook extends Component {

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

  }

  render() {
    const {peopleBornInYear} = this.props.data;
    const {year} = this.props.params;

    if (!peopleBornInYear || !peopleBornInYear.length) {
      return <NotFound />;
    }
    const topPersonM = peopleBornInYear.find(d => d.gender === "M");
    const topPersonF = peopleBornInYear.find(d => d.gender === "F");

    return <div>
      <div className="section long-text">
        <h1>Pantheon {year} Yearbook</h1>
        <div className="portrait-container">
          <div className="portrait-desc">
            <h2><Link to={`/profile/person/${topPersonF.slug}`}>{topPersonF.name}</Link></h2>
          </div>
          <div className="portrait">
            <img src={`/images/profile/people/${topPersonF.id}.jpg`} />
            <div className="shadow"></div>
          </div>
          <div className="portrait">
            <img src={`/images/profile/people/${topPersonM.id}.jpg`} />
            <div className="shadow"></div>
          </div>
          <div className="portrait-desc">
            <h2><Link to={`/profile/person/${topPersonM.slug}`}>{topPersonM.name}</Link></h2>
          </div>
        </div>

        <section className="top-grid">
          {peopleBornInYear.slice(0, 100).map((person, i) =>
            <div key={person.id}>
              <span className="grid-portrait-container">
                <img src={`/images/profile/people/${person.id}.jpg`} onError={evt => evt.target.style.display = "none"} />
              </span>
              {i + 1}. <Link to={`/profile/person/${person.slug}`}>{person.name}</Link>
            </div>
          )}
        </section>
      </div>
    </div>;
  }

}


Yearbook.need = [
  fetchData("peopleBornInYear", "/person?select=name,l,l_,age,non_en_page_views,coefficient_of_variation,hpi,id,slug,gender,birthyear,deathyear,bplace_country(id,country,continent,slug),bplace_geonameid(id,place,country,slug,lat,lon),dplace_geonameid(id,place,country,slug),occupation_id:occupation,occupation(id,occupation,occupation_slug)&birthyear=eq.<year>&hpi=gte.4&order=hpi.desc.nullslast")
];

export default connect(state => ({data: state.data}), {})(Yearbook);
