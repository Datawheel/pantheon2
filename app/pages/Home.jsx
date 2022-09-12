import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchData } from "@datawheel/canon-core";
import HomeGrid from "pages/HomeGrid";
import axios from "axios";
import { Link } from "react-router";
import Spinner from "components/Spinner";
import api from "apiConfig";
import { plural } from "pluralize";
import Select from "pages/profile/common/Select";
import "pages/Home.css";

const getUrlParameter = (qStr, name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(qStr);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
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
      fetchedTrendingBiosACTOR: null,
      loadingTrendingBiosACTOR: false,
      trendingLangEditionACTOR: "en",
      fetchedTrendingBiosSOCCER: null,
      loadingTrendingBiosSOCCER: false,
      trendingLangEditionSOCCER: "en",
      fetchedTrendingBiosSINGER: null,
      loadingTrendingBiosSINGER: false,
      trendingLangEditionSINGER: "en",
      trendingLangEdition:
        [
          "ar",
          "zh",
          "nl",
          "en",
          "fr",
          "de",
          "it",
          "ja",
          "pl",
          "pt",
          "ru",
          "es",
        ].indexOf(trendingLang) !== -1
          ? trendingLang
          : "en",
    };
  }

  componentDidMount() {
    const { fetchedTrendingBios, loadingTrendingBios, trendingLangEdition } =
      this.state;
    if (
      fetchedTrendingBios === null &&
      !loadingTrendingBios &&
      trendingLangEdition !== "en"
    ) {
      this.changeTrendingLang(trendingLangEdition);
    }
  }

  activateSearch = (e) => false;

  changeTrendingLang = (evtOrLang) => {
    const trendingLangEdition = evtOrLang.target
      ? evtOrLang.target.value
      : evtOrLang;
    this.setState({ trendingLangEdition, loadingTrendingBios: true });
    axios
      .get(`/api/wikiTrends?lang=${trendingLangEdition}`)
      .then((trendsResults) => {
        this.context.router.replace(`?tlang=${trendingLangEdition}`);
        this.setState({
          fetchedTrendingBios: trendsResults.data,
          loadingTrendingBios: false,
        });
      });
  };

  handleLangChange = (occupation) => (evt) => {
    const selectedTrendingLang = evt.target.value;
    this.setState({
      [`trendingLangEdition${occupation.split(" ")[0]}`]: selectedTrendingLang,
      [`loadingTrendingBios${occupation.split(" ")[0]}`]: true,
    });
    axios
      .get(
        `/api/wikiTrends?lang=${selectedTrendingLang}&occupation=${occupation}`
      )
      .then((trendsResults) => {
        this.setState({
          [`fetchedTrendingBios${occupation.split(" ")[0]}`]:
            trendsResults.data,
          [`loadingTrendingBios${occupation.split(" ")[0]}`]: false,
        });
      });
  };

  changeCountry = (evtOrCountry) => {
    const { env } = this.props;
    const requestedCountry = evtOrCountry.target
      ? evtOrCountry.target.value
      : evtOrCountry.country;
    const requestedCountryCode = evtOrCountry.target
      ? evtOrCountry.target[evtOrCountry.target.selectedIndex].dataset
          .countrycode
      : evtOrCountry.countrycode;
    this.setState({
      activeCountry: requestedCountry,
      activeCountryCode: requestedCountryCode,
      loadingCountryBios: true,
    });
    const countryFilter =
      requestedCountry === "all"
        ? ""
        : `&bplace_country=eq.${requestedCountry}`;
    api(env)
      .get(
        `/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=12${countryFilter}`
      )
      .then((countryBiosRes) => {
        // this.context.router.replace(`?tlang=${trendingLangEdition}`);
        this.setState({
          fetchedCountryBios: countryBiosRes.data,
          loadingCountryBios: false,
        });
      });
  };

  changeOccupation = (evtOrOccupation) => {
    const { env } = this.props;
    const requestedOccupation = evtOrOccupation.target
      ? evtOrOccupation.target.value
      : evtOrOccupation;
    this.setState({
      activeOccupation: requestedOccupation,
      loadingOccupationBios: true,
    });
    const occupationFilter =
      requestedOccupation === "all"
        ? "&offset=16"
        : `&occupation=eq.${requestedOccupation}`;
    api(env)
      .get(
        `/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=12${occupationFilter}`
      )
      .then((occupationBiosRes) => {
        // this.context.router.replace(`?tlang=${trendingLangEdition}`);
        this.setState({
          fetchedOccupationBios: occupationBiosRes.data,
          loadingOccupationBios: false,
        });
      });
  };

  setRandom = (countryOrOccupation) => {
    const { countryList, occupationList } = this.props;
    if (countryOrOccupation === "country") {
      const randomCountry =
        countryList[Math.floor(Math.random() * countryList.length)];
      this.changeCountry({
        country: randomCountry.country,
        countrycode: randomCountry.country_code,
      });
    }
    if (countryOrOccupation === "occupation") {
      const randomOccupation =
        occupationList[Math.floor(Math.random() * occupationList.length)];
      this.changeOccupation(randomOccupation.occupation);
    }
  };

  render() {
    const { activateSearch } = this.context;
    const {
      trendingBios,
      trendingBiosActor,
      trendingBiosSoccer,
      trendingBiosSinger,
    } = this.props;
    const {
      fetchedTrendingBios,
      loadingTrendingBios,
      trendingLangEdition,
      trendingLangEditionACTOR,
      fetchedTrendingBiosACTOR,
      loadingTrendingBiosACTOR,
      trendingLangEditionSOCCER,
      fetchedTrendingBiosSOCCER,
      loadingTrendingBiosSOCCER,
      trendingLangEditionSINGER,
      fetchedTrendingBiosSINGER,
      loadingTrendingBiosSINGER,
    } = this.state;
    const trendingBiosForGrid = fetchedTrendingBios || trendingBios;
    const trendingBiosActorForGrid =
      fetchedTrendingBiosACTOR || trendingBiosActor;
    const trendingBiosSoccerForGrid =
      fetchedTrendingBiosSOCCER || trendingBiosSoccer;
    const trendingBiosSingerForGrid =
      fetchedTrendingBiosSINGER || trendingBiosSinger;

    return (
      <div className="home-container">
        <img className="bg-design" src="/images/home/printing.png" />
        <img className="bg-design bg-design-r" src="/images/home/film.png" />

        <div className="home-head-container">
          <div className="home-head">
            <div className="home-head-title">
              <h1>
                <img src="/images/logos/logo_pantheon.svg" alt="Pantheon" />
              </h1>
              <div className="home-search">
                <img src="/images/icons/icon-search.svg" alt="Search" />
                <a href="#" onClick={activateSearch}>
                  Search people, places, &amp; occupations
                </a>
              </div>
            </div>
            <div className="home-head-content">
              {/* <p><strong>Pantheon</strong> is an observatory of human collective memory. With data on more than 85,000 biographies, Pantheon helps you explore the geography and dynamics of the most memorable people in our planet&apos;s history.</p>
              <h2 className="home-explore-links">Explore <Link to="/profile/person">People</Link>, <Link to="/profile/place">Places</Link>, <Link to="/profile/occupation">Occupations</Link>, and <Link to="/profile/era">Eras</Link></h2> */}
              <h2>Explore human collective memory!</h2>
              <p>
                Pantheon helps you discover the geography and dynamics of our
                planet's history.
              </p>
              <h3 className="home-explore-links">
                Explore <Link to="/profile/person">People</Link>,{" "}
                <Link to="/profile/place">Places</Link>,{" "}
                <Link to="/profile/occupation">Occupations</Link>, and{" "}
                <Link to="/profile/era">Eras</Link>
              </h3>
            </div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">Trending Profiles Today</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">
                Top profiles by pageviews for the{" "}
              </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.changeTrendingLang}
                value={trendingLangEdition}
              >
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
              </Select>
              <span className="grid-select-label"> wikipedia edition</span>
            </p>
          </div>
          {!loadingTrendingBios ? (
            <HomeGrid
              bios={trendingBiosForGrid
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 12)}
            />
          ) : (
            <div className="loading-trends">
              <Spinner />
            </div>
          )}
        </div>

        <div className="profile-grid">
          <p className="post">
            <strong>Pantheon</strong> is an observatory of collective memory
            focused on biographies with a presence in at least{" "}
            <strong>15 languages</strong> in Wikipedia. We have data on more
            than 85,000 biographies, organized by countries, cities,
            occupations, and eras. Explore this data to learn about the
            characters that shape human culture. <strong>Pantheon</strong> began
            as a project at the Collective Learning group at MIT. Today it is
            developed by{" "}
            <a
              href="https://datawheel.us/"
              target="_blank"
              rel="noopener noreferrer"
              className="item-link feedback-link"
            >
              Datawheel
            </a>
            , a company specialized in the creation of data distribution and
            visualization solutions.
          </p>
        </div>

        <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">Trending Actors Today</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">
                Top actors by pageviews for the{" "}
              </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.handleLangChange("ACTOR")}
                value={trendingLangEditionACTOR}
              >
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
              </Select>
              <span className="grid-select-label"> wikipedia edition</span>
            </p>
          </div>
          {!loadingTrendingBiosACTOR ? (
            <HomeGrid
              bios={trendingBiosActorForGrid
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 12)}
            />
          ) : (
            <div className="loading-trends">
              <Spinner />
            </div>
          )}
        </div>

        <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">Trending Soccer Players Today</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">
                Top soccer players by pageviews for the{" "}
              </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.handleLangChange("SOCCER PLAYER")}
                value={trendingLangEditionSOCCER}
              >
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
              </Select>
              <span className="grid-select-label"> wikipedia edition</span>
            </p>
          </div>
          {!loadingTrendingBiosSOCCER ? (
            <HomeGrid
              bios={trendingBiosSoccerForGrid
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 12)}
            />
          ) : (
            <div className="loading-trends">
              <Spinner />
            </div>
          )}
        </div>

        <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">Trending Singers Today</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">
                Top singers by pageviews for the{" "}
              </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.handleLangChange("SINGER")}
                value={trendingLangEditionSINGER}
              >
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
              </Select>
              <span className="grid-select-label"> wikipedia edition</span>
            </p>
          </div>
          {!loadingTrendingBiosSINGER ? (
            <HomeGrid
              bios={trendingBiosSingerForGrid
                .sort((a, b) => a.rank - b.rank)
                .slice(0, 12)}
            />
          ) : (
            <div className="loading-trends">
              <Spinner />
            </div>
          )}
        </div>

        {/* <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">New Profiles By Country</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">Most recent profiles added from </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.changeCountry}
                value={activeCountry}
              >
                <option value="all">all countries</option>
                {countryList.map(country =>
                  <option key={country.country} value={country.country} data-countrycode={country.country_code}>{country.country}</option>
                )}
              </Select>
              <a className="shuffle" href="#" onClick={e => (e.preventDefault(), this.setRandom("country"))}><img src="/images/icons/icon-shuffle.svg" alt="Random" /></a>
            </p>
          </div>
          {!loadingCountryBios
            ? <HomeGrid bios={countryBiosForGrid} />
            : <div className="loading-trends"><Spinner /></div>}
          <div className="view-more">
            <a href={activeCountry === "all" ? "/explore/rankings?show=people&years=-3501,2022&new=true" : `/explore/rankings?show=people&years=-3501,2022&place=${activeCountryCode}&new=true`}>{activeCountry === "all" ? "View all new profiles »" : `View all new profiles from ${activeCountry} »`}</a>
          </div>
        </div>

        <div className="profile-grid">
          <div className="grid-title-container">
            <h3 className="grid-title">New Profiles By Occupation</h3>
            <p className="grid-subtitle">
              <span className="grid-select-label">Most recent profiles added of </span>
              <Select
                label=""
                className="home-select"
                fontSize="sm"
                onChange={this.changeOccupation}
                value={activeOccupation}
              >
                <option value="all">all occupations</option>
                {occupationList.map(occupation =>
                  <option key={occupation.occupation} value={occupation.occupation}>{plural(occupation.occupation.toLowerCase())}</option>
                )}
              </Select>
              <a className="shuffle" href="#" onClick={e => (e.preventDefault(), this.setRandom("occupation"))}><img src="/images/icons/icon-shuffle.svg" alt="Random" /></a>
            </p>
          </div>
          {!loadingOccupationBios
            ? <HomeGrid bios={occupationBiosForGrid} />
            : <div className="loading-trends"><Spinner /></div>}
          <div className="view-more">
            <a href={activeOccupation === "all" ? "/explore/rankings?show=people&years=-3501,2022&new=true" : `/explore/rankings?show=people&years=-3501,2022&occupation=${activeOccupation}&new=true`}>{activeOccupation === "all" ? "View all new profiles »" : `View all new profiles of ${plural(activeOccupation.toLowerCase())} »`}</a>
          </div>
        </div> */}

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

