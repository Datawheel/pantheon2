import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import {fetchData} from "@datawheel/canon-core";
import HomeGrid from "pages/HomeGrid";
import axios from "axios";
import {Link} from "react-router";
import Spinner from "components/Spinner";
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
      fetchedBios: null,
      loading: false,
      trendingLangEdition: ["ar", "zh", "nl", "en", "fr", "de", "it", "ja", "pl", "pt", "ru", "es"].indexOf(trendingLang) !== -1 ? trendingLang : "en"
    };
  }

  componentDidMount() {
    const {fetchedBios, loading, trendingLangEdition} = this.state;
    if (fetchedBios === null && !loading && trendingLangEdition !== "en") {
      this.changeTrendingLang(trendingLangEdition);
    }
  }

  activateSearch = e => false

  changeTrendingLang = evtOrLang => {
    const trendingLangEdition = evtOrLang.target ? evtOrLang.target.value : evtOrLang;
    this.setState({trendingLangEdition, loading: true});
    axios.get(`/api/wikiTrends?lang=${trendingLangEdition}`).then(trendsResults => {
      this.context.router.replace(`?tlang=${trendingLangEdition}`);
      this.setState({fetchedBios: trendsResults.data, loading: false});
    });
  }

  render() {
    const {activateSearch} = this.context;
    const {trendingBios} = this.props;
    const {fetchedBios, loading, trendingLangEdition} = this.state;
    const biosForGrid = fetchedBios || trendingBios;

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
          {!loading
            ? <HomeGrid bios={biosForGrid} />
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
  fetchData("trendingBios", "https://pantheon.world/api/wikiTrends?lang=en&limit=60")
];

Home.contextTypes = {
  activateSearch: PropTypes.func,
  router: PropTypes.object
};

export default hot(
  connect(state => ({
    trendingBios: state.data.trendingBios
  }))(Home)
);
