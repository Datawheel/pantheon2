import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import config from "helmet.js";
import ProfileNav from "pages/profile/common/Nav";
import Section from "pages/profile/common/Section";
import Header from "pages/profile/person/Header";
import Intro from "pages/profile/person/Intro";
import Footer from "pages/profile/person/Footer";
import MemMetrics from "pages/profile/person/MemMetrics";
import OccupationRanking from "pages/profile/person/OccupationRanking";
import YearRanking from "pages/profile/person/YearRanking";
import PageviewsByLang from "pages/profile/person/PageviewsByLang";
import CountryRanking from "pages/profile/person/CountryRanking";
import NotFound from "components/NotFound";
// import {activateSearch} from "actions/nav";
// import {fetchPerson, fetchOccupationRanks, fetchCountryRanks, fetchYearRanks, fetchPageviews, fetchCreationdates} from "actions/person";
// import "css/components/profile/person";
import {LinePlot} from "d3plus-react";
import {extent} from "d3-array";
// import "css/components/profile/structure";
import {FORMATTERS, NUM_RANKINGS, NUM_RANKINGS_PRE, NUM_RANKINGS_POST} from "types/index";
import {plural} from "pluralize";

class Person extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // generate screenshot on page load
    const {id: slug} = this.props.params;
    const {person} = this.props.data;
    if (person !== undefined) {
      const screenshotUrl = `/api/screenshot/person/${slug}/`;
      axios.get(screenshotUrl)
        .then(response => {
          if (response.status === 200) console.log("Screenshot successful.");
          else console.log("[Screenshot] error.");
        })
        .catch(error => console.log(error));
    }
  }

  render() {
    const {person, occupationRanks, birthYearRanks, deathYearRanks, birthCountryRanks, wikiExtract, wikiPageViews, wikiSummary} = this.props.data;

    console.log("person!!!", person);
    console.log("birthCountryRanks!!!", birthCountryRanks);

    if (person === undefined) {
      return <NotFound />;
    }

    const maxPageViews = wikiPageViews.items ? Math.max(...wikiPageViews.items.map(d => d.views || 0)) : 0;
    const totalPageViews = wikiPageViews.items ? wikiPageViews.items.reduce((sum, d) => sum + d.views, 0) : 0;
    // const totalLanguages = Math.max(...pageViews.map(d => d.num_langs || 0));
    const totalLanguages = 44;
    const lMod = 0.95;

    // const lineData = pageViews
    //   .sort((a, b) => new Date(a.pageview_date) - new Date(b.pageview_date))
    //   .reduce((arr, d) => {
    //     arr.push({
    //       color: "#67AF8C",
    //       id: "LANGUAGES (L)",
    //       langs: d.num_langs || 0,
    //       x: new Date(d.pageview_date),
    //       y: (d.num_langs || 0) / totalLanguages * lMod
    //     });
    //     arr.push({
    //       color: "#4C5ED7",
    //       id: "PAGE VIEWS (PV)",
    //       views: d.num_pageviews || 0,
    //       x: new Date(d.pageview_date),
    //       y: d.num_pageviews / maxPageViews
    //     });
    //     return arr;
    //   }, []);

    const sections = [
      {title: "Memorability Metrics", slug: "metrics", content: <MemMetrics pageViews={wikiPageViews} person={person} />},
      {title: "Related Videos from YouTube", slug: "related", content: <div onClick={e => {
        e.target.childNodes[0].style.pointerEvents = "all";
      }}><iframe className="yasiv-youtube" src={`https://yasiv.com/youtube#?q=${person.name}%20${person.occupation.occupation}`} frameBorder="0" max-width="1024" width="100%" height="600" /></div>},
      // {
      //   title: "Online Attention",
      //   slug: "afterlife",
      //   viz: <LinePlot
      //     config={{
      //       height: 600,
      //       data: lineData,
      //       shapeConfig: {
      //         fill: d => d.color,
      //         Line: {
      //           fill: "none",
      //           stroke: d => {
      //             while (d.__d3plus__) d = d.data;
      //             return d.color;
      //           },
      //           strokeWidth: 2
      //         }
      //       },
      //       time: "x",
      //       timeline: false,
      //       tooltipConfig: {
      //         body: d => {
      //           let date = d.x instanceof Array ? extent(d.x) : [d.x];
      //           date = date.map(FORMATTERS.month);
      //           return `<span class="large">${FORMATTERS.commas(d.langs || d.views)}</span><br />${date.join(" to ")}`;
      //         },
      //         footer: ""
      //       },
      //       x: "x",
      //       xConfig: {tickFormat: d => FORMATTERS.year(new Date(d).getFullYear())},
      //       y: "y",
      //       yConfig: {tickFormat: () => "", title: false}
      //     }} />
      // },
      {title: `Page views of ${plural(person.name)} by language`, slug: "page-views-by-lang", content: <PageviewsByLang person={person} />},
      {title: `Among ${plural(person.occupation.occupation)}`, slug: "occupation_peers", content: <OccupationRanking person={person} ranking={occupationRanks} />}
    ];
    if (person.birthyear) {
      sections.push({title: "Contemporaries", slug: "year_peers", content: <YearRanking person={person} birthYearRanking={birthYearRanks} deathYearRanking={deathYearRanks} />});
    }
    if (person.bplace_country) {
      sections.push({title: `In ${person.bplace_country.country}`, slug: "country_peers", content: <CountryRanking person={person} ranking={birthCountryRanks} />});
    }

    const pageUrl = this.props.location.href.split("?")[0].replace(/\/$/, "");
    const pageHeaderMetaTags = config.meta.map(meta => {
      if (meta.property) {
        if (meta.property === "og:title") {
          return {property: "og:title", content: person.name};
        }
        if (meta.property === "og:image") {
          return {property: "og:image", content: `${pageUrl.replace("http://", "https://").replace("/profile/", "/images/screenshots/")}.jpg`};
        }
        if (meta.property === "og:description") {
          if (wikiSummary && wikiSummary.description) {
            const s2 = `${person.gender === "M" ? "His" : "Her"} biography is available in ${person.l} different languages on Wikipedia making ${person.gender === "M" ? "him" : "her"} the ${FORMATTERS.ordinal(person.occupation_rank_unique)} most popular ${person.occupation.occupation}.`;
            return {property: "og:description", content: `Pantheon profile of ${person.name}, ${wikiSummary.description}. ${s2}`};
          }
        }
      }
      return meta;
    });

    // return <NotFound />;

    return (
      <div className="person">
        <Helmet
          title={person.name}
          meta={pageHeaderMetaTags}
        />
        <Header person={person} wikiPageViews={wikiPageViews} />
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro
            person={person}
            totalPageViews={totalPageViews}
            wikiExtract={wikiExtract} />
        </div>

        {sections.map((section, key) =>
          <Section
            index={key}
            key={section.slug}
            numSections={sections.length}
            title={section.title}
            slug={section.slug}>
            {section.content ? section.content : null}
            {section.viz ? <div className="viz">{section.viz}</div> : null}
          </Section>
        )}
        <Footer person={person} ranking={occupationRanks} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const personURL = "/person?slug=eq.<id>&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*";
// const pageViewsURL = "/indicators?person=eq.<person.id>&order=pageview_date&num_pageviews=not.is.null";
const occupationRanksURL = "/person?occupation=eq.<person.occupation.id>&occupation_rank_unique=gte.<person.occupationRankLow>&occupation_rank_unique=lte.<person.occupationRankHigh>&order=occupation_rank_unique&select=occupation(*),bplace_country(*),hpi,l,occupation_rank,occupation_rank_unique,slug,gender,name,id,wp_id,birthyear,deathyear";
const birthYearRanksURL = "/person?birthyear=eq.<person.birthyear>&birthyear_rank_unique=gte.<person.birthYearRankLow>&birthyear_rank_unique=lte.<person.birthYearRankHigh>&order=birthyear_rank_unique&select=occupation(id,domain,domain_slug),bplace_country(*),l,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,wp_id,birthyear,deathyear";
const deathYearRanksURL = "/person?deathyear=eq.<person.deathyearId>&deathyear_rank_unique=gte.<person.deathYearRankLow>&deathyear_rank_unique=lte.<person.deathYearRankHigh>&order=deathyear_rank_unique&select=occupation(id,domain,domain_slug),dplace_country(*),l,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,wp_id,deathyear,birthyear";
const birthCountryRanksURL = "/person?bplace_country=eq.<person.bplace_country.country>&bplace_country_rank_unique=gte.<person.bplaceCountryRankLow>&bplace_country_rank_unique=lte.<person.bplaceCountryRankHigh>&order=bplace_country_rank_unique&select=bplace_country(*),l,hpi,bplace_country_rank,bplace_country_rank_unique,slug,gender,name,id,wp_id,deathyear,birthyear";
const wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&explaintext&exsectionformat=wiki&exintro&pageids=<person.id>&format=json&exlimit=1&origin=*";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<person.wikiSlug>/monthly/20110101/${year}${month}01`;
const wikiSummaryURL = "https://en.wikipedia.org/api/rest_v1/page/summary/<person.wikiSlug>";

Person.preneed = [
  fetchData("person", personURL, res => {
    const person = res[0];
    const occupationRankLow = Math.max(1, parseInt(person.occupation_rank_unique, 10) - NUM_RANKINGS_PRE);
    const occupationRankHigh = Math.max(NUM_RANKINGS, parseInt(person.occupation_rank_unique, 10) + NUM_RANKINGS_POST);

    const birthYearRankLow = Math.max(1, parseInt(person.birthyear_rank_unique, 10) - NUM_RANKINGS_PRE);
    const birthYearRankHigh = Math.max(NUM_RANKINGS, parseInt(person.birthyear_rank_unique, 10) + NUM_RANKINGS_POST);

    const deathYearRankLow = person.deathyear_rank_unique ? Math.max(1, parseInt(person.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE) : "9999";
    const deathYearRankHigh = person.deathyear_rank_unique ? Math.max(NUM_RANKINGS, parseInt(person.deathyear_rank_unique, 10) + NUM_RANKINGS_POST) : "9999";

    const deathyearId = person.deathyear || "9999";
    const deathyear_rank_unique = person.deathyear_rank_unique || "9999";

    const bplaceCountryRankLow = Math.max(1, parseInt(person.bplace_country_rank_unique, 10) - NUM_RANKINGS_PRE);
    const bplaceCountryRankHigh = Math.max(NUM_RANKINGS, parseInt(person.bplace_country_rank_unique, 10) + NUM_RANKINGS_POST);

    const wikiSlug = person.name.replace(/ /g, "_");

    return {...person, wikiSlug, deathyear_rank_unique, deathyearId, occupationRankLow, occupationRankHigh, birthYearRankLow, birthYearRankHigh, deathYearRankLow, deathYearRankHigh, bplaceCountryRankLow, bplaceCountryRankHigh};
  })
];

Person.need = [
//   fetchPerson,
// //   fetchOccupationRanks,
// //   fetchCountryRanks,
// //   fetchYearRanks,
  // fetchData("pageViews", pageViewsURL, res => res),
  fetchData("occupationRanks", occupationRanksURL, res => res),
  fetchData("birthYearRanks", birthYearRanksURL, res => res),
  fetchData("deathYearRanks", deathYearRanksURL, res => res),
  fetchData("birthCountryRanks", birthCountryRanksURL, res => res),
  fetchData("wikiExtract", wikiURL),
  fetchData("wikiPageViews", wikiPageViewsURL),
  fetchData("wikiSummary", wikiSummaryURL)
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
