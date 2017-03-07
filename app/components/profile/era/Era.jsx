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
import Occupations from "components/profile/era/Occupations";
import {fetchEra, fetchEras, fetchPeopleBornInEra, fetchPeopleDiedInEra} from "actions/era";
import {fetchAllOccupations} from "actions/occupation";
import {Treemap} from "d3plus-react";
import {FORMATTERS, YEAR_BUCKETS} from "types";
import {bucketScale, groupBy, groupTooltip, on, peopleTooltip, shapeConfig} from "viz/helpers";
import {extent} from "d3-array";

class Era extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {eraProfile, occupationProfile} = this.props;
    const {era, eras, peopleBornInEra, peopleDiedInEra} = eraProfile;
    const {occupations} = occupationProfile;

    const yearSpan = era.end_year - era.start_year;
    const tmapBornData = peopleBornInEra
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);
    tmapBornData.forEach(d => {
      d.occupation_name = d.occupation.occupation;
      d.occupation_id = `${d.occupation_id}`;
      d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
      d.place = d.birthplace;
      d.logyear = yearSpan < YEAR_BUCKETS * 2
                ? d.birthyear
                : bucketScale(d.birthyear);
      d.bucketyear = yearSpan < YEAR_BUCKETS * 2
                   ? d.birthyear
                   : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const tmapDeathData = peopleDiedInEra
      .filter(p => p.deathyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapDeathData.forEach(d => {
      d.industry = d.occupation.industry;
      d.domain = d.occupation.domain;
      d.occupation_name = d.occupation.occupation;
      d.occupation_id = `${d.occupation_id}`;
      d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
      d.place = d.deathplace;
      d.logyear = yearSpan < YEAR_BUCKETS * 2
                ? d.deathyear
                : bucketScale(d.deathyear);
      d.bucketyear = yearSpan < YEAR_BUCKETS * 2
                   ? d.deathyear
                   : Math.round(d.deathyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    const sections = [
      {title: "Most Remembered", slug: "people", content: <PeopleRanking era={era} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />},
      {
        title: "Occupations",
        slug: "occupations",
        content: <Occupations era={era} peopleBorn={peopleBornInEra} peopleDied={peopleDiedInEra} />,
        viz: [
          <Treemap
            key="tmap1"
            config={{
              title: `Occupations of People Born during the ${era.name}`,
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.occupation.occupation_slug)
            }} />,
          <Treemap
            key="tmap2"
            config={{
              title: `Occupations of People Deceased during the ${era.name}`,
              data: tmapDeathData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              time: "deathyear",
              tooltipConfig: groupTooltip(tmapDeathData, d => d.occupation.occupation_slug)
            }} />
        ]
      },
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
  fetchPeopleDiedInEra,
  fetchAllOccupations
];

function mapStateToProps(state) {
  return {
    eraProfile: state.eraProfile,
    occupationProfile: state.occupationProfile
  };
}

export default connect(mapStateToProps)(Era);
