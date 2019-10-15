import React, {Component} from "react";
import {connect} from "react-redux";
import YearControl from "pages/explore/controls/YearControl";
import PlaceControl from "pages/explore/controls/PlaceControl";
import OccupationControl from "pages/explore/controls/OccupationControl";
import ShowControl from "pages/explore/controls/ShowControl";
import VizControl from "pages/explore/controls/VizControl";
import AdvancedControl from "pages/explore/controls/AdvancedControl";
import GenderControl from "pages/explore/controls/GenderControl";
import fetchPantheonData from "pages/explore/helpers/fetchPantheonData";
import {SANITIZERS} from "types";

const countryCandidates = ["usa", "gbr", "fra", "deu", "ita", "jpn", "rus", "esp", "bra", "swe", "pol", "chn", "nld", "tur", "ind", "can", "aut", "ukr", "grc", "arg", "bel", "dnk", "aus", "che", "nor", "hun", "egy", "rou", "hrv", "irn", "prt", "irl", "fin", "mex", "srb", "isr", "irq", "bgr", "zaf", "ury", "svk", "blr", "geo", "col", "svn", "est", "sau", "bih", "ltu", "cze", "lva", "chl", "nzl", "nga", "cub", "kaz", "dza", "pak", "syr", "per", "kor", "isl", "tun", "mar", "aze", "jam", "pry", "ven"];

class Controls extends Component {

  constructor(props) {
    super(props);
    const {qParams} = props;
    this.state = {
      city: SANITIZERS.city(qParams.place) || "all",
      country: SANITIZERS.country(qParams.place) || countryCandidates[Math.floor(Math.random() * countryCandidates.length)],
      gender: SANITIZERS.gender(qParams.gender),
      occupation: qParams.occupation || "all",
      placeType: SANITIZERS.placeType(qParams.placeType),
      show: SANITIZERS.show(qParams.show ? qParams.show : props.pageType === "viz" ? "occupations" : "people", props.pageType),
      viz: props.pageType === "viz" ? SANITIZERS.vizType(qParams.viz || "Treemap") : null,
      years: SANITIZERS.years(qParams.years),
      yearType: SANITIZERS.yearType(qParams.yearType),
      metricCutoff: qParams.metricCutoff || "4",
      metricType: qParams.metricType || "hpi"
    };
  }

  componentDidMount() {
    this.props.updateData(Object.assign({data: [], loading: true}, this.state));
    const {countryLookup, pageType, updateData} = this.props;
    fetchPantheonData(pageType, countryLookup, this.state, updateData);
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageType !== prevProps.pageType) {
      console.log("CONTROL SHOULD UPDATE!");
      // this.props.updateData(Object.assign({data: [], loading: true}, this.state));

      // this.props.updateData(Object.assign({data: [], loading: true}, this.state), this.fetchData);
      // this.fetchData();
      // console.log("controls componentDidUpdate!", this.props);
    }
  }

  toggleSidePanel = e => {
    e.preventDefault();
    document.getElementById("side-panel").classList.toggle("mobile-show");
    const evt = window.document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }

  setQueryParams = () => {
    const {pageType} = this.props;
    const {city, country, gender, metricType, metricCutoff, occupation, show, viz, years, yearType, placeType} = this.state;

    let queryStr = pageType === "viz" ? `?viz=${viz}&show=${show}&years=${years}` : `?show=${show}&years=${years}`;
    if (country !== "all") {
      queryStr += `&place=${country.toLowerCase()}`;
      if (city !== "all") {
        queryStr += `|${city}`;
      }
    }
    if (occupation !== "all") {
      queryStr += `&occupation=${occupation}`;
    }
    if (yearType !== "birthyear") {
      queryStr += `&yearType=${yearType}`;
    }
    if (placeType !== "birthplace") {
      queryStr += `&placeType=${placeType}`;
    }
    if (`${gender}`.toUpperCase() === "M" || `${gender}`.toUpperCase() === "F") {
      queryStr += `&gender=${gender.toUpperCase()}`;
    }
    if (!(metricType === "hpi" && `${metricCutoff}` === "4")) {
      queryStr += `&${metricType}=gte.${metricCutoff}`;
    }
    if (typeof history !== "undefined" && history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryStr}`;
      window.history.pushState({path: newurl}, "", newurl);
    }
  }

  updateAndFetchData = (key, val) => {
    const {countryLookup, pageType, updateData} = this.props;
    this.setState({[key]: val}, () => {
      this.setQueryParams();
      fetchPantheonData(pageType, countryLookup, this.state, updateData);
    });
  }

  updateManyAndFetchData = newState => {
    const {countryLookup, pageType, updateData} = this.props;
    this.setState(newState, () => {
      this.setQueryParams();
      fetchPantheonData(pageType, countryLookup, this.state, updateData);
    });
  }

  update = (key, val) => {
    const {countryLookup, pathname, pageType, updateData} = this.props;
    this.setState({[key]: val}, () => {
      this.setQueryParams();
      if (pathname.includes("explore/rankings")) {
        this.props.update({[key]: val, loading: true, data: []});
        fetchPantheonData(pageType, countryLookup, this.state, updateData);
      }
      else {
        this.props.update({[key]: val});
      }
    });
  }

  render() {
    const {city, country, gender, metricCutoff, metricType, occupation, placeType, show, viz, years, yearType} = this.state;
    const {pageType, nestedOccupations, places} = this.props;

    return (
      <div className="explore-controls viz-explorer" id="side-panel">
        {/* desktop title*/}
        <div className="control-header desktop">
          <h2 className="viz-explorer">Visualizations</h2>
        </div>
        {/* mobile toggle */}
        <button className="control-header mobile" onClick={this.toggleSidePanel}>
          <h2 className="viz-explorer"><span className="helper-text">Open </span>{pageType === "rankings" ? "Rankings" : "Visualizations"}<span className="helper-text"> Panel</span></h2>
          <i className="control-icon" />
        </button>

        <section className="control-group main-selector">
          {pageType === "viz"
            ? <VizControl viz={viz} changeViz={this.update} />
            : null}
          <ShowControl page={pageType} show={show} update={this.update} updateManyAndFetchData={this.updateManyAndFetchData} />
        </section>

        <section className="control-group">
          <GenderControl gender={gender} changeGender={this.updateAndFetchData} />
          <YearControl years={years} changeYears={this.updateAndFetchData} yearType={yearType} />
          {places ? <PlaceControl city={city} country={country} onChange={this.updateAndFetchData} places={places} placeType={placeType} /> : null}
          <OccupationControl nestedOccupations={nestedOccupations} occupation={occupation} changeOccupation={this.updateAndFetchData} />
        </section>

        <section className="control-group advanced-group">
          <h3>Advanced Options</h3>
          <AdvancedControl metricType={metricType} metricCutoff={metricCutoff} changeMetric={this.updateAndFetchData} />
        </section>

        {/* TODO: add sharing and uncomment */}
        {/*  <section className="control-group flat-group share-group">
          <h3>Share</h3>
          <ul className="items flat-options">
            <li><Link to="#" className="em"><img src="/images/icons/icon-email.svg" alt="Email this visualization"/></Link></li>
            <li><Link to="#" className="fb"><img src="/images/icons/icon-facebook.svg" alt="Share this visualization on Facebook"/></Link></li>
            <li><Link to="#" className="tw"><img src="/images/icons/icon-twitter.svg" alt="Share this visualization on Twitter"/></Link></li>
          </ul>
        </section>*/}

      </div>
    );
  }
}


const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(Controls);
