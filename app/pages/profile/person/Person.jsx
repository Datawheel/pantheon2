import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import {Helmet} from "react-helmet-async";
import {fetchData} from "@datawheel/canon-core";
import axios from "axios";
import config from "helmet.js";
import ProfileNav from "pages/profile/common/Nav";
import Section from "pages/profile/common/Section";
import Header from "pages/profile/person/Header";
import Intro from "pages/profile/person/Intro";
import Footer from "pages/profile/person/Footer";
import MemMetrics from "pages/profile/person/MemMetrics";
import News from "pages/profile/person/News";
import Movies from "pages/profile/person/Movies";
import Twitter from "pages/profile/person/Twitter";
import Books from "pages/profile/person/Books";
import OccupationRanking from "pages/profile/person/OccupationRanking";
import YearRanking from "pages/profile/person/YearRanking";
import PageviewsByLang from "pages/profile/person/PageviewsByLang";
import CountryRanking from "pages/profile/person/CountryRanking";
import CountryOccupationRanking from "pages/profile/person/CountryOccupationRanking";
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
    const {id: slug} = this.props.params;
    const {person} = this.props.data;
    if (person !== undefined) {
      // generate screenshot on page load
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
    const {person, occupationRanks, birthYearRanks, deathYearRanks, birthCountryRanks, birthCountryOccupationRanks,
      personRanks, wikiExtract, wikiPageViews, wikiSummary, wikiRelated, newsArticles} = this.props.data;
    // const isTrending = wikiPageViewsPast30Days && wikiPageViewsPast30Days.length;

    if (person === undefined) {
      return <NotFound />;
    }
    // console.log("newsArticles!", newsArticles);

    const maxPageViews = wikiPageViews && wikiPageViews.items ? Math.max(...wikiPageViews.items.map(d => d.views || 0)) : 0;
    const totalPageViews = wikiPageViews && wikiPageViews.items ? wikiPageViews.items.reduce((sum, d) => sum + d.views, 0) : 0;
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
      {title: "Memorability Metrics", slug: "metrics", content: <MemMetrics pageViews={wikiPageViews} person={person} />}
    ];
    if (newsArticles.length) {
      sections.push({title: "In the news", slug: "news_articles", content: <News person={person} newsArticles={newsArticles} />});
    }
    if (person.occupation.id === "WRITER") {
      sections.push({title: "Notable Works", slug: "books", content: <Books person={person} />});
    }
    sections.push({title: `Page views of ${plural(person.name)} by language`, slug: "page-views-by-lang", content: <PageviewsByLang person={person} />});
    sections.push({title: `Among ${plural(person.occupation.occupation)}`, slug: "occupation_peers", content: <OccupationRanking person={person} ranking={occupationRanks} />});
    if (person.birthyear) {
      sections.push({title: "Contemporaries", slug: "year_peers", content: <YearRanking person={person} birthYearRanking={birthYearRanks} deathYearRanking={deathYearRanks} />});
    }
    if (person.bplace_country) {
      sections.push({title: `In ${person.bplace_country.country}`, slug: "country_peers", content: <CountryRanking person={person} ranking={birthCountryRanks} />});
      sections.push({title: `Among ${plural(person.occupation.occupation)} In ${person.bplace_country.country}`, slug: "country_occupation_peers", content: <CountryOccupationRanking person={person} ranking={birthCountryOccupationRanks} />});
    }
    if (person.twitter) {
      sections.push({title: "Twitter Activity", slug: "twitter", content: <Twitter person={person} />});
    }
    if (["ACTOR", "COMEDIAN"].includes(person.occupation.id)) {
      sections.push({title: "Television and Movie Roles", slug: "movies", content: <Movies person={person} />});
    }
    if (["FILM DIRECTOR"].includes(person.occupation.id)) {
      sections.push({title: "Filmography", slug: "movies", content: <Movies person={person} />});
    }
    // Add YASIV youtube network
    // sections.push({
    //   title: "Related Videos from YouTube",
    //   slug: "related",
    //   content: <div onClick={e => {
    //     e.target.childNodes[0].style.pointerEvents = "all";
    //   }}><iframe className="yasiv-youtube" src={`https://yasiv.com/youtube#?q=${person.name}%20${person.occupation.occupation.toLowerCase()}`} frameBorder="0" max-width="1024" width="100%" height="600" /></div>
    // });

    let titleContent = `${person.name} Biography`;
    const pageUrl = this.props.location.href.split("?")[0].replace(/\/$/, "");
    const pageHeaderMetaTags = config.meta.map(meta => {
      if (meta.property) {
        if (meta.property === "og:title") {
          titleContent = wikiSummary && wikiSummary.description ? `${person.name} Biography - ${wikiSummary.description}` : titleContent;
          return {property: "og:title", content: titleContent};
        }
        if (meta.property === "og:image") {
          return {property: "og:image", content: `${pageUrl.replace("http://", "https://").replace("/profile/", "/images/screenshots/")}.jpg`};
        }
        if (meta.property === "og:description") {
          if (wikiSummary && wikiSummary.description) {
            const s2 = `${person.gender ? person.gender === "M" ? "His" : "Her" : "Their"} biography is available in ${person.l} different languages on Wikipedia making ${person.gender ? person.gender === "M" ? "him" : "her" : "them"} the ${FORMATTERS.ordinal(person.occupation_rank_unique)} most popular ${person.occupation.occupation.toLowerCase()}.`;
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
          title={titleContent}
          meta={pageHeaderMetaTags}
        />
        <Header person={person} wikiPageViews={wikiPageViews} />
        <div className="about-section">
          <ProfileNav sections={sections} />
          <Intro
            person={person}
            personRanks={personRanks}
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
        <Footer person={person} ranking={occupationRanks} wikiRelated={wikiRelated} />
      </div>
    );
  }
}

const dateobj = new Date();
const year = dateobj.getFullYear();
const month = `${dateobj.getMonth() + 1}`.replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
const personURL = "/person?slug=eq.<id>&select=occupation(*),bplace_geonameid(*),bplace_country(*),dplace_geonameid(*),*";
const personRanksURL = "/person_ranks?slug=eq.<id>";
// const pageViewsURL = "/indicators?person=eq.<person.id>&order=pageview_date&num_pageviews=not.is.null";
const occupationRanksURL = "/person_ranks?occupation=eq.<person.occupation.id>&occupation_rank_unique=gte.<personRanks.occupationRankLow>&occupation_rank_unique=lte.<personRanks.occupationRankHigh>&order=occupation_rank_unique&select=occupation,bplace_country,hpi,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear";
const birthYearRanksURL = "/person_ranks?birthyear=eq.<person.birthyear>&birthyear_rank_unique=gte.<personRanks.birthYearRankLow>&birthyear_rank_unique=lte.<personRanks.birthYearRankHigh>&order=birthyear_rank_unique&select=occupation,bplace_country,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,birthyear,deathyear";
const deathYearRanksURL = "/person_ranks?deathyear=eq.<personRanks.deathyearId>&deathyear_rank_unique=gte.<personRanks.deathYearRankLow>&deathyear_rank_unique=lte.<personRanks.deathYearRankHigh>&order=deathyear_rank_unique&select=occupation,dplace_country,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,deathyear,birthyear";
const birthCountryRanksURL = "/person_ranks?bplace_country=eq.<personRanks.bplaceCountry>&bplace_country_rank_unique=gte.<personRanks.bplaceCountryRankLow>&bplace_country_rank_unique=lte.<personRanks.bplaceCountryRankHigh>&order=bplace_country_rank_unique&select=bplace_country,hpi,bplace_country_rank,bplace_country_rank_unique,slug,gender,name,id,deathyear,birthyear";
const birthCountryOccupationRanksURL = "/person_ranks?occupation=eq.<person.occupation.id>&bplace_country=eq.<personRanks.bplaceCountry>&bplace_country_occupation_rank_unique=gte.<personRanks.bplaceCountryOccupationRankLow>&bplace_country_occupation_rank_unique=lte.<personRanks.bplaceCountryOccupationRankHigh>&order=bplace_country_occupation_rank_unique&select=bplace_country,occupation,hpi,slug,bplace_country_occupation_rank,bplace_country_occupation_rank_unique,gender,name,id,deathyear,birthyear";
const wikiURL = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=4&explaintext&exsectionformat=wiki&exintro&pageids=<person.id>&format=json&exlimit=1&origin=*";
const wikiPageViewsURL = `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/<person.wikiSlug>/monthly/20110101/${year}${month}01`;
const wikiSummaryURL = "https://en.wikipedia.org/api/rest_v1/page/summary/<person.wikiSlug>";
const wikiRelatedURL = "https://pantheon.world/api/wikiRelated?slug=<person.wikiSlug>";
const newsArticlesURL = "https://pantheon.world/api/news?pid=<person.id>";
// const wikiTrendingURL = "https://pantheon.world/api/wikiTrendDetails?pid=<person.id>";

Person.preneed = [
  fetchData("personRanks", personRanksURL, res => {
    const person = res[0];
    // Calculate min/max for occupation peers
    const occupationRank = person.occupation_rank_unique;
    const occupationRankPrev = person.occupation_rank_prev;
    const occupationRankLow = Math.max(1, parseInt(person.occupation_rank_unique, 10) - NUM_RANKINGS_PRE);
    const occupationRankHigh = Math.max(NUM_RANKINGS, parseInt(person.occupation_rank_unique, 10) + NUM_RANKINGS_POST);
    // Calculate min/max for birthyear peers
    const birthYearRank = person.birthyear_rank_unique;
    const birthYearRankLow = Math.max(1, parseInt(person.birthyear_rank_unique, 10) - NUM_RANKINGS_PRE);
    const birthYearRankHigh = Math.max(NUM_RANKINGS, parseInt(person.birthyear_rank_unique, 10) + NUM_RANKINGS_POST);
    // Calculate min/max for deathyear peers
    const deathYearRank = person.deathyear_rank_unique;
    const deathYearRankLow = person.deathyear_rank_unique ? Math.max(1, parseInt(person.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE) : "9999";
    const deathYearRankHigh = person.deathyear_rank_unique ? Math.max(NUM_RANKINGS, parseInt(person.deathyear_rank_unique, 10) + NUM_RANKINGS_POST) : "9999";
    // postgrest API will break if given NULLs, and since NULLs can be expected
    // we need to give a fallback numeric value here
    const deathyearId = person.deathyear || "9999";
    const deathyearRankUnique = person.deathyear_rank_unique || "9999";
    // Calculate min/max for birth country peers
    const bplaceCountryRank = person.bplace_country_rank;
    const bplaceCountryRankPrev = person.bplace_country_rank_prev;
    const bplaceCountryRankLow = person.bplace_country_rank_unique ? Math.max(1, parseInt(person.bplace_country_rank_unique, 10) - NUM_RANKINGS_PRE) : "9999";
    const bplaceCountryRankHigh = person.bplace_country_rank_unique ? Math.max(NUM_RANKINGS, parseInt(person.bplace_country_rank_unique, 10) + NUM_RANKINGS_POST) : "9999";
    // ensure birthcountry is non NULL
    const bplaceCountry = person.bplace_country || "";
    //
    const bplaceCountryOccupationRank = person.bplace_country_occupation_rank_unique;
    const bplaceCountryOccupationRankLow = person.bplace_country_occupation_rank_unique ? Math.max(1, parseInt(person.bplace_country_occupation_rank_unique, 10) - NUM_RANKINGS_PRE) : "9999";
    const bplaceCountryOccupationRankHigh = person.bplace_country_occupation_rank_unique ? Math.max(NUM_RANKINGS, parseInt(person.bplace_country_occupation_rank_unique, 10) + NUM_RANKINGS_POST) : "9999";
    return {occupationRank, occupationRankLow, occupationRankHigh, occupationRankPrev,
      birthYearRank, birthYearRankLow, birthYearRankHigh,
      deathYearRank, deathyearRankUnique, deathyearId, deathYearRankLow, deathYearRankHigh,
      bplaceCountry, bplaceCountryRank, bplaceCountryRankLow, bplaceCountryRankHigh, bplaceCountryRankPrev,
      bplaceCountryOccupationRank, bplaceCountryOccupationRankLow, bplaceCountryOccupationRankHigh};
  }),
  fetchData("person", personURL, res => {
    const person = res[0];
    const wikiSlug = person.name.replace(/ /g, "_");
    return {...person, wikiSlug};
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
  fetchData("birthCountryOccupationRanks", birthCountryOccupationRanksURL, res => res),
  fetchData("wikiExtract", wikiURL),
  fetchData("wikiPageViews", wikiPageViewsURL),
  fetchData("wikiSummary", wikiSummaryURL),
  // fetchData("wikiPageViewsPast30Days", wikiTrendingURL),
  fetchData("wikiRelated", wikiRelatedURL),
  fetchData("newsArticles", newsArticlesURL)
// //   fetchCreationdates
];

// function mapStateToProps(state && state) {
//   return && return {
//     personProfile: state.personProfile
//   };
// }
//
// export default connect(mapStateToProps)(Person);

export default connect(state => ({
  data: state.data,
  env: state.env,
  location: state.location
}), {})(hot(Person));
