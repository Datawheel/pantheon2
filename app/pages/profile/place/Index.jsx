import React, { Component, PropTypes } from 'react';
import {connect} from "react-redux";
import classNames from 'classnames/bind';
import styles from 'css/components/about';
import Header from 'pages/profile/place/Header';
import ProfileNav from 'components/profile/Nav';
import Intro from 'pages/profile/place/Intro';
import Section from 'components/profile/Section';
import Ranking from 'components/profile/Ranking';

import { fetchPlace } from 'actions/place';

const cx = classNames.bind(styles);

class Place extends Component {

  constructor(props) {
    super(props);

    this.sections = [
      {title: "People", slug: "people"},
      {title: "Professions", slug: "professions"},
      {title: "Profession Trends", slug: "profession_trends"},
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {title: "Overlapping Lives", slug: "overlapping_lives"},
      {title: "Living People", slug: "living_people"}
    ];
  }

  static need = [
    fetchPlace,
  ]

  render() {
    const {placeProfile} = this.props;
    console.log(" ---- place ------")
    console.log(placeProfile)

    // return (<div>testing...</div>)
    const sections = this.sections.map((section, key) => {
      return (
        <Section
          index={key}
          key={key}
          numSections={this.sections.length}
          title={section.title}
          slug={section.slug}>
        {section.rankings ? <Ranking person={personProfile.person} rankings={section.rankings} type={section.type} /> : null}
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
