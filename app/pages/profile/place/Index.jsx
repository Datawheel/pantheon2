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

import Viz from 'components/viz/Index'

import { fetchPlace, fetchPeopleBornHere, fetchOccupationsHere, fetchOccupations, fetchPeopleBornHereAlive } from 'actions/place';

const cx = classNames.bind(styles);

class Place extends Component {

  constructor(props) {
    super(props);
    const {peopleBornHere, occupationsHere, occupations, peopleBornHereAlive} = this.props.placeProfile;

    this.sections = [
      {title: "People", slug: "people", content: <PeopleRanking ranking={peopleBornHere.slice(0, 12)} />},
      {
        title: "Professions",
        slug: "professions",
        content: <Occupations data={occupationsHere} />,
      viz: <Viz type="Treemap"
                data={peopleBornHere}
                attrs={occupations}
                groupBy={["domain", "group", "name"]}
                time={(d) => d.birthyear} />
      },
      {title: "Profession Trends", slug: "profession_trends"},
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {title: "Overlapping Lives", slug: "overlapping_lives"},
      {title: "Living People", slug: "living_people", content: <LivingPeople data={peopleBornHereAlive} />}
    ];
  }

  static need = [
    fetchPlace,
    fetchPeopleBornHere,
    fetchOccupations,
    fetchOccupationsHere,
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
          {section.viz ? section.viz : null}
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