Home.preneed = [
  fetchData(
    "trendingBios",
    "https://pantheon.world/api/wikiTrends?lang=en&limit=12"
  ),
];

Home.need = [
  // fetchData("countryList", "/country?select=country,country_code&num_born=gte.100&order=country", {format: res => res, useParams: false}),
  // fetchData("occupationList", "/occupation?select=occupation&order=occupation", {format: res => res, useParams: false}),
  // fetchData("countryBios", "/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=12", {format: res => res, useParams: false}),
  // fetchData("occupationBios", "/person?hpi_prev=is.null&order=hpi.desc.nullslast&select=name,slug,id,hpi&order=hpi.desc&limit=16&offset=12", {format: res => res, useParams: false}),
  fetchData(
    "trendingBiosActor",
    "https://pantheon.world/api/wikiTrends?lang=en&limit=12&occupation=ACTOR"
  ),
  fetchData(
    "trendingBiosSoccer",
    "https://pantheon.world/api/wikiTrends?lang=en&limit=12&occupation=SOCCER+PLAYER"
  ),
  fetchData(
    "trendingBiosSinger",
    "https://pantheon.world/api/wikiTrends?lang=en&limit=12&occupation=SINGER"
  ),
];

Home.contextTypes = {
  activateSearch: PropTypes.func,
  router: PropTypes.object,
};

export default connect((state) => ({
  env: state.env,
  // countryBios: state.data.countryBios,
  // countryList: state.data.countryList,
  // occupationBios: state.data.occupationBios,
  // occupationList: state.data.occupationList,
  trendingBios: state.data.trendingBios,
  trendingBiosActor: state.data.trendingBiosActor,
  trendingBiosSoccer: state.data.trendingBiosSoccer,
  trendingBiosSinger: state.data.trendingBiosSinger,
}))(Home);
