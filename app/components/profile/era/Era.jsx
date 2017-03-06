import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import ProfileNav from "components/profile/Nav";
import Section from "components/profile/Section";
import Header from "components/profile/era/Header";
import Intro from "components/profile/era/Intro";
import Footer from "components/profile/era/Footer";
import PeopleRanking from "components/profile/era/PeopleRanking";
import {fetchEra, fetchEras, fetchPeopleBornInEra, fetchPeopleDiedInEra} from "actions/era";

class Era extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {era, eras, peopleBornInEra, peopleDiedInEra} = this.props.eraProfile;

    const sections = [
      {title: "Most Remembered", slug: "people", content: <PeopleRanking era={era} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />},
      {title: "Occupations", slug: "occupations", content: null},
      {title: "Occupations Over Time", slug: "occupations_over_time", content: null},
      {title: "Places", slug: "places", content: null},
      {title: "Places Over Time", slug: "places_over_time", content: null},
      {title: "Overlapping Lives", slug: "overlapping_lives", content: null}
    ];

    return (
      <div>
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={`${era.name} - Pantheon`}
          meta={config.meta.concat([{property: "og:title", content: era.name}])}
          link={config.link}
        />
        <Header era={era} />
        <Intro era={era} eras={eras} peopleBorn={peopleBornInEra.slice(0, 3)} />
        <ProfileNav sections={sections} />
        {sections.map((section, key) =>
          <Section
            index={key}
            key={key}
            numSections={sections.length}
            title={section.title}
            slug={section.slug}>
            {section.content ? section.content : null}
            {section.viz && section.viz.length ? section.viz : null}
          </Section>
        )}
        <Footer />
      </div>
    );
  }

}

Era.need = [
  fetchEra,
  fetchEras,
  fetchPeopleBornInEra,
  fetchPeopleDiedInEra
];

function mapStateToProps(state) {
  return {
    eraProfile: state.eraProfile
  };
}

export default connect(mapStateToProps)(Era);
