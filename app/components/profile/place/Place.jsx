import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/place/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/place/Intro";
import Section from "components/profile/Section";
import Footer from "components/profile/place/Footer";
import PeopleRanking from "components/profile/place/PeopleRanking";
import Occupations from "components/profile/place/Occupations";
import OccupationTrends from "components/profile/place/OccupationTrends";
import LivingPeople from "components/profile/place/LivingPeople";
import NotFound from "components/NotFound";
import {fetchPlace, fetchCountry, fetchPlaceRanks, fetchPeopleBornHere, fetchPeopleDiedHere, fetchPeopleBornHereAlive} from "actions/place";
import {fetchAllOccupations} from "actions/occupation";
import {YEAR_BUCKETS} from "types";
import {Geomap, Priestley, Treemap, StackedArea} from "d3plus-react";
import {groupBy, groupTooltip, peopleTooltip, shapeConfig} from "viz/helpers";

import {extent} from "d3-array";

class Place extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.placeProfile.place.id === undefined) {
      return <NotFound />;
    }
    const {placeProfile, occupationProfile} = this.props;
    const {place, country, placeRanks, peopleBornHere, peopleDiedHere, occupationsBornHere, occupationsDiedHere, peopleBornHereAlive} = placeProfile;
    const {occupations} = occupationProfile;

    // return <div>testing...</div>

    const tmapBornData = peopleBornHere
      .filter(p => p.birthyear !== null)
      .sort((a, b) => b.langs - a.langs);

    let birthyearSpan = extent(tmapBornData, d => d.birthyear);
    birthyearSpan = birthyearSpan[1] - birthyearSpan[0];

    tmapBornData.forEach(d => {
      d.occupation_name = d.occupation.occupation;
      d.occupation_id = `${d.occupation_id}`;
      d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
      d.place = d.birthplace;
      d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                   ? d.birthyear
                   : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    // console.log("tmapBornData", tmapBornData)

    const tmapDeathData = peopleDiedHere
      .filter(p => p.deathyear !== null)
      .sort((a, b) => b.langs - a.langs);

    let deathyearSpan = extent(tmapBornData, d => d.birthyear);
    deathyearSpan = deathyearSpan[1] - deathyearSpan[0];

    tmapDeathData.forEach(d => {
      d.industry = d.occupation.industry;
      d.domain = d.occupation.domain;
      d.occupation_name = d.occupation.occupation;
      d.occupation_id = `${d.occupation_id}`;
      d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
      d.place = d.deathplace;
      d.bucketyear = deathyearSpan < YEAR_BUCKETS * 2
                   ? d.deathyear
                   : Math.round(d.deathyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const geomapData = tmapBornData.filter(d => d.place && d.place.lat_lon)
              .concat(tmapDeathData.filter(d => d.place && d.place.lat_lon))
              .sort((a, b) => b.langs - a.langs)
              .slice(0, 100);
    geomapData.forEach(d => {
      d.place_name = d.place.name;
      d.place_coord = d.place.lat_lon;
      if (!(d.place_coord instanceof Array)) {
        d.place_coord = d.place_coord
          .replace("(", "")
          .replace(")", "")
          .split(",").map(Number);
      }
      d.place_coord.reverse();
    });

    const priestleyMax = 25;

    const priestleyData = tmapBornData
      .filter(p => p.deathyear !== null)
      .slice(0, priestleyMax);

    const attrs = occupations.reduce((obj, d) => {
      obj[d.id] = d;
      return obj;
    }, {});

    let sections = [
      {title: "People", slug: "people", content: <PeopleRanking place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />},
      {
        title: "Occupations",
        slug: "occupations",
        content: <Occupations place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} />,
        viz: [
          <Treemap
            key="tmap1"
            config={{
              title: `Occupations of People Born in ${place.name}`,
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              shapeConfig: shapeConfig(attrs),
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData)
            }} />,
          <Treemap
            key="tmap2"
            config={{
              title: `Occupations of People Deceased in ${place.name}`,
              data: tmapDeathData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              shapeConfig: shapeConfig(attrs),
              time: "deathyear",
              tooltipConfig: groupTooltip(tmapDeathData)
            }} />
        ]
      },
      {
        title: "Occupation Trends",
        slug: "occupation_trends",
        content: <OccupationTrends place={place} peopleBorn={peopleBornHere} peopleDied={peopleDiedHere} occupations={occupations} />,
        viz: [
          <StackedArea
                key="stacked1"
                config={{
                  title: "Births Over Time",
                  data: tmapBornData,
                  depth: 1,
                  groupBy: ["domain", "industry"].map(groupBy(attrs)),
                  shapeConfig: shapeConfig(attrs),
                  time: "bucketyear",
                  tooltipConfig: groupTooltip(tmapBornData),
                  x: "bucketyear",
                  y: d => d.id instanceof Array ? d.id.length : 1
                }} />,
          <StackedArea
                key="stacked2"
                config={{
                  title: "Deaths Over Time",
                  data: tmapDeathData,
                  depth: 1,
                  groupBy: ["domain", "industry"].map(groupBy(attrs)),
                  shapeConfig: shapeConfig(attrs),
                  time: "bucketyear",
                  tooltipConfig: groupTooltip(tmapDeathData),
                  x: "bucketyear",
                  y: d => d.id instanceof Array ? d.id.length : 1
                }} />
        ]
      },
      {
        title: "Cities",
        slug: "cities",
        viz: [<Geomap
                  key="geomap1"
                  config={{
                    title: `Major Cities in ${place.name} for Births and Deaths of Cultural Celebrities`,
                    data: geomapData,
                    depth: 1,
                    fitFilter: `${country.country_num}`,
                    groupBy: ["event", "place_name"],
                    shapeConfig: {
                      fill: d => d.event.toLowerCase().indexOf("birth") > 0
                               ? "rgba(76, 94, 215, 0.4)"
                               : "rgba(95, 1, 22, 0.4)",
                      stroke: () => "#4A4948",
                      strokeWidth: 1,
                      Path: {
                        fill: "transparent",
                        stroke: "#4A4948",
                        strokeWidth: 0.75
                      }
                    },
                    tooltipConfig: groupTooltip(geomapData)
                  }} />]
      },
      {
        title: "Overlapping Lives",
        slug: "overlapping_lives",
        viz: [<Priestley
                  title={`Lifespans of Top ${priestleyMax} Individuals Born in ${place.name}`}
                  key="priestley1"
                  config={{
                    data: priestleyData,
                    depth: 1,
                    end: "deathyear",
                    groupBy: ["domain", "name"].map(groupBy(attrs)),
                    start: "birthyear",
                    shapeConfig: Object.assign({}, shapeConfig(attrs), {
                      labelPadding: 2
                    }),
                    tooltipConfig: peopleTooltip
                  }} />]
      },
      {title: "Living People", slug: "living_people", content: <LivingPeople place={place} data={peopleBornHereAlive} />}
    ];
    // {title: "Historical Places", slug: "historical_places"},

    // catch for really small places...
    if (peopleBornHere.concat(peopleDiedHere).length < 5) {
      sections = [sections[0]];
    }

    // only show maps for countries not cities
    if (!place.is_country) {
      sections = sections.filter(s => s.slug !== "cities");
    }

    return (
      <div>
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={place.name}
          meta={config.meta.concat([{property: "og:title", content: place.name}])}
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
        <Footer />
      </div>
    );
  }
}

Place.need = [
  fetchPlace,
  fetchPlaceRanks,
  fetchCountry,
  fetchPeopleBornHere,
  fetchPeopleDiedHere,
  fetchAllOccupations,
  fetchPeopleBornHereAlive
];

function mapStateToProps(state) {
  return {
    placeProfile: state.placeProfile,
    occupationProfile: state.occupationProfile
  };
}

export default connect(mapStateToProps)(Place);
