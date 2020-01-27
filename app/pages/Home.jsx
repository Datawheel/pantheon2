import React, {Component} from "react";
import {connect} from "react-redux";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import {fetchData} from "@datawheel/canon-core";
import HomeGrid from "pages/HomeGrid";
import axios from "axios";
import {Link} from "react-router";
import "pages/Home.css";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      fetchedBios: null,
      loading: false,
      trendingLangEdition: "en"
    };
  }

  activateSearch = e => false

  changeTrendingLang = e => {
    const trendingLangEdition = e.target.value;
    this.setState({trendingLangEdition, loading: true});
    axios.get(`/api/wikiTrends?lang=${trendingLangEdition}`).then(trendsResults => {
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
              <p><strong>Pantheon</strong> is an observatory of human collective memory. With data on more than 70,000 biographies, Pantheon helps you explore the geography and dynamics of the most memorable people in our planet&apos;s history.</p>
            </div>
            <h2 className="home-explore-links">Explore <Link to="/profile/person">People</Link>, <Link to="/profile/place">Places</Link>, <Link to="/profile/occupation">Occupations</Link>, and <Link to="/profile/era">Eras</Link></h2>
          </div>
        </div>

        <HomeGrid bios={biosForGrid} loading={loading} trendingLangEdition={trendingLangEdition} changeTrendingLang={this.changeTrendingLang} />

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
  activateSearch: PropTypes.func
};

export default hot(
  connect(state => ({
    trendingBios: state.data.trendingBios
  }))(Home)
);
