import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/place/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/place/Intro";
import Section from "components/profile/Section";
import PeopleRanking from "components/profile/place/PeopleRanking";
import Professions from "components/profile/place/Professions";
import LivingPeople from "components/profile/place/LivingPeople";
import Viz from "components/viz/Index";
import { fetchPlace, fetchPeopleBornHere, fetchProfessionsHere, fetchProfessions, fetchPeopleBornHereAlive } from "actions/place";

class Place extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchPlace,
    fetchPeopleBornHere,
    fetchProfessions,
    fetchProfessionsHere,
    fetchPeopleBornHereAlive
  ]

  render() {
    const {placeProfile} = this.props;
    const {place, peopleBornHere, professionsHere, professions, peopleBornHereAlive} = placeProfile;

    const sections = [
      {title: "People", slug: "people", content: <PeopleRanking ranking={peopleBornHere.slice(0, 12)} />},
      {
        title: "Professions",
        slug: "professions",
        content: <Professions data={professionsHere} />,
        viz: <Viz type="Treemap"
                  config={{
                    attrs: professions,
                    data: peopleBornHere,
                    groupBy: ["domain", "group", "name"],
                    time: d => d.birthyear
                  }} />
      },
      {title: "Profession Trends", slug: "profession_trends"},
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {title: "Overlapping Lives", slug: "overlapping_lives"},
      {title: "Living People", slug: "living_people", content: <LivingPeople place={place} data={peopleBornHereAlive} />}
    ];

    // return (<div>testing...</div>)
    return (
      <div>
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title={place.name}
          meta={config.meta.concat([ {property: 'og:title', content: place.name} ])}
          link={config.link}
        />
        <Header place={place} />
        <ProfileNav sections={sections} />
        <Intro place={place} />
        {sections.map((section, key) =>
          <Section
            index={key}
            key={key}
            numSections={sections.length}
            title={section.title}
            slug={section.slug}>
            {section.content ? section.content : null}
            {section.viz ? section.viz : null}
          </Section>
        )}
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    placeProfile: state.placeProfile
  };
}

export default connect(mapStateToProps)(Place);