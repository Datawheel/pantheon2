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
import { fetchPlace, fetchPeopleBornHere, fetchPeopleDiedHere, fetchProfessionsBornHere, fetchProfessionsDiedHere, fetchProfessions, fetchPeopleBornHereAlive } from "actions/place";

class Place extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchPlace,
    fetchPeopleBornHere,
    fetchPeopleDiedHere,
    fetchProfessions,
    fetchProfessionsBornHere,
    fetchProfessionsDiedHere,
    fetchPeopleBornHereAlive
  ]

  render() {

    const {placeProfile} = this.props;
    const {place, peopleBornHere, peopleDiedHere, professionsBornHere, professionsDiedHere, professions, peopleBornHereAlive} = placeProfile;

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

    const sections = [
      {title: "People", slug: "people", content: <PeopleRanking place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />},
      {
        title: "Professions",
        slug: "professions",
        content: <Professions place={place} professionsBorn={professionsBornHere} professionsDied={professionsDiedHere} />,
        viz: [
            <Viz type="Treemap"
                  config={{
                    attrs: professions,
                    data: tmapBornData,
                    groupBy: ["domain", "group", "name"],
                    time: d => d.birthyear,
                    tooltipConfig: {
                      body: d => {
                        if (!(d.name instanceof Array)) return `<span class="bold">Born</span> ${d.birthyear}<br /><span class="bold">Died</span> ${d.deathyear}`;
                        let txt = "<span class='sub'>Notable People</span>";
                        const names = d.name.slice(0, 3);
                        tmapBornData.filter(d => names.includes(d.name)).slice(0, 3).forEach(n => {
                          txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
                        });
                        return txt;
                      }
                    }
                  }} />,
            <Viz type="Treemap"
                  config={{
                    attrs: professions,
                    data: tmapDeathData,
                    groupBy: ["domain", "group", "name"],
                    time: d => d.deathyear,
                    tooltipConfig: {
                      body: d => {
                        if (!(d.name instanceof Array)) return `<span class="bold">Born</span> ${d.birthyear}<br /><span class="bold">Died</span> ${d.deathyear}`;
                        let txt = "<span class='sub'>Notable People</span>";
                        const names = d.name.slice(0, 3);
                        tmapDeathData.filter(d => names.includes(d.name)).slice(0, 3).forEach(n => {
                          txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
                        });
                        return txt;
                      }
                    }
                  }} />
        ]
      },
      {
        title: "Profession Trends",
        slug: "profession_trends",
        viz: [
          <Viz type="StackedArea"
                config={{
                  attrs: professions,
                  data: tmapBornData,
                  groupBy: ["domain", "group", "name"],
                  time: d => d.bucketyear,
                  tooltipConfig: {
                    body: d => {
                      if (!(d.name instanceof Array)) return `<span class="bold">Born</span> ${d.birthyear}<br /><span class="bold">Died</span> ${d.deathyear}`;
                      let txt = "<span class='sub'>Notable People</span>";
                      const names = d.name.slice(0, 3);
                      tmapBornData.filter(d => names.includes(d.name)).slice(0, 3).forEach(n => {
                        txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
                      });
                      return txt;
                    }
                  },
                  x: "bucketyear",
                  y: d => d.id instanceof Array ? d.id.length : 1,
                }} />,
            <Viz type="StackedArea"
                  config={{
                    attrs: professions,
                    data: tmapDeathData,
                    groupBy: ["domain", "group", "name"],
                    time: d => d.bucketyear,
                    tooltipConfig: {
                      body: d => {
                        if (!(d.name instanceof Array)) return `<span class="bold">Born</span> ${d.birthyear}<br /><span class="bold">Died</span> ${d.deathyear}`;
                        let txt = "<span class='sub'>Notable People</span>";
                        const names = d.name.slice(0, 3);
                        tmapDeathData.filter(d => names.includes(d.name)).slice(0, 3).forEach(n => {
                          txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
                        });
                        return txt;
                      }
                    },
                    x: "bucketyear",
                    y: d => d.id instanceof Array ? d.id.length : 1,
                  }} />
        ]
      },
      {title: "Cities", slug: "cities"},
      {title: "Historical Places", slug: "historical_places"},
      {
        title: `Top ${priestleyMax} Overlapping Lives`,
        slug: "overlapping_lives",
        viz: [<Viz type="Priestley"
                  config={{
                    attrs: professions,
                    data: priestleyData,
                    depth: 1,
                    end: d => d.deathyear,
                    groupBy: ["domain", "name"],
                    start: d => d.birthyear,
                    tooltipConfig: {
                      body: d => `<span class="bold">Born</span> ${d.birthyear}<br /><span class="bold">Died</span> ${d.deathyear}`
                    }
                  }} />]
      },
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
