import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import {fetchData} from "datawheel-canon";

// import config from "helmconfig.js";
import ProfileNav from "pages/profile/common/Nav";
import Section from "pages/profile/common/Section";
import Header from "pages/profile/person/Header";
import Intro from "pages/profile/person/Intro";
// import Footer from "components/profile/person/Footer";
import MemMetrics from "pages/profile/person/MemMetrics";
import OccupationRanking from "pages/profile/person/OccupationRanking";
import YearRanking from "pages/profile/person/YearRanking";
// import CountryRanking from "components/profile/person/CountryRanking";
import NotFound from "components/NotFound";
// import {activateSearch} from "actions/nav";
// import {fetchPerson, fetchOccupationRanks, fetchCountryRanks, fetchYearRanks, fetchPageviews, fetchCreationdates} from "actions/person";
// import "css/components/profile/person";
import {LinePlot} from "d3plus-react";
import {extent} from "d3-array";
// import "css/components/profile/structure";
import {FORMATTERS, NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";

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

    // if (this.props.personProfile.person.id === undefined) {
    //   return <NotFound />;
    // }
    // console.log(this.props);
    const {person, pageViews, occupationRanks, birthYearRanks, deathYearRanks} = this.props.data;

    // const {personProfile} = this.props;
    // const occupation = personProfile.person.occupation;
    //
    const maxPageViews = Math.max(...pageViews.map(d => d.num_pageviews || 0));
    const totalPageViews = pageViews.reduce((sum, d) => sum + d.num_pageviews, 0);
    const totalLanguages = Math.max(...pageViews.map(d => d.num_langs || 0));
    const lMod = 0.95;

    const lineData = pageViews
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
      {title: "Memorability Metrics", slug: "metrics", content: <MemMetrics pageViews={pageViews} person={person} />},
      {title: "Related Videos from YouTube", slug: "related", content: <div onClick={e => { e.target.childNodes[0].style.pointerEvents = "all"; }}><iframe className="yasiv-youtube" src={`https://yasiv.com/youtube#?q=${person.name}%20${person.occupation.occupation}`} frameBorder="0" width="1024" height="600" /></div>},
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
      {title: `Among ${person.occupation.occupation}s`, slug: "occupation_peers", content: <OccupationRanking person={person} ranking={occupationRanks} />},
      {title: "Contemporaries", slug: "year_peers", content: <YearRanking person={person} birthYearRanking={birthYearRanks} deathYearRanking={deathYearRanks} />}
    ];
    //
    // if (personProfile.person.birthcountry) {
    //   sections.push({title: `In ${personProfile.person.birthcountry.name}`, slug: "country_peers", content: <CountryRanking person={personProfile.person} ranking={personProfile.countryRank} />});
    // }
    //
    return (
      <div className="person">
        {/*
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={`${personProfile.person.name} - Pantheon`}
          meta={config.meta.concat([{property: "og:title", content: personProfile.person.name}])}
          link={config.link}
        />
        */}
        <Header person={person} pageViews={pageViews} />
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro
            person={person}
            totalPageViews={totalPageViews} />
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
        {/* <Footer person={person} ranking={occupationRank} /> */}
      </div>
    );
  }
}

const personURL = "http://localhost:3100/person?slug=eq.<id>&select=occupation{*},birthcountry{*},birthplace{*},birthyear{*},deathcountry{*},deathplace{*},deathyear{*},*,birthyearId:birthyear,deathyearId:deathyear";
const pageViewsURL = "http://localhost:3100/indicators?person=eq.<person.id>&order=pageview_date&num_pageviews=not.is.null";
const occupationRanksURL = "http://localhost:3100/person?occupation=eq.<person.occupation.id>&occupation_rank_unique=gte.<person.occupationRankLow>&occupation_rank_unique=lte.<person.occupationRankHigh>&order=occupation_rank_unique&select=occupation{*},birthcountry{*},hpi,langs,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear";
const birthYearRanksURL = "http://localhost:3100/person?birthyear=eq.<person.birthyearId>&birthyear_rank_unique=gte.<person.birthYearRankLow>&birthyear_rank_unique=lte.<person.birthYearRankHigh>&order=birthyear_rank_unique&select=occupation{id,domain_slug},birthcountry{*},langs,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,birthyear,deathyear";
const deathYearRanksURL = "http://localhost:3100/person?deathyear=eq.<person.deathyearId>&deathyear_rank_unique=gte.<person.deathYearRankLow>&deathyear_rank_unique=lte.<person.deathYearRankHigh>&order=deathyear_rank_unique&select=occupation{id,domain_slug},deathcountry{*},langs,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,deathyear,birthyear";
Person.preneed = [
  fetchData("person", personURL, res => {
    const person = res[0];

    const occupationRankLow = Math.max(1, parseInt(person.occupation_rank_unique, 10) - NUM_RANKINGS_PRE);
    const occupationRankHigh = Math.max(NUM_RANKINGS, parseInt(person.occupation_rank_unique, 10) + NUM_RANKINGS_POST);

    const birthYearRankLow = Math.max(1, parseInt(person.birthyear_rank_unique, 10) - NUM_RANKINGS_PRE);
    const birthYearRankHigh = Math.max(NUM_RANKINGS, parseInt(person.birthyear_rank_unique, 10) + NUM_RANKINGS_POST);

    const deathYearRankLow = Math.max(1, parseInt(person.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE);
    const deathYearRankHigh = Math.max(NUM_RANKINGS, parseInt(person.deathyear_rank_unique, 10) + NUM_RANKINGS_POST);

    return Object.assign({occupationRankLow, occupationRankHigh, birthYearRankLow, birthYearRankHigh, deathYearRankLow, deathYearRankHigh}, person);
  })
];

Person.need = [
//   fetchPerson,
// //   fetchOccupationRanks,
// //   fetchCountryRanks,
// //   fetchYearRanks,
  fetchData("pageViews", pageViewsURL, res => res),
  fetchData("occupationRanks", occupationRanksURL, res => res),
  fetchData("birthYearRanks", birthYearRanksURL, res => res),
  fetchData("deathYearRanks", deathYearRanksURL, res => res)
// //   fetchCreationdates
];

// function mapStateToProps(state) {
//   return {
//     personProfile: state.personProfile
//   };
// }
//
// export default connect(mapStateToProps)(Person);

export default connect(state => ({
  data: state.data,
  env: state.env,
  location: state.location
}), {})(Person);
