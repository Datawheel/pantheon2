import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import VizShell from "pages/explore/viz/VizShell";
import VizTitle from "pages/explore/viz/VizTitle";
import {nest} from "d3-collection";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
import fetchPantheonData from "pages/explore/helpers/fetchPantheonData";
import {SANITIZERS} from "types";

import "pages/explore/Explore.css";
import "pages/explore/Embed.css";

class VizEmbed extends Component {

  constructor(props) {
    super(props);
    const {query: qParams} = this.props.location;
    const {pageType} = this.props.route;
    this.countryLookup = this.props.data.places.reduce((acc, cur) => ({...acc, [cur.country.country_code]: cur.country}), {});
    this.state = {
      data: [],
      loading: true,
      city: SANITIZERS.city(qParams.place) || "all",
      country: SANITIZERS.country(qParams.place) || "all",
      gender: SANITIZERS.gender(qParams.gender),
      occupation: qParams.occupation || "all",
      placeType: SANITIZERS.placeType(qParams.placeType),
      show: SANITIZERS.show(qParams.show ? qParams.show : pageType === "viz" ? "occupations" : "people", pageType),
      viz: pageType === "viz" ? SANITIZERS.vizType(qParams.viz || "Treemap") : null,
      years: SANITIZERS.years(qParams.years),
      yearType: SANITIZERS.yearType(qParams.yearType),
      metricCutoff: qParams.metricCutoff || "4",
      metricType: qParams.metricType || "hpi"
    };
  }

  componentDidMount() {
    // const {places} = this.props.data;
    // console.log("this.countryLookup!1", );
    this.updateData(Object.assign({data: [], loading: true}, this.state));
    const {pageType} = this.props.route;
    fetchPantheonData(pageType, this.countryLookup, this.state, this.updateData);
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
    const {places, occupationResponse} = this.props.data;
    const {query: qParams, pathname} = this.props.location;
    const {city, country, data, filteredData, gender, metricCutoff, metricType, loading, occupation, pageSize, searching, show, viz, years, yearType, placeType} = this.state;

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

VizEmbed.need = [
  fetchData("places", "/place?select=id,place,lat,lon,slug,country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died", res => {
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

export default connect(state => ({data: state.data}), {})(VizEmbed);
