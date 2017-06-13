import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import ProfileNav from "components/profile/Nav";
import Section from "components/profile/Section";
import Header from "components/profile/person/Header";
import Intro from "components/profile/person/Intro";
import Footer from "components/profile/person/Footer";
import MemMetrics from "components/profile/person/MemMetrics";
import OccupationRanking from "components/profile/person/OccupationRanking";
import YearRanking from "components/profile/person/YearRanking";
import CountryRanking from "components/profile/person/CountryRanking";
import NotFound from "components/NotFound";
import {activateSearch} from "actions/nav";
import {fetchPerson, fetchOccupationRanks, fetchCountryRanks, fetchYearRanks, fetchPageviews, fetchCreationdates} from "actions/person";
import "css/components/profile/person";
import {LinePlot} from "d3plus-react";
import {extent} from "d3-array";
import "css/components/profile/structure";

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

    const {personProfile} = this.props;
    const occupation = personProfile.person.occupation;

    const maxPageViews = Math.max(...personProfile.pageviews.map(d => d.num_pageviews || 0));
    const totalPageViews = personProfile.pageviews.reduce((sum, d) => sum + d.num_pageviews, 0);
    const totalLanguages = Math.max(...personProfile.pageviews.map(d => d.num_langs || 0));
    const lMod = 0.95;

    const lineData = personProfile.pageviews
      .sort((a, b) => new Date(a.pageview_date) - new Date(b.pageview_date))
      .reduce((arr, d) => {
        arr.push({
          color: "#67AF8C",
          id: "LANGUAGES (L)",
          langs: d.num_langs || 0,
          x: new Date(d.pageview_date),
          y: (d.num_langs || 0) / totalLanguages * lMod
        });
        arr.push({
          color: "#4C5ED7",
          id: "PAGE VIEWS (PV)",
          views: d.num_pageviews || 0,
          x: new Date(d.pageview_date),
          y: d.num_pageviews / maxPageViews
        });
        return arr;
      }, []);

    const sections = [
      {title: "Memorability Metrics", slug: "metrics", content: <MemMetrics pageviews={personProfile.pageviews} person={personProfile.person} />},
      {title: "Related Videos from YouTube", slug: "related", content: <div onClick={e => { e.target.childNodes[0].style.pointerEvents = "all"; }}><iframe className="yasiv-youtube" src={`https://yasiv.com/youtube#?q=${personProfile.person.name}`} frameBorder="0" width="1024" height="600" /></div>},
      {
        title: "Online Attention",
        slug: "afterlife",
        viz: <LinePlot
              config={{
                height: 600,
                data: lineData,
                shapeConfig: {
                  fill: d => d.color,
                  Line: {
                    fill: "none",
                    stroke: d => {
                      while (d.__d3plus__) d = d.data;
                      return d.color;
                    },
                    strokeWidth: 2
                  }
                },
                time: "x",
                timeline: false,
                tooltipConfig: {
                  body: d => {
                    let date = d.x instanceof Array ? extent(d.x) : [d.x];
                    date = date.map(FORMATTERS.month);
                    return `<span class="large">${FORMATTERS.commas(d.langs || d.views)}</span><br />${date.join(" to ")}`;
                  },
                  footer: ""
                },
                x: "x",
                xConfig: {tickFormat: d => FORMATTERS.year(new Date(d).getFullYear())},
                y: "y",
                yConfig: {tickFormat: () => "", title: false}
              }} />
      },
      {title: `Among ${occupation.occupation}s`, slug: "occupation_peers", content: <OccupationRanking person={personProfile.person} ranking={personProfile.occupationRank} />},
      {title: "Contemporaries", slug: "year_peers", content: <YearRanking person={personProfile.person} ranking={personProfile.yearRank} />}
    ];

    if (personProfile.person.birthcountry) {
      sections.push({title: "In the Same Place", slug: "country_peers", content: <CountryRanking person={personProfile.person} ranking={personProfile.countryRank} />});
    }

    return (
      <div className="person">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={`${personProfile.person.name} - Pantheon`}
          meta={config.meta.concat([{property: "og:title", content: personProfile.person.name}])}
          link={config.link}
        />
        <Header person={personProfile.person} pageviews={personProfile.pageviews} />
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro totalPageViews={totalPageViews} />
        </div>
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
        <Footer person={personProfile.person} ranking={personProfile.occupationRank} />
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
