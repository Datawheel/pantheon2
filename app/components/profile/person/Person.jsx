import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import ProfileNav from "components/profile/Nav";
import Section from "components/profile/Section";
import Header from "components/profile/person/Header";
import Intro from "components/profile/person/Intro";
import MemMetrics from "components/profile/person/MemMetrics";
import OccupationRanking from "components/profile/person/OccupationRanking";
import YearRanking from "components/profile/person/YearRanking";
import CountryRanking from "components/profile/person/CountryRanking";
import NotFound from "components/NotFound";
import {activateSearch} from "actions/users";
import {fetchPerson, fetchOccupationRanks, fetchCountryRanks, fetchYearRanks, fetchPageviews, fetchCreationdates} from "actions/person";
import "css/components/profile/person";
import {LinePlot} from "d3plus-react";

import {FORMATTERS} from "types";

class Person extends Component {

  /*
   * This replaces getInitialState. Likewise getDefaultProps and propTypes are just
   * properties on the constructor
   * Read more here: https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#es6-classes
   */
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.personProfile.person.id === undefined) {
      return <NotFound />;
    }
    // return <div>testing...</div>
    const {personProfile} = this.props;
    const occupation = personProfile.person.occupation;

    const maxPageViews = Math.max(...personProfile.pageviews.map(d => d.num_pageviews));
    const totalPageViews = personProfile.pageviews.reduce((sum, d) => sum + d.num_pageviews, 0);
    const totalLanguages = personProfile.creationdates.length;
    let languageCounter = 0;
    const lMod = 0.95;
    const lineData = personProfile.creationdates
      .sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date))
      .map(d => {
        languageCounter++;
        return {
          color: "#67AF8C",
          id: "LANGUAGES (L)",
          langs: languageCounter,
          x: new Date(d.creation_date),
          y: languageCounter / totalLanguages * lMod
        };
      })
      .concat(personProfile.pageviews.map(d => ({
        color: "#4C5ED7",
        id: "PAGE VIEWS (PV)",
        views: d.num_pageviews,
        x: new Date(d.pageview_date),
        y: d.num_pageviews / maxPageViews
      })));

    const latestLanguage = Math.max(...personProfile.creationdates.map(d => new Date(d.creation_date))),
          latestPageView = Math.max(...personProfile.pageviews.map(d => new Date(d.pageview_date)));

    if (latestPageView > latestLanguage) {
      lineData.push({
        color: "#67AF8C",
        langs: languageCounter,
        id: "LANGUAGES (L)",
        x: latestPageView,
        y: 1 * lMod
      });
    }

    const sections = [
      {title: "Memorability Metrics", slug: "metrics", content: <MemMetrics pageviews={personProfile.pageviews} person={personProfile.person} />},
      {
        title: personProfile.person.alive ? "Global Culture Career" : "Digital Afterlife",
        slug: "afterlife",
        viz: <LinePlot
                  config={{
                    aggs: {
                      langs: a => Math.max(...a)
                    },
                    height: 600,
                    title: "Title here...",
                    data: lineData,
                    legendConfig: {
                      shapeConfig: {
                        fontColor: "#363636",
                        fontFamily: () => "Amiko",
                        fontSize: () => 12
                      }
                    },
                    time: d => d.x,
                    shapeConfig: {
                      Line: {
                        fill: "none",
                        stroke: d => d.color,
                        strokeWidth: 1
                      }
                    },
                    timeline: false,
                    tooltipConfig: {
                      body: d => `<span class="center">${FORMATTERS.date(d.x)} - ${FORMATTERS.commas(d.langs || d.views)}</span>`
                    }
                  }} />
      },
      {title: `Among ${occupation.occupation}s`, slug: "occupation_peers", content: <OccupationRanking person={personProfile.person} ranking={personProfile.occupationRank} />},
      {title: "Contemporaries", slug: "year_peers", content: <YearRanking person={personProfile.person} ranking={personProfile.yearRank} />},
      {title: "In the Same Place", slug: "country_peers", content: <CountryRanking person={personProfile.person} ranking={personProfile.countryRank} />}
    ];

    return (
      <div className="person">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={personProfile.person.name}
          meta={config.meta.concat([{property: "og:title", content: personProfile.person.name}])}
          link={config.link}
        />
        <Header person={personProfile.person} pageviews={personProfile.pageviews} />
        <ProfileNav sections={sections} />
        <Intro totalPageViews={totalPageViews} />
        {sections.map((section, key) =>
          <Section
            index={key}
            key={key}
            numSections={sections.length}
            title={section.title}
            slug={section.slug}>
            {section.content ? section.content : null}
            {section.viz ? <div className="viz">{section.viz}</div> : null}
          </Section>
        )}
      </div>
    );
  }
}

Person.need = [
  fetchPerson,
  fetchOccupationRanks,
  fetchCountryRanks,
  fetchYearRanks,
  fetchPageviews,
  fetchCreationdates
];

function mapStateToProps(state) {
  return {
    personProfile: state.personProfile
  };
}

export default connect(mapStateToProps, {activateSearch})(Person);
