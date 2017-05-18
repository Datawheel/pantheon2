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
import {FORMATTERS, YEAR_BUCKETS} from "types";
import {Geomap, Priestley, Treemap, StackedArea} from "d3plus-react";
import {bucketScale, groupBy, groupTooltip, on, peopleTooltip, shapeConfig} from "viz/helpers";
import "css/components/profile/structure";

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
      d.logyear = birthyearSpan < YEAR_BUCKETS * 2
                ? d.birthyear
                : bucketScale(d.birthyear);
      d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                   ? d.birthyear
                   : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

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
      d.logyear = deathyearSpan < YEAR_BUCKETS * 2
                ? d.deathyear
                : bucketScale(d.deathyear);
      d.bucketyear = deathyearSpan < YEAR_BUCKETS * 2
                   ? d.deathyear
                   : Math.round(d.deathyear / YEAR_BUCKETS) * YEAR_BUCKETS;
    });

    const geomapBornData = tmapBornData.filter(d => d.place && d.place.lat_lon)
              .sort((a, b) => b.langs - a.langs)
              .slice(0, 100);
    geomapBornData.forEach(d => {
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

    const geomapDeathData = tmapDeathData.filter(d => d.place && d.place.lat_lon)
              .sort((a, b) => b.langs - a.langs)
              .slice(0, 100);
    geomapDeathData.forEach(d => {
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
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.occupation.occupation_slug)
            }} />,
          <Treemap
            key="tmap2"
            config={{
              title: `Occupations of People Deceased in ${place.name}`,
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
                  groupBy: ["domain", "industry"].map(groupBy(attrs)),
                  shapeConfig: shapeConfig(attrs),
                  time: "logyear",
                  timeline: false,
                  tooltipConfig: groupTooltip(tmapBornData),
                  x: "logyear",
                  xConfig: {
                    tickFormat: d => FORMATTERS.year(bucketScale.invert(d))
                  },
                  y: d => d.id instanceof Array ? d.id.length : 1
                }} />,
          <StackedArea
                key="stacked2"
                config={{
                  title: "Deaths Over Time",
                  data: tmapDeathData,
                  groupBy: ["domain", "industry"].map(groupBy(attrs)),
                  shapeConfig: shapeConfig(attrs),
                  time: "logyear",
                  timeline: false,
                  tooltipConfig: groupTooltip(tmapDeathData),
                  x: "logyear",
                  xConfig: {
                    tickFormat: d => FORMATTERS.year(bucketScale.invert(d))
                  },
                  y: d => d.id instanceof Array ? d.id.length : 1
                }} />
        ]
      },
      {
        title: "Cities of Cultural Celebrity Births",
        slug: "citiesBorn",
        viz: [<Geomap
                  key="geomapBirths"
                  config={{
                    title: `Major Cities in ${place.name} for Births of Cultural Celebrities`,
                    data: geomapBornData,
                    depth: 1,
                    fitFilter: `${country.country_num}`,
                    groupBy: ["event", "place_name"],
                    on: on("place", d => d.place.slug),
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
                    tooltipConfig: groupTooltip(geomapBornData, d => d.place.slug)
                  }} />]
      },
      {
        title: "Cities of Cultural Celebrity Deaths",
        slug: "citiesDeath",
        viz: [<Geomap
                  key="geomapDeaths"
                  config={{
                    title: `Major Cities in ${place.name} for Deaths of Cultural Celebrities`,
                    data: geomapDeathData,
                    depth: 1,
                    fitFilter: `${country.country_num}`,
                    groupBy: ["event", "place_name"],
                    on: on("place", d => d.place.slug),
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
                    tooltipConfig: groupTooltip(geomapDeathData, d => d.place.slug)
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
                    on: on("person", d => d.slug),
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
          title={`${place.name} - Pantheon`}
          meta={config.meta.concat([{property: "og:title", content: place.name}])}
          link={config.link}
        />
        <Header place={place} country={country} people={peopleBornHere} />
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro place={place} placeRanks={placeRanks} />
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
