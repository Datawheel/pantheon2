import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/occupation/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/occupation/Intro";
import Footer from "components/profile/occupation/Footer";
import People from "components/profile/occupation/People";
import Places from "components/profile/occupation/Places";
import PlacesTime from "components/profile/occupation/PlacesTime";
import OverlappingLives from "components/profile/occupation/OverlappingLives";
import RelatedOccupations from "components/profile/occupation/RelatedOccupations";
import Section from "components/profile/Section";
import NotFound from "components/NotFound";
import {fetchOccupation, fetchPeople, fetchPeopleInDomain, fetchAllOccupations} from "actions/occupation";
import {COLORS_CONTINENT, YEAR_BUCKETS} from "types";
import {Priestley, StackedArea, Treemap} from "d3plus-react";
import {groupBy, groupTooltip, peopleTooltip, shapeConfig} from "viz/helpers";

import {extent} from "d3-array";

class Occupation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.occupationProfile.occupation.id === undefined) {
      return <NotFound />;
    }
    const {occupationProfile} = this.props;
    const {occupation, occupations, people, peopleInDomain} = occupationProfile;

    // return <div>Loading...</div>

    const tmapDomainData = peopleInDomain
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapDomainData.forEach(d => {
      d.industry = d.occupation.industry;
      d.domain = d.occupation.domain;
      d.occupation_id = `${d.occupation_id}`;
      d.occupation_name = d.occupation.occupation;
      d.bucketyear = Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const tmapBornData = people
      .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    let birthyearSpan = extent(tmapBornData, d => d.birthyear);
    birthyearSpan = birthyearSpan[1] - birthyearSpan[0];

    tmapBornData.forEach(d => {
      d.borncountry = d.birthcountry.country_name;
      d.borncontinent = d.birthcountry.continent;
      d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                   ? d.birthyear
                   : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const tmapDeathData = people
      .filter(p => p.deathyear !== null && p.deathcountry && p.deathcountry.country_name && p.deathcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    let deathyearSpan = extent(tmapDeathData, d => d.deathyear);
    deathyearSpan = deathyearSpan[1] - deathyearSpan[0];

    tmapDeathData.forEach(d => {
      d.diedcountry = d.deathcountry.country_name;
      d.diedcontinent = d.deathcountry.continent;
      d.bucketyear = deathyearSpan < YEAR_BUCKETS * 2
                   ? d.deathyear
                   : Math.round(d.deathyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const priestleyMax = 25;

    const priestleyData = tmapBornData
      .filter(p => p.deathyear !== null && p.deathcountry !== null)
      .slice(0, priestleyMax);

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    const sections = [
      {title: "People", slug: "people", content: <People occupation={occupation} people={people} />},
      {
        title: "Places",
        slug: "places",
        content: <Places people={people} occupation={occupation} />,
        viz: [
          <Treemap
            key="tmap_country1"
            config={{
              title: `Birth Places for ${occupation.occupation}`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />,
          <Treemap
            key="tmap_country2"
            config={{
              title: `Death Places for ${occupation.occupation}`,
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              time: "deathyear",
              tooltipConfig: groupTooltip(tmapDeathData),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />
        ]
      },
      {
        title: "Places Over Time",
        slug: "places_trends",
        content: <PlacesTime people={people} occupation={occupation} />,
        viz: [
          <StackedArea
            key="stacked_country1"
            config={{
              title: `Birth Places of ${occupation.occupation}s Over Time`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "bucketyear",
              tooltipConfig: groupTooltip(tmapBornData),
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />,
          <StackedArea
            key="stacked_country2"
            config={{
              title: `Death Places of ${occupation.occupation}s Over Time`,
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              time: "bucketyear",
              tooltipConfig: groupTooltip(tmapDeathData),
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Overlapping Lives",
        slug: "overlapping_lives",
        content: <OverlappingLives people={people} occupation={occupation} />,
        viz: [
          <Priestley
            key="priestley1"
            config={{
              title: `Lifespans of the Top ${priestleyMax} ${occupation.occupation}s`,
              data: priestleyData,
              depth: 1,
              end: "deathyear",
              groupBy: ["diedcontinent", "name"],
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              start: "birthyear",
              tooltipConfig: peopleTooltip
            }} />
        ]
      },
      {
        title: "Related Occupations",
        slug: "related",
        content: <RelatedOccupations occupation={occupation} occupations={occupations} />,
        viz: [
          <Treemap
            key="tmap_domain"
            config={{
              title: `Occupations Within the ${occupation.domain} Domain`,
              attrs: occupations,
              data: tmapDomainData,
              depth: 1,
              groupBy: ["industry", "occupation_name"].map(groupBy(attrs)),
              legend: false,
              shapeConfig: shapeConfig(attrs),
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapDomainData),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />,
          <StackedArea
            key="stacked_domain"
            config={{
              title: `${occupation.domain} Domain Over Time`,
              attrs: occupations,
              data: tmapDomainData,
              depth: 1,
              groupBy: ["industry", "occupation_name"].map(groupBy(attrs)),
              legend: false,
              shapeConfig: Object.assign({}, shapeConfig(attrs), {
                stroke: () => "#F4F4F1",
                strokeWidth: () => 1
              }),
              time: "bucketyear",
              tooltipConfig: groupTooltip(tmapDomainData),
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      }
    ];

    return (
      <div>
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={`${occupation.occupation} - Pantheon`}
          meta={config.meta.concat([{property: "og:title", content: occupation.occupation}])}
          link={config.link}
        />
        <Header occupation={occupation} people={people} />
        <ProfileNav sections={sections} />
        <Intro occupation={occupation} occupations={occupations} />
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

Occupation.need = [
  fetchOccupation,
  fetchPeople,
  fetchPeopleInDomain,
  fetchAllOccupations
];

function mapStateToProps(state) {
  return {
    occupationProfile: state.occupationProfile
  };
}

export default connect(mapStateToProps)(Occupation);
