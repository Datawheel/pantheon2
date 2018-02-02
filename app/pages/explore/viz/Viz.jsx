import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "datawheel-canon";
import Helmet from "react-helmet";
import Controls from "pages/explore/controls/Index";
import VizShell from "pages/explore/viz/VizShell";
import RankingTable from "pages/explore/rankings/RankingTable";
import {nest} from "d3-collection";
import {merge} from "d3-array";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
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

class Viz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      viz: "treemap",
      city: "all",
      country: "all",
      gender: null,
      nestedOccupations: null,
      occupation: "all",
      occupations: null,
      places: null,
      show: "occupations",
      years: [],
      yearType: "birthyear"
    };
  }

  updateData = updatedState => this.setState(updatedState);
  update = (key, val) => {
    this.setState({[key]: val});
  }

  render() {
    const {pageType} = this.props.route;
    const {places, occupationResponse} = this.props.data;
    const {nestedOccupations, occupations} = occupationResponse;
    const {city, country, data, gender, metricCutoff, metricType, loading, occupation, show, viz, years, yearType} = this.state;

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
          />
          {pageType === "viz"
            ? <VizShell
              loading={loading}
              data={data}
              occupations={occupations}
              show={show}
              viz={viz}
              yearType={yearType}
            />
            : <RankingTable
              loading={loading}
              data={data}
              occupations={occupations}
              places={places}
              show={show}
              viz={viz}
              yearType={yearType}
            />
          }
        </div>
      </div>
    );
  }
}

Viz.need = [
  fetchData("places", "http://localhost:3100/place", res => {
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
  fetchData("occupationResponse", "http://localhost:3100/occupation", res => {
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

export default connect(state => ({data: state.data}), {})(Viz);
