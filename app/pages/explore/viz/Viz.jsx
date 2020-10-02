import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import Controls from "pages/explore/controls/Index";
import VizShell from "pages/explore/viz/VizShell";
import VizTitle from "pages/explore/viz/VizTitle";
import {nest} from "d3-collection";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
import "pages/explore/Explore.css";

class Viz extends Component {

  constructor(props) {
    super(props);
    this.countryLookup = this.props.data.places.reduce((acc, cur) => ({...acc, [cur.country.country_code]: cur.country}), {});
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
      pageSize: 50,
      places: null,
      searching: false,
      show: "occupations",
      years: [],
      yearType: "birthyear"
    };
  }

  // UNSAFE_componentWillMount() {
  //   console.log("UNSAFE_componentWillMount porps", this.props);
  // }

  componentDidUpdate(prevProps) {
    // console.log("prevProps", prevProps);
    // console.log("this.props", this.props);
    // Typical usage (don't forget to compare props):
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
    this.setState(Object.assign({}, this.state, newState));
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
    const {city, country, data, filteredData, gender, metricCutoff, metricType, loading, occupation, pageSize, searching, show, viz, years, yearType, placeType} = this.state;

    // if (this.props.router.location.search === "" && window) {
    //   const countryCandidates = ["usa", "gbr", "fra", "deu", "ita", "jpn", "rus", "esp", "bra", "swe", "pol", "chn", "nld", "tur", "ind", "can", "aut", "ukr", "grc", "arg", "bel", "dnk", "aus", "che", "nor", "hun", "egy", "rou", "hrv", "irn", "prt", "irl", "fin", "mex", "srb", "isr", "irq", "bgr", "zaf", "ury", "svk", "blr", "geo", "col", "svn", "est", "sau", "bih", "ltu", "cze", "lva", "chl", "nzl", "nga", "cub", "kaz", "dza", "pak", "syr", "per", "kor", "isl", "tun", "mar", "aze", "jam", "pry", "ven"];
    //   const randCountryId = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
    //   const newUrl = `explore/viz?viz=treemap&show=occupations&years=-3501,2015&place=${randCountryId}`;
    //   window.history.pushState({path: newUrl}, "", newUrl);
    // }

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
            placeType={placeType}
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
            countryLookup={this.countryLookup}
            update={this.update}
            nestedOccupations={nestedOccupations}
            pageType={pageType}
            places={places}
            pathname={pathname}
            qParams={qParams}
          />
          <VizShell
            loading={loading}
            data={data}
            occupations={occupations}
            show={show}
            viz={viz}
            yearType={yearType}
          />
        </div>
      </div>
    );
  }
}

Viz.need = [
  fetchData(
    "places",
    "/place?select=id,place,lat,lon,slug,country:country_fk(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died&num_born=gte.15",
    {
      format: res => {
        const places = nest()
          .key(d => d.country_id)
          .entries(res)
          .map(countryData => ({
            country: countryData.values[0].country,
            cities: countryData.values.sort((cityA, cityB) => cityA.place.localeCompare(cityB.place))
          }))
          .filter(countryData => countryData.country)
          .sort((countryA, countryB) => countryA.country.country.localeCompare(countryB.country.country));
        return places;
      },
      useParams: false
    }
  ),
  fetchData(
    "occupationResponse",
    "/occupation",
    {
      format: res => {
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
      },
      useParams: false
    }
  )
];

export default connect(state => ({data: state.data}), {})(Viz);
