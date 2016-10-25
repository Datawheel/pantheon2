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
import ProfessionTrends from "components/profile/place/ProfessionTrends";
import LivingPeople from "components/profile/place/LivingPeople";
import Viz from "components/viz/Index";
import { fetchPlace, fetchCountry, fetchPlaceRanks, fetchPeopleBornHere, fetchPeopleDiedHere, fetchProfessionsBornHere, fetchProfessionsDiedHere, fetchProfessions, fetchPeopleBornHereAlive } from "actions/place";

class Place extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchPlace,
    fetchPlaceRanks,
    fetchCountry,
    fetchPeopleBornHere,
    fetchPeopleDiedHere,
    fetchProfessions,
    fetchProfessionsBornHere,
    fetchProfessionsDiedHere,
    fetchPeopleBornHereAlive
  ]

  render() {
    // return <div>testing...</div>

    const {placeProfile} = this.props;
    const {place, country, placeRanks, peopleBornHere, peopleDiedHere, professionsBornHere, professionsDiedHere, professions, peopleBornHereAlive} = placeProfile;

    const yearBuckets = 50;

    const tmapBornData = peopleBornHere
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapBornData.forEach(d => {
      d.bucketyear = Math.round(d.birthyear / yearBuckets) * yearBuckets;
    });

    const tmapDeathData = peopleDiedHere
      .filter(p => p.deathyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapDeathData.forEach(d => {
      d.bucketyear = Math.round(d.deathyear / yearBuckets) * yearBuckets;
    });

    const priestleyMax = 25;

    const priestleyData = tmapBornData
      .filter(p => p.deathyear !== null)
      .slice(0, priestleyMax);

    let sections = [
      {title: "People", slug: "people", content: <PeopleRanking place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />},
      {
        title: "Professions",
        slug: "professions",
        content: <Professions place={place} professionsBorn={professionsBornHere} professionsDied={professionsDiedHere} />,
        viz: [
            <Viz type="Treemap"
                  title={`Professions of People Born in ${place.name}`}
                  key="tmap1"
                  config={{
                    attrs: professions,
                    data: tmapBornData,
                    groupBy: ["domain", "group", "name"],
                    time: "birthyear"
                  }} />,
            <Viz type="Treemap"
                  title={`Professions of People Deceased in ${place.name}`}
                  key="tmap2"
                  config={{
                    attrs: professions,
                    data: tmapDeathData,
                    groupBy: ["domain", "group", "name"],
                    time: "deathyear"
                  }} />
        ]
      },
      {
        title: "Profession Trends",
        slug: "profession_trends",
        content: <ProfessionTrends place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} professions={professions} />,
        viz: [
          <Viz type="StackedArea"
                title="Births Over Time"
                key="stacked1"
                config={{
                  attrs: professions,
                  data: tmapBornData,
                  groupBy: ["domain", "group", "name"],
                  time: "bucketyear",
                  x: "bucketyear",
                  y: d => d.id instanceof Array ? d.id.length : 1,
                }} />,
            <Viz type="StackedArea"
                  title="Deaths Over Time"
                  key="stacked2"
                  config={{
                    attrs: professions,
                    data: tmapDeathData,
                    groupBy: ["domain", "group", "name"],
                    time: "bucketyear",
                    x: "bucketyear",
                    y: d => d.id instanceof Array ? d.id.length : 1,
                  }} />
        ]
      },
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {
        title: `Overlapping Lives`,
        slug: "overlapping_lives",
        viz: [<Viz type="Priestley"
                  title={`Lifespans of Top ${priestleyMax} Individuals Born in ${place.name}`}
                  key="priestley1"
                  config={{
                    attrs: professions,
                    data: priestleyData,
                    depth: 1,
                    end: "deathyear",
                    groupBy: ["domain", "name"],
                    start: "birthyear"
                  }} />]
      },
      {title: "Living People", slug: "living_people", content: <LivingPeople place={place} data={peopleBornHereAlive} />}
    ];

    // catch for really small places...
    if(peopleBornHere.concat(peopleDiedHere).length < 5){
      sections = [sections[0]];
    }

    return (
      <div>
        <Helmet
          htmlAttributes={{"lang": "en", "amp": undefined}}
          title={place.name}
          meta={config.meta.concat([ {property: 'og:title', content: place.name} ])}
          link={config.link}
        />
        <Header place={place} country={country} />
        <ProfileNav sections={sections} />
        <Intro place={place} placeRanks={placeRanks} />
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
    placeProfile: state.placeProfile
  };
}

export default connect(mapStateToProps)(Place);
