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
import {fetchEras} from "actions/era";
import {COLORS_CONTINENT} from "types";
import {Priestley, StackedArea, Treemap, Tree} from "d3plus-react";
import {calculateYearBucket, groupBy, groupTooltip, on, peopleTooltip, shapeConfig} from "viz/helpers";
import "css/components/profile/structure";

class Occupation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.occupationProfile.occupation.id === undefined) {
      return <NotFound />;
    }
    const {occupation, occupations, people, peopleInDomain} = this.props.occupationProfile;
    const eras = this.props.eras;

    const tmapDomainData = peopleInDomain
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);

    tmapDomainData.forEach(d => {
      d.industry = d.occupation.industry;
      d.domain = d.occupation.domain;
      d.occupation_id = `${d.occupation_id}`;
      d.occupation_name = d.occupation.occupation;
    });

    const tmapBornData = people
      .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    const [bornBuckets, bornTicks] = calculateYearBucket(tmapBornData, d => d.birthyear);
    console.log(bornBuckets);
    console.log(bornTicks);

    tmapBornData.forEach(d => {
      d.borncountry = d.birthcountry.country_name;
      d.borncontinent = d.birthcountry.continent;
    });

    const tmapDeathData = people
      .filter(p => p.deathyear !== null && p.deathcountry && p.deathcountry.country_name && p.deathcountry.continent)
      .sort((a, b) => b.langs - a.langs);

    const [deathBuckets, deathTicks] = calculateYearBucket(tmapDeathData, d => d.deathyear);
    console.log(deathBuckets);
    console.log(deathTicks);

    tmapDeathData.forEach(d => {
      d.diedcountry = d.deathcountry.country_name;
      d.diedcontinent = d.deathcountry.continent;
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
              on: on("place", d => d.birthcountry.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.birthcountry.slug),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />,
          <Treemap
            key="tmap_country2"
            config={{
              title: `Death Places for ${occupation.occupation}`,
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              on: on("place", d => d.deathcountry.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              time: "deathyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.deathcountry.slug),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />
        ]
      },
      {
        title: "Places Over Time",
        slug: "places_trends",
        content: <PlacesTime eras={eras} people={people} occupation={occupation} />,
        viz: [
          <StackedArea
            key="stacked_country1"
            config={{
              title: `Birth Places of ${occupation.occupation}s Over Time`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              on: on("place", d => d.birthcountry.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              tooltipConfig: groupTooltip(tmapBornData, d => d.birthcountry.slug),
              xConfig: {
                labels: bornTicks,
                tickFormat: d => bornBuckets[d]
              }
            }} />,
          <StackedArea
            key="stacked_country2"
            config={{
              title: `Death Places of ${occupation.occupation}s Over Time`,
              data: tmapDeathData,
              depth: 1,
              groupBy: ["diedcontinent", "diedcountry"],
              on: on("place", d => d.deathcountry.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
              tooltipConfig: groupTooltip(tmapDeathData, d => d.deathcountry.slug),
              xConfig: {
                labels: deathTicks,
                tickFormat: d => deathBuckets[d]
              }
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
              detectVisible: false,
              end: "deathyear",
              groupBy: ["diedcontinent", "name"],
              height: 700,
              on: on("person", d => d.slug),
              shapeConfig: {
                fill: d => COLORS_CONTINENT[d.diedcontinent],
                labelPadding: 2
              },
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
          <Tree
            key="tree_domain"
            config={{
              title: `Related Occupations Within the ${occupation.domain} Domain`,
              data: tmapDomainData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              legend: false,
              on: on("occupation", d => d.occupation.occupation_slug),
              orient: "horizontal",
              shapeConfig: Object.assign({}, shapeConfig(attrs),
                {
                  labelConfig: {
                    fontColor: "#4B4A48",
                    fontFamily: () => "Amiko",
                    fontResize: false,
                    fontSize: () => 13
                  }
                }),
              tooltipConfig: groupTooltip(tmapDomainData, d => d.occupation.occupation_slug),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
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
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro occupation={occupation} occupations={occupations} />
        </div>
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
  fetchAllOccupations,
  fetchEras
];

function mapStateToProps(state) {
  return {
    occupationProfile: state.occupationProfile,
    eras: state.eraProfile.eras
  };
}

export default connect(mapStateToProps)(Occupation);
