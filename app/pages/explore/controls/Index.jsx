import React, {Component} from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import api from "apiConfig";
import YearControl from "pages/explore/controls/YearControl";
import PlaceControl from "pages/explore/controls/PlaceControl";
import OccupationControl from "pages/explore/controls/OccupationControl";
import ShowControl from "pages/explore/controls/ShowControl";
import VizControl from "pages/explore/controls/VizControl";
import AdvancedControl from "pages/explore/controls/AdvancedControl";
import GenderControl from "pages/explore/controls/GenderControl";
import YearTypeControl from "pages/explore/controls/YearTypeControl";
import dataFormatter from "pages/explore/rankings/dataFormatter";
import {SANITIZERS} from "types";

class Controls extends Component {

  constructor(props) {
    super(props);
    const {query: qParams} = this.props.location;
    this.state = {
      city: SANITIZERS.city(qParams.place) || "all",
      country: SANITIZERS.country(qParams.place) || "all",
      gender: SANITIZERS.gender(qParams.viz),
      occupation: qParams.occupation || "all",
      show: SANITIZERS.show(qParams.show || "occupations", this.props.location.pathname),
      viz: SANITIZERS.vizType(qParams.viz || "Treemap"),
      years: SANITIZERS.years(qParams.years),
      yearType: SANITIZERS.yearType(qParams.yearType),
      metricCutoff: qParams.metricCutoff || "4",
      metricType: qParams.metricType || "hpi"
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  toggleSidePanel = e => {
    e.preventDefault();
    document.getElementById("side-panel").classList.toggle("mobile-show");
    const evt = window.document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
  }

  setQueryParams = () => {
    const {city, country, gender, metricType, metricCutoff, occupation, show, viz, years} = this.state;

    let queryStr = `?viz=${viz}&show=${show}&years=${years}`;
    if (country !== "all") {
      queryStr += `&place=${country}`;
      if (city !== "all") {
        queryStr += `|${city}`;
      }
    }
    if (occupation !== "all") {
      queryStr += `&occupation=${occupation}`;
    }
    if (gender === true || gender === false) {
      queryStr += `&gender=${gender}`;
    }
    if (!(metricType === "hpi" && `${metricCutoff}` === "4")) {
      queryStr += `&${metricType}=gte.${metricCutoff}`;
    }
    if (typeof history !== "undefined" && history.pushState) {
      const newurl = `${window.location.protocol}//${window.location.host}${window.location.pathname}${queryStr}`;
      window.history.pushState({path: newurl}, "", newurl);
    }
  }

  fetchData = () => {
    const {pathname} = this.props.location;
    const {city, country, gender, metricCutoff, metricType, occupation, show, viz, years, yearType} = this.state;
    const selectFields = "name,langs,hpi,id,slug,birthyear,deathyear,birthcountry{id,country_name,continent,slug},birthplace{id,name,country_name,continent,slug,lat_lon},deathplace{id,name,country_name,slug},occupation_id:occupation,occupation{id,occupation,occupation_slug}";
    const apiHeaders = null;

    let placeFilter = "";
    if (country !== "all") {
      placeFilter = `&birthcountry=eq.${country}`;
      if (city !== "all") {
        placeFilter = `&birthplace=eq.${city}`;
      }
    }

    let occupationFilter = "";
    if (occupation !== "all") {
      occupationFilter = `&occupation=in.${occupation}`;
    }

    let genderFilter = "";
    if (gender === true || gender === false) {
      genderFilter = `&gender=is.${gender}`;
    }

    let metricFilter = "";
    if (metricType) {
      metricFilter = `&${metricType}=gte.${metricCutoff}`;
    }

    const dataUrl = `/person?select=${selectFields}&${yearType}=gte.${years[0]}&${yearType}=lte.${years[1]}${placeFilter}${occupationFilter}${genderFilter}${metricFilter}`;
    console.log("getNewData", dataUrl);
    api.get(dataUrl, {headers: apiHeaders}).then(res => {
      const data = pathname.includes("explore/rankings") ? dataFormatter(res.data, show) : res.data;
      this.props.updateData(Object.assign({data, loading: false, show, viz}, this.state));
    });
  }

  updateAndFetchData = (key, val) => {
    this.setState({[key]: val}, () => {
      this.setQueryParams();
      this.fetchData();
    });
  }

  update = (key, val) => {
    const {pathname} = this.props.location;
    this.setState({[key]: val}, () => {
      this.setQueryParams();
      if (pathname.includes("explore/rankings")) {
        this.props.update({[key]: val, loading: true, data: []});
        this.fetchData();
      }
      else {
        this.props.update({[key]: val});
      }
    });
  }

  render() {
    const {city, country, gender, metricCutoff, metricType, occupation, pageType, show, viz, years, yearType} = this.state;
    const {location, nestedOccupations, places} = this.props;
    const {pathname} = location;

    return (
      <div className="explore-controls viz-explorer" id="side-panel">
        <div className="control-header">
          <h2 className="viz-explorer"><span className="helper-text">Open&nbsp;</span>{pageType === "rankings" ? "Rankings" : "Visualizations"}<span className="helper-text">&nbsp;Panel</span></h2>
          <i className="control-toggle" onClick={this.toggleSidePanel}></i>
        </div>

        <section className="control-group main-selector">
          {pageType === "viz"
            ? <VizControl viz={viz} changeViz={this.update} />
            : null}
          <ShowControl page={pathname.includes("explore/rankings") ? "rankings" : "viz"} show={show} changeShow={this.update} />
        </section>

        <section className="control-group">
          <GenderControl gender={gender} changeGender={this.updateAndFetchData} />
          <YearTypeControl yearType={yearType} changeYearType={this.updateAndFetchData} />
          <YearControl years={years} changeYears={this.updateAndFetchData} />
          {places ? <PlaceControl city={city} country={country} onChange={this.updateAndFetchData} places={places} /> : null}
          <OccupationControl nestedOccupations={nestedOccupations} occupation={occupation} changeOccupation={this.updateAndFetchData} />
        </section>

        <section className="control-group advanced-group">
          <h3>Advanced Options</h3>
          <AdvancedControl metricType={metricType} metricCutoff={metricCutoff} changeMetric={this.updateAndFetchData} />
        </section>

        <section className="control-group flat-group share-group">
          <h3>Share</h3>
          <ul className="items flat-options">
            <li><Link to="#" className="em"><img src="/images/icons/icon-email.svg" alt="Email this visualization"/></Link></li>
            <li><Link to="#" className="fb"><img src="/images/icons/icon-facebook.svg" alt="Share this visualization on Facebook"/></Link></li>
            <li><Link to="#" className="tw"><img src="/images/icons/icon-twitter.svg" alt="Share this visualization on Twitter"/></Link></li>
          </ul>
        </section>

      </div>
    );
  }
}


const mapStateToProps = state => ({
  location: state.location
});

export default connect(mapStateToProps)(Controls);
