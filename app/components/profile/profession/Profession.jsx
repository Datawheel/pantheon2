import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/profession/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/profession/Intro";
import People from "components/profile/profession/People";
import Places from "components/profile/profession/Places";
import RelatedProfessions from "components/profile/profession/RelatedProfessions";
import Section from "components/profile/Section";
import { fetchProfession, fetchPeople, fetchPeopleInDomain, fetchAllProfessions } from "actions/profession";
import Viz from "components/viz/Index";
import { COLORS_CONTINENT, YEAR_BUCKETS } from "types";

class Profession extends Component {

  constructor(props) {
    super(props);
  }

  static need = [
    fetchProfession,
    fetchPeople,
    fetchPeopleInDomain,
    fetchAllProfessions
  ]

  render() {
    const {professionProfile} = this.props;
    const {profession, professions, people, peopleInDomain} = professionProfile;

    const tmapDomainData = peopleInDomain
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapDomainData.forEach(d => {
      d.profession_name = d.profession.name;
      d.bucketyear = Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const tmapBornData = people
      .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    tmapBornData.forEach(d => {
      d.borncountry = d.birthcountry.country_name;
      d.borncontinent = d.birthcountry.continent;
      d.bucketyear = Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const tmapDeathData = people
      .filter(p => p.deathyear !== null && p.deathcountry && p.deathcountry.country_name && p.deathcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    tmapDeathData.forEach(d => {
      d.diedcountry = d.deathcountry.country_name;
      d.diedcontinent = d.deathcountry.continent;
      d.bucketyear = Math.round(d.deathyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const priestleyMax = 25;

    const priestleyData = tmapBornData
      .filter(p => p.deathyear !== null && p.deathcountry !== null)
      .slice(0, priestleyMax);

    const sections = [
      {title: "People", slug: "people", content: <People profession={profession} people={people} />},
      {
        title: "Related Professions",
        slug: "related",
        content: <RelatedProfessions profession={profession} professions={professions} />,
        viz: [
          <Viz type="Treemap"
            title={`Occupations Within ${profession.domain} Domain`}
            key="tmap_domain"
            config={{
              attrs: professions,
              data: tmapDomainData,
              depth: 1,
              groupBy: ["group", "profession_name"],
              legend: false,
              time: "birthyear"
            }} />,
          <Viz type="StackedArea"
            title={`${profession.domain} Domain Over Time`}
            key="stacked_domain"
            config={{
              attrs: professions,
              data: tmapDomainData,
              groupBy: "profession_name",
              legend: false,
              shapeConfig: {stroke: () => "#F4F4F1", strokeWidth: (d, i) => 1},
              time: "bucketyear",
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Places",
        slug: "places",
        content: <Places people={people} profession={profession} />,
        viz: [
          <Viz type="Treemap"
            title={`Places of Birth for ${profession.name}`}
            key="tmap_country1"
            config={{
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "birthyear"
            }} />,
          <Viz type="Treemap"
            title={`Places of Death for ${profession.name}`}
            key="tmap_country2"
            config={{
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              time: "deathyear"
            }} />
        ]
      },
      {
        title: "Places Over Time",
        slug: "places_trends",
        viz: [
          <Viz type="StackedArea"
            title="Births Over Time"
            key="stacked_country1"
            config={{
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "bucketyear",
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />,
          <Viz type="StackedArea"
            title="Deaths Over Time"
            key="stacked_country2"
            config={{
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              time: "bucketyear",
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Overlapping Lives",
        slug: "overlapping_lives",
        viz: [
          <Viz type="Priestley"
            title={`Lifespans of the Top ${priestleyMax} ${profession.name}`}
            key="priestley1"
            config={{
              data: priestleyData,
              depth: 1,
              end: "deathyear",
              groupBy: ["diedcontinent", "name"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              start: "birthyear"
            }} />
        ]
      }
    ];

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
