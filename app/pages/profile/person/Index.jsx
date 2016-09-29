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
    const {personProfile} = this.props;
    const occupation = personProfile.person.occupation;
    const birthcountry = personProfile.person.birthcountry;

    this.sections = [
      {title: "Memorability Metrics", slug: "metrics"},
      {title: `Among ${occupation.name}`, slug: "occupation_peers", content: <OccupationRanking person={personProfile.person} ranking={personProfile.occupationRank} />},
      {title: "Contemporaries", slug: "year_peers", content: <BirthyearRanking person={personProfile.person} ranking={personProfile.birthyearRank} />},
      {title: `Among People in ${birthcountry.name}`, slug: "country_peers", content: <BirthcountryRanking person={personProfile.person} ranking={personProfile.birthcountryRank} />},
      {title: "Digital Afterlife", slug: "afterlife"}
    ];
  }

  static need = [
    fetchPerson,
    fetchOccupationRanks,
    fetchBirthcountryRanks,
    fetchBirthyearRanks
  ]

  render() {
    const {personProfile} = this.props;

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
        <Header person={personProfile.person} />
        <ProfileNav sections={this.sections} />
        <Intro person={personProfile.person} />
        {sections}
      </div>
    )
    return (
      <div>
        <h1>Who remembers {person.person.name}?</h1>
        <img src={`/people/${person.person.wiki_id}.jpg`} />
        <p>
          <span>{person.person.birthyear}</span>
          <span>{person.person.deathyear}</span>
          <span>{person.person.langs}</span>
        </p>

        <div className={cx('rankPeers')}>
          <h2>Among {occupation.name}</h2>
          <p>Among {occupation.name}, {person.person.name} ranks 6th out of 437. Before him are: Frank Sinatra (4) and Luciano Pavarotti (5). After him are Tina Turner (7) and Janis Joplin (8).</p>
          {occRanks.map((r) =>
            <li key={r.person.id}>
              <h2>{r.person.name}</h2>
              <p>{r.person.birthyear} - {r.person.deathyear}</p>
              <p>Rank: {r.rank}</p>
            </li>
          )}
        </div>

        <div className={cx('rankPeers')}>
          <h2>Among {birthyear} Babies</h2>
          <p>Among {birthyear} Babies, {person.person.name} ranks 6th out of 437. Before him are: Frank Sinatra (4) and Luciano Pavarotti (5). After him are Tina Turner (7) and Janis Joplin (8).</p>
          {byRanks.map((r) =>
            <li key={r.person.id}>
              <h2>{r.person.name}</h2>
              <p>{r.person.birthyear} - {r.person.deathyear}</p>
              <p>Rank: {r.rank}</p>
            </li>
          )}
        </div>

        <div className={cx('rankPeers')}>
          <h2>Among {birthcountry.name}</h2>
          <p>Among {birthcountry.name}, {person.person.name} ranks 6th out of 437. Before him are: Frank Sinatra (4) and Luciano Pavarotti (5). After him are Tina Turner (7) and Janis Joplin (8).</p>
          {cyRanks.map((r) =>
            <li key={r.person.id}>
              <h2>{r.person.name}</h2>
              <p>{r.person.birthyear} - {r.person.deathyear}</p>
              <p>Rank: {r.rank}</p>
            </li>
          )}
        </div>

      </div>
    );
    // {rank.ranks.map((r) =>
    //   <li key={r.person.id}>
    //     <h2>{r.person.name}</h2>
    //     <p>{r.person.birthyear} - {r.person.deathyear}</p>
    //     <p>Rank: {r.rank}</p>
    //   </li>
    // )}
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
