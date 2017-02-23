import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import Header from "components/profile/occupation/Header";
import ProfileNav from "components/profile/Nav";
import Intro from "components/profile/occupation/Intro";
import People from "components/profile/occupation/People";
import Places from "components/profile/occupation/Places";
import PlacesTime from "components/profile/occupation/PlacesTime";
import RelatedOccupations from "components/profile/occupation/RelatedOccupations";
import Section from "components/profile/Section";
import NotFound from "components/NotFound";
import {fetchOccupation, fetchPeople, fetchPeopleInDomain, fetchAllOccupations} from "actions/occupation";
import {COLORS_CONTINENT, COLORS_DOMAIN, YEAR_BUCKETS} from "types";
import {Priestley, StackedArea, Treemap} from "d3plus-react";

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

    function gbHelper(g) {

      return d => {
        let val;

        if (d[g]) val = d[g];
        else if (d.occupation_id instanceof Array) val = attrs[d.occupation_id[0]][g];
        else val = attrs[d.occupation_id][g];

        return val;
      };

    }

    const shapeConfig = {
      fill: d => {
        if (d.color) return d.color;
        else if (d.occupation_id !== void 0) {
          const occ = d.occupation_id.constructor === Array ? d.occupation_id[0] : d.occupation_id;
          return COLORS_DOMAIN[attrs[occ].domain_slug];
        }
        return "#ccc";
      }
    };

    const groupTooltip = {
      body: d => {
        const names = d.name instanceof Array ? d.name.slice(0, 3) : [d.name];
        let txt = `<span class='sub'>Notable ${names.length === 1 ? "Person" : "People"}</span>`;
        const people = tmapDomainData.concat(tmapBornData).concat(tmapDeathData).filter(d => names.includes(d.name));
        const peopleNames = people.map(d => d.name);
        people.filter((d, i) => peopleNames.indexOf(d.name) === i).slice(0, 3).forEach(n => {
          txt += `<br /><span class="bold">${n.name}</span>b.${n.birthyear}`;
        });
        return txt;
      }
    };

    const peopleTooltip = {
      body: d => {
        const age = d.deathyear !== null
                  ? d.deathyear - d.birthyear
                  : new Date().getFullYear() - d.birthyear;
        return d.deathyear !== null
             ? `<span class="center">${d.birthyear} - ${d.deathyear}, ${age} years old</span>`
             : `<span class="center">Born ${d.birthyear}, ${age} years old</span>`;
      }
    };

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
              tooltipConfig: groupTooltip,
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
              tooltipConfig: groupTooltip,
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
              tooltipConfig: groupTooltip,
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
              tooltipConfig: groupTooltip,
              x: "bucketyear",
              y: d => d.id instanceof Array ? d.id.length : 1
            }} />
        ]
      },
      {
        title: "Overlapping Lives",
        slug: "overlapping_lives",
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
              title: `Occupations Within ${occupation.domain} Domain`,
              attrs: occupations,
              data: tmapDomainData,
              depth: 1,
              groupBy: ["industry", "occupation_name"].map(gbHelper),
              legend: false,
              shapeConfig,
              time: "birthyear",
              tooltipConfig: groupTooltip,
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />,
          <StackedArea
            key="stacked_domain"
            config={{
              title: `${occupation.domain} Domain Over Time`,
              attrs: occupations,
              data: tmapDomainData,
              depth: 1,
              groupBy: ["industry", "occupation_name"].map(gbHelper),
              legend: false,
              shapeConfig: Object.assign({}, shapeConfig, {
                stroke: () => "#F4F4F1",
                strokeWidth: () => 1
              }),
              time: "bucketyear",
              tooltipConfig: groupTooltip,
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
          title={occupation.occupation}
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
