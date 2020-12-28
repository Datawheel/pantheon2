import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {Helmet} from "react-helmet-async";
import Controls from "pages/explore/controls/Index";
import VizShell from "pages/explore/viz/VizShell";
import VizTitle from "pages/explore/viz/VizTitle";
import {nest} from "d3-collection";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
import {initRankingsAndViz, unmountRankingsAndViz} from "actions/vb";
import {SANITIZERS} from "types";
import "pages/explore/Explore.css";

const COUNTRY_LIST = ["cze", "geo", "rou", "mkd", "civ", "ury", "arg", "lva", "bgr", "blr", "egy", "nzl", "gha", "irq", "chl", "rus", "ecu", "tur", "jpn", "fin", "bra", "pol", "che", "mex", "nld", "ita", "ind", "usa", "nor", "chn", "aut", "prt", "deu", "grc", "esp", "can", "dnk", "hun", "bel", "fra", "isr", "swe", "gbr", "lbn", "dza", "isl", "aus", "tha", "pak", "zaf", "arm", "tun", "hrv", "syr", "ukr", "irn", "vnm", "irl", "svk", "svn", "col", "est", "cub", "sau", "per", "ven", "mar", "ltu", "afg", "srb", "ken", "jam", "pry", "nga", "kaz", "mne", "uzb", "bih", "aze", "cmr", "kor"];

class Viz extends Component {

  constructor(props) {
    super(props);
    const {location, initRankingsAndViz} = props;
    const {query: qParams} = location;
    const country = SANITIZERS.country(qParams.place) || COUNTRY_LIST[Math.floor(Math.random() * COUNTRY_LIST.length)];
    const city = SANITIZERS.city(qParams.place) || "all";
    const gender = SANITIZERS.gender(qParams.gender);
    const occupation = qParams.occupation || "all";
    const years = SANITIZERS.years(qParams.years);
    const metricCutoff = SANITIZERS.metric(qParams.l ? "l" : "hpi", qParams.l || qParams.hpi || 0).cutoff;
    const metricType = qParams.l ? "l" : "hpi";
    const onlyShowNew = qParams.new === "true";
    const show = qParams.show ? SANITIZERS.show(qParams.show, "viz") : "occupations";
    const viz = qParams.viz ? SANITIZERS.vizType(qParams.viz) : "treemap";
    initRankingsAndViz({country, city, gender, metricCutoff, metricType, onlyShowNew, page: "viz", occupation, show, viz, years});
  }

  componentWillUnmount() {
    this.props.unmountRankingsAndViz();
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
    const {metricCutoff, metricType, years} = this.props;
    // return <div>nada...</div>;

    // if (this.props.router.location.search === "" && window) {
    //   const countryCandidates = ["usa", "gbr", "fra", "deu", "ita", "jpn", "rus", "esp", "bra", "swe", "pol", "chn", "nld", "tur", "ind", "can", "aut", "ukr", "grc", "arg", "bel", "dnk", "aus", "che", "nor", "hun", "egy", "rou", "hrv", "irn", "prt", "irl", "fin", "mex", "srb", "isr", "irq", "bgr", "zaf", "ury", "svk", "blr", "geo", "col", "svn", "est", "sau", "bih", "ltu", "cze", "lva", "chl", "nzl", "nga", "cub", "kaz", "dza", "pak", "syr", "per", "kor", "isl", "tun", "mar", "aze", "jam", "pry", "ven"];
    //   const randCountryId = countryCandidates[Math.floor(Math.random() * countryCandidates.length)];
    //   const newUrl = `explore/viz?viz=treemap&show=occupations&years=-3501,2015&place=${randCountryId}`;
    //   window.history.pushState({path: newUrl}, "", newUrl);
    // }

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
          <VizTitle />
          {years.length
            ? <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
            : null}
          {metricSentence ? <p>{metricSentence}</p> : null}
        </div>
        <div className="explore-body">
          <Controls />
          <VizShell />
        </div>
      </div>
    );
  }
}

Viz.need = [
  fetchData(
    "places",
    "/place?select=id,place,slug,country:country_fk(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died&num_born=gte.15",
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

const mapDispatchToProps = {initRankingsAndViz, unmountRankingsAndViz};

const mapStateToProps = state => ({
  years: state.vb.years,
  metricCutoff: state.vb.metricCutoff,
  metricType: state.vb.metricType
});

export default connect(mapStateToProps, mapDispatchToProps)(Viz);
