import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from 'css/components/about';
import Header from 'components/profile/Header';
import ProfileNav from 'components/profile/Nav';
import Intro from 'components/profile/Intro';
import Section from 'components/profile/Section';
// import Ranking from 'components/profile/Ranking';
import OccupationRanking from 'pages/profile/person/OccupationRanking';
import BirthyearRanking from 'pages/profile/person/BirthyearRanking';
import BirthcountryRanking from 'pages/profile/person/BirthcountryRanking';

import { fetchPerson, fetchOccupationRanks, fetchBirthcountryRanks, fetchBirthyearRanks } from 'actions/person';

const cx = classNames.bind(styles);

class Person extends Component {

  /*
   * This replaces getInitialState. Likewise getDefaultProps and propTypes are just
   * properties on the constructor
   * Read more here: https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes
   */
  constructor(props) {
    super(props);
  }

  static need = [
    fetchPerson,
    fetchOccupationRanks,
    fetchBirthcountryRanks,
    fetchBirthyearRanks
  ]

  render() {
    const {personProfile} = this.props;
    const occupation = personProfile.person.occupation;
    const birthcountry = personProfile.person.birthcountry;

    const sections = [
      {title: "Memorability Metrics", slug: "metrics"},
      {title: `Among ${occupation.name}`, slug: "occupation_peers", content: <OccupationRanking person={personProfile.person} ranking={personProfile.occupationRank} />},
      {title: "Contemporaries", slug: "year_peers", content: <BirthyearRanking person={personProfile.person} ranking={personProfile.birthyearRank} />},
      {title: `Among People in ${birthcountry.name}`, slug: "country_peers", content: <BirthcountryRanking person={personProfile.person} ranking={personProfile.birthcountryRank} />},
      {title: "Digital Afterlife", slug: "afterlife"}
    ];

    // return (<div>testing...</div>)
    return (
      <div>
        <Header person={personProfile.person} />
        <ProfileNav sections={sections} />
        <Intro person={personProfile.person} />
        {sections.map((section, key) =>
          <Section
            index={key}
            key={key}
            numSections={sections.length}
            title={section.title}
            slug={section.slug}>
            {section.content ? section.content : null}
          </Section>
        )}
      </div>
    )
  }
};

// Person.propTypes = {
//   topics: PropTypes.array.isRequired
// };

function mapStateToProps(state) {
  return {
    personProfile: state.personProfile
  };
}

export default connect(mapStateToProps)(Person);
