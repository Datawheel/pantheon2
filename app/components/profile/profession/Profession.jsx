import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/profession/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/profession/Intro";
import People from "components/profile/profession/People";
import Section from "components/profile/Section";
import { fetchProfession, fetchPeople, fetchAllProfessions } from "actions/profession";

class Profession extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchProfession,
    fetchPeople,
    fetchAllProfessions
  ]

  render() {
    const {professionProfile} = this.props;
    const {profession, professions, people} = professionProfile;

    const sections = [
      {title: "People", slug: "people", content: <People profession={profession} people={people} />},
      {title: "Memorability Metrics", slug: "metrics"},
    ];

    // return (<div>testing profession...</div>)
    return (
      <div>
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title={profession.name}
          meta={config.meta.concat([ {property: 'og:title', content: profession.name} ])}
          link={config.link}
        />
        <Header profession={profession} people={people} />
        <ProfileNav sections={sections} />
        <Intro profession={profession} professions={professions} />
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
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    professionProfile: state.professionProfile
  };
}

export default connect(mapStateToProps)(Profession);
