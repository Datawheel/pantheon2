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
import {Geomap, Priestley, StackedArea, Treemap} from "d3plus-react";
import {COLORS_CONTINENT, FORMATTERS, YEAR_BUCKETS} from "types";
import {bucketScale, groupBy, groupTooltip, on, peopleTooltip, shapeConfig} from "viz/helpers";

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
      .filter(p => p.birthcountry !== null)
      .sort((a, b) => b.langs - a.langs);
    tmapBornData.forEach(d => {
      d.borncountry = d.birthcountry.country_name;
      d.borncontinent = d.birthcountry.continent;
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
      {
        title: "Occupations Over Time",
        slug: "occupations_over_time",
        content: null,
        viz: [
          <StackedArea
            key="stacked1"
            config={{
              title: "Births Over Time",
              data: tmapBornData,
              groupBy: ["domain"].map(groupBy(attrs)),
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
              title: "Birth Shares Over Time",
              data: tmapBornData,
              groupBy: ["domain"].map(groupBy(attrs)),
              shapeConfig: shapeConfig(attrs),
              stackOffset: "expand",
              time: "logyear",
              timeline: false,
              tooltipConfig: groupTooltip(tmapBornData),
              x: "logyear",
              xConfig: {
                tickFormat: d => FORMATTERS.year(bucketScale.invert(d))
              },
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Places",
        slug: "places",
        viz: [<Geomap
                  key="geomap1"
                  config={{
                    title: `Major Cities in ${era.name} for Births and Deaths of Cultural Celebrities`,
                    data: geomapData,
                    depth: 1,
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
                    tooltipConfig: groupTooltip(geomapData, d => d.place.slug)
                  }} />]
      },
      {
        title: "Places Over Time",
        slug: "places_over_time",
        content: null,
        viz: [
          <StackedArea
            key="stacked_country1"
            config={{
              title: `Birth Places of people born during the ${era.name}`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              on: on("place", d => d.birthcountry.slug),
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              time: "logyear",
              timeline: false,
              tooltipConfig: groupTooltip(tmapBornData, d => d.birthcountry.slug),
              x: "logyear",
              xConfig: {
                tickFormat: d => FORMATTERS.year(bucketScale.invert(d))
              },
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Overlapping Lives",
        slug: "overlapping_lives",
        viz: [<Priestley
                  title={`Top ${priestleyMax} Contemporaries Born during the ${era.name}`}
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
      }
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
