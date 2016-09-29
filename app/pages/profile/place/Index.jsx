import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from 'css/components/about';
import Header from 'pages/profile/place/Header';
import ProfileNav from 'components/profile/Nav';
import Intro from 'pages/profile/place/Intro';
import Section from 'components/profile/Section';

import PeopleRanking from 'pages/profile/place/PeopleRanking';
import Occupations from 'pages/profile/place/Occupations';
import LivingPeople from 'pages/profile/place/LivingPeople';

import { fetchPlace, fetchPeopleBornHere, fetchOccupations, fetchPeopleBornHereAlive } from 'actions/place';

const cx = classNames.bind(styles);

class Place extends Component {

  constructor(props) {
    super(props);
    const {placeProfile} = this.props;

    this.sections = [
      {title: "People", slug: "people", content: <PeopleRanking ranking={placeProfile.peopleBornHere} />},
      {title: "Professions", slug: "professions", content: <Occupations data={placeProfile.occupations} />},
      {title: "Profession Trends", slug: "profession_trends"},
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {title: "Overlapping Lives", slug: "overlapping_lives"},
      {title: "Living People", slug: "living_people", content: <LivingPeople data={placeProfile.peopleBornHereAlive} />}
    ];
  }

  static need = [
    fetchPlace,
    fetchPeopleBornHere,
    fetchOccupations,
    fetchPeopleBornHereAlive
  ]

  render() {
    const {placeProfile} = this.props;

    // return (<div>testing...</div>)
    const sections = this.sections.map((section, key) => {
      return (
        <Section
          index={key}
          key={key}
          numSections={this.sections.length}
          title={section.title}
          slug={section.slug}>
          {section.content ? section.content : null}
        </Section>);
    });

    return (
      <div>
        <Header place={placeProfile.place} />
        <ProfileNav sections={this.sections} />
        <Intro place={placeProfile.place} />
        {sections}
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
