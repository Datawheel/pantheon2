import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import {fetchData} from "@datawheel/canon-core";
import HomeGrid from "pages/HomeGrid";
import axios from "axios";
import {Link} from "react-router";
import Spinner from "components/Spinner";
import api from "apiConfig";
import {plural} from "pluralize";
import "pages/Home.css";

const getUrlParameter = (qStr, name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(qStr);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

class Home extends Component {
  constructor(props) {
    super();
    const qParams = props.router.location.search;
    const trendingLang = getUrlParameter(qParams, "tlang");
    this.state = {
      activeCountry: "all",
      activeCountryCode: "all",
      activeOccupation: "all",
      fetchedTrendingBios: null,
      fetchedCountryBios: null,
      loadingTrendingBios: false,
      loadingCountryBios: false,
      loadingOccupationBios: false,
      trendingLangEdition: ["ar", "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"].indexOf(trendingLang) !== -1 ? trendingLang : "en"
    };
  }

  componentDidMount() {
    const {fetchedTrendingBios, loadingTrendingBios, trendingLangEdition} = this.state;
    if (fetchedTrendingBios === null && !loadingTrendingBios && trendingLangEdition !== "en") {
      this.changeTrendingLang(trendingLangEdition);
    }
  }

  activateSearch = e => false

  changeTrendingLang = evtOrLang => {
    const trendingLangEdition = evtOrLang.target ? evtOrLang.target.value : evtOrLang;
    this.setState({trendingLangEdition, loadingTrendingBios: true});
    axios.get(`/api/wikiTrends?lang=${trendingLangEdition}`).then(trendsResults => {
      this.context.router.replace(`?tlang=${trendingLangEdition}`);
      this.setState({fetchedTrendingBios: trendsResults.data, loadingTrendingBios: false});
    });
  }

  changeCountry = evtOrCountry => {
    const requestedCountry = evtOrCountry.target ? evtOrCountry.target.value : evtOrCountry;
    const requestedCountryCode = evtOrCountry.target ? evtOrCountry.target[evtOrCountry.target.selectedIndex].dataset.countrycode : evtOrCountry;
    this.setState({activeCountry: requestedCountry, activeCountryCode: requestedCountryCode, loadingCountryBios: true});
    const countryFilter = requestedCountry === "all" ? "" : `&bplace_country=eq.${requestedCountry}`;
    api.get(`/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=16${countryFilter}`).then(countryBiosRes => {
      // this.context.router.replace(`?tlang=${trendingLangEdition}`);
      this.setState({fetchedCountryBios: countryBiosRes.data, loadingCountryBios: false});
    });
  }

  changeOccupation = evtOrOccupation => {
    const requestedOccupation = evtOrOccupation.target ? evtOrOccupation.target.value : evtOrOccupation;
    this.setState({activeOccupation: requestedOccupation, loadingOccupationBios: true});
    const occupationFilter = requestedOccupation === "all" ? "&offset=16" : `&occupation=eq.${requestedOccupation}`;
    api.get(`/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=16${occupationFilter}`).then(occupationBiosRes => {
      // this.context.router.replace(`?tlang=${trendingLangEdition}`);
      this.setState({fetchedOccupationBios: occupationBiosRes.data, loadingOccupationBios: false});
    });
  }

  render() {
    const {activateSearch} = this.context;
    const {countryList, countryBios, occupationBios, occupationList, trendingBios} = this.props;
    const {activeCountry, activeCountryCode, activeOccupation, fetchedTrendingBios, fetchedCountryBios, fetchedOccupationBios, loadingCountryBios, loadingOccupationBios, loadingTrendingBios, trendingLangEdition} = this.state;
    const trendingBiosForGrid = fetchedTrendingBios || trendingBios;
    const countryBiosForGrid = fetchedCountryBios || countryBios;
    const occupationBiosForGrid = fetchedOccupationBios || occupationBios;

    return (
      <div className="home-container">
        <div className="home-head">
          <h1><img src="/images/logos/logo_pantheon.svg" alt="Pantheon" /></h1>
          <div className="home-head-content">
            <div className="home-search">
              <img src="/images/icons/icon-search.svg" alt="Search" />
              <a href="#" onClick={activateSearch}>Search people, places, &amp; occupations</a>
            </div>
            <div className="post">
              <p><strong>Pantheon</strong> is an observatory of human collective memory. With data on more than 85,000 biographies, Pantheon helps you explore the geography and dynamics of the most memorable people in our planet&apos;s history.</p>
            </div>
            <h2 className="home-explore-links">Explore <Link to="/profile/person">People</Link>, <Link to="/profile/place">Places</Link>, <Link to="/profile/occupation">Occupations</Link>, and <Link to="/profile/era">Eras</Link></h2>
          </div>
        </div>

        <div className="profile-grid">
          <h3 className="grid-title">New Profiles By Country</h3>
          <p className="grid-subtitle">
            Most recent profiles added from&nbsp;
            <select onChange={this.changeCountry} value={activeCountry}>
              <option value="all">all countries</option>
              {countryList.map(country =>
                <option key={country.country} value={country.country} data-countrycode={country.country_code}>{country.country}</option>
              )}
            </select>
          </p>
          {!loadingCountryBios
            ? <HomeGrid bios={countryBiosForGrid} />
            : <div className="loading-trends"><Spinner /></div>}
          <div className="view-more">
            <a href={activeCountry === "all" ? "/explore/rankings?show=people&years=-3501,2020&new=true" : `/explore/rankings?show=people&years=-3501,2020&place=${activeCountryCode}&new=true`}>{activeCountry === "all" ? "View all new profiles »" : `View all new profiles from ${activeCountry} »`}</a>
          </div>
        </div>

        <div className="profile-grid">
          <h3 className="grid-title">New Profiles By Occupation</h3>
          <p className="grid-subtitle">
            Most recent profiles added of&nbsp;
            <select onChange={this.changeOccupation} value={activeOccupation}>
              <option value="all">all occupations</option>
              {occupationList.map(occupation =>
                <option key={occupation.occupation} value={occupation.occupation}>{plural(occupation.occupation.toLowerCase())}</option>
              )}
            </select>
          </p>
          {!loadingOccupationBios
            ? <HomeGrid bios={occupationBiosForGrid} />
            : <div className="loading-trends"><Spinner /></div>}
          <div className="view-more">
            <a href={activeOccupation === "all" ? "/explore/rankings?show=people&years=-3501,2020&new=true" : `/explore/rankings?show=people&years=-3501,2020&occupation=${activeOccupation}&new=true`}>{activeOccupation === "all" ? "View all new profiles »" : `View all new profiles of ${plural(activeOccupation.toLowerCase())} »`}</a>
          </div>
        </div>

        <div className="profile-grid">
          <h3 className="grid-title">Trending Profiles Today</h3>
          <p className="grid-subtitle">
            Top profiles by pageviews for the&nbsp;
            <select onChange={this.changeTrendingLang} value={trendingLangEdition}>
              <option value="ar">Arabic</option>
              <option value="zh">Chinese</option>
              <option value="nl">Dutch</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="es">Spanish</option>
            </select>
            &nbsp;wikipedia edition
          </p>
          {!loadingTrendingBios
            ? <HomeGrid bios={trendingBiosForGrid.sort((a, b) => a.rank - b.rank)} />
            : <div className="loading-trends"><Spinner /></div>}
        </div>

        <div className="floating-content l-1">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>

        <div className="floating-content l-2">
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
          <div className="box"></div>
        </div>

      </div>
    );

  }
}

Home.need = [
  fetchData("countryList", "/country?select=country,country_code&num_born=gte.100&order=country", {format: res => res, useParams: false}),
  fetchData("occupationList", "/occupation?select=occupation&order=occupation", {format: res => res, useParams: false}),
  fetchData("countryBios", "/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=16", {format: res => res, useParams: false}),
  fetchData("occupationBios", "/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=16&offset=16", {format: res => res, useParams: false}),
  fetchData("trendingBios", "https://pantheon.world/api/wikiTrends?lang=en&limit=60")
];

Home.contextTypes = {
  activateSearch: PropTypes.func,
  router: PropTypes.object
};

export default hot(
  connect(state => ({
    countryBios: state.data.countryBios,
    countryList: state.data.countryList,
    occupationBios: state.data.occupationBios,
    occupationList: state.data.occupationList,
    trendingBios: state.data.trendingBios
  }))(Home)
);
