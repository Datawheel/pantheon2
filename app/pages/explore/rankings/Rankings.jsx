import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import Controls from "pages/explore/controls/Index";
import VizShell from "pages/explore/viz/VizShell";
import RankingTable from "pages/explore/rankings/RankingTable";
import {nest} from "d3-collection";
import {merge} from "d3-array";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
import {animateScroll as scroll} from "react-scroll";
import {plural} from "pluralize";
import "pages/explore/Explore.css";

const VizTitle = ({city, country, gender, loading, nestedOccupations, places, occupation, show, yearType}) => {
  let occupationSubject = "";
  let fromLocation = "";
  let thisOcc;
  let genderedPronoun = "people";

  // Gender ---
  if (gender === true || gender === false) {
    genderedPronoun = gender === true ? "men" : "women";
  }

  // Occupations ---
  if (occupation === "all") {
    occupationSubject = genderedPronoun;
  }
  else if (nestedOccupations) {
    if (occupation.includes(",")) {
      thisOcc = nestedOccupations.map(no => no.domain).find(no => no.id === occupation).name;
      occupationSubject = `${genderedPronoun} in ${thisOcc} occupations`;
    }
    else {
      const gendersLookup = {people: "", men: "male", women: "female"};
      thisOcc = merge(nestedOccupations.map(no => no.occupations)).find(no => `${no.id}` === occupation).occupation;
      occupationSubject = `${gendersLookup[genderedPronoun]} ${plural(thisOcc)}`;
    }
  }

  // Locations ---
  if (country !== "all" && places) {
    const countryObj = places.map(p => p.country).find(c => `${c.id}` === country);
    if (city !== "all") {
      const cityObj = merge(places.map(p => p.cities)).find(c => `${c.id}` === city);
      fromLocation = ` from ${cityObj.name}, ${countryObj.country_name}`;
    }
    else {
      fromLocation = ` from ${countryObj.country_name}`;
    }
  }

  const verb = yearType === "birthyear" ? "were" : "did";
  const predicate = yearType === "birthyear" ? "born" : "die";

  const title = show === "occupations"
    ? `What occupations were held by memorable ${occupationSubject}${fromLocation}?`
    : `Where ${verb} memorable ${occupationSubject}${fromLocation} ${predicate}?`;

  return !loading
    ? <h1 className="explore-title">
      {title}
    </h1>
    : null;
};

class Ranking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      viz: "treemap",
      city: "all",
      country: "all",
      filteredData: [],
      gender: null,
      nestedOccupations: null,
      occupation: "all",
      occupations: null,
      page: 0,
      pageSize: 50,
      places: null,
      searching: false,
      show: "occupations",
      years: [],
      yearType: "birthyear"
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      // this.fetchData(this.props.userID);
      // console.log("should update!!!");
      // this.setState({data: [], loading: true, filteredData: []});
    }
  }

  updateData = (updatedState, callback) => {
    if (callback) {
      this.setState(updatedState, callback);
    }
    else {
      this.setState(updatedState);
    }
  }
  update = newState => {
    this.setState(Object.assign({}, this.state, newState, {page: 0}));
  }
  search = term => {
    const {data, show} = this.state;
    this.setState({
      searching: true,
      filteredData: data.filter(d => d.name.toLowerCase().includes(term))
    });
  }


  render() {
    const {pageType} = this.props.route;
    const {places, occupationResponse} = this.props.data;
    const {query: qParams, pathname} = this.props.location;
    const {city, country, data, filteredData, gender, metricCutoff, metricType, loading, occupation, page, pageSize, searching, show, viz, years, yearType} = this.state;

    if (!occupationResponse) {
      return <div>loading...</div>;
    }

    const {nestedOccupations, occupations} = occupationResponse;

    const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    let metricSentence;
    if (metricCutoff > metricRange[0]) {
      if (metricType === "hpi") {
        metricSentence = `Showing people with a Historical Popularity Index (HPI) greater than ${metricCutoff}.`;
      }
      else {
        metricSentence = `Showing people with more than ${metricCutoff} Wikipedia language editions.`;
      }
    }

    return (
      <div className="explore">
        <Helmet title="Viz Explorer" />
        <div className="explore-head">
          <VizTitle
            city={city}
            country={country}
            gender={gender}
            loading={loading}
            nestedOccupations={nestedOccupations}
            occupation={occupation}
            places={places}
            show={show}
            yearType={yearType}
          />
          {years.length
            ? <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
            : null}
          {metricSentence ? <p>{metricSentence}</p> : null}
        </div>
        <div className="explore-body">
          <Controls
            updateData={this.updateData}
            update={this.update}
            nestedOccupations={nestedOccupations}
            pageType={pageType}
            places={places}
            pathname={pathname}
            qParams={qParams}
          />
          <RankingTable
            data={searching ? filteredData : data}
            changePageSize={this.update}
            loading={loading}
            occupations={occupations}
            places={places}
            page={page}
            pageSize={pageSize}
            onPageChange={page => {
              scroll.scrollToTop();
              this.setState({page});
            }}
            search={this.search}
            show={show}
            viz={viz}
            yearType={yearType}
          />
        </div>
      </div>
    );
  }
}

Ranking.need = [
  fetchData("places", "/place", res => {
    const countries = res.filter(d => d.is_country).reduce((obj, item) =>
      Object.assign(obj, {[item.country_code]: item}), {});
    const cities = res.filter(d => !d.is_country);
    const places = nest()
      .key(d => d.country_code)
      .entries(cities)
      .map(countryData => ({
        country: countries[countryData.values[0].country_code],
        cities: countryData.values
      }));
    return places;
  }),
  fetchData("occupationResponse", "/occupation", res => {
    const nestedOccupations = nest()
      .key(d => d.domain_slug)
      .entries(res)
      .map(occData => ({
        domain: {
          id: `${occData.values.map(o => o.id)}`,
          slug: occData.values[0].domain_slug,
          name: occData.values[0].domain
        },
        occupations: occData.values
      }));

    return {nestedOccupations, occupations: res};
  })
];

export default connect(state => ({data: state.data}), {})(Ranking);
