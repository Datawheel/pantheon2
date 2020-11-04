import React, {Component} from "react";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import Helmet from "react-helmet";
import Controls from "pages/explore/controls/Index";
import VizShell from "pages/explore/viz/VizShell";
import VizTitle from "pages/explore/viz/VizTitle";
import {nest} from "d3-collection";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE} from "types";
import {initRankingsAndViz, unmountRankingsAndViz} from "actions/vb";
import {SANITIZERS} from "types";
import "pages/explore/Explore.css";

class Viz extends Component {

  constructor(props) {
    super(props);
    // this.countryLookup = this.props.data.places.reduce((acc, cur) => ({...acc, [cur.country.country_code]: cur.country}), {});
    // this.state = {
    //   data: [],
    //   loading: true,
    //   viz: "treemap",
    //   city: "all",
    //   country: "all",
    //   filteredData: [],
    //   gender: null,
    //   nestedOccupations: null,
    //   occupation: "all",
    //   occupations: null,
    //   pageSize: 50,
    //   places: null,
    //   searching: false,
    //   show: "occupations",
    //   years: [],
    //   yearType: "birthyear"
    // };
  }

  componentWillMount() {
    const {location, initRankingsAndViz} = this.props;
    const {query: qParams} = location;
    const country = SANITIZERS.country(qParams.place) || "all";
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

  // UNSAFE_componentWillMount() {
  //   console.log("UNSAFE_componentWillMount porps", this.props);
  // }

  // componentDidUpdate(prevProps) {
  //   // console.log("prevProps", prevProps);
  //   // console.log("this.props", this.props);
  //   // Typical usage (don't forget to compare props):
  //   // if (this.props.location.pathname !== prevProps.location.pathname) {
  //   // this.fetchData(this.props.userID);
  //   // console.log("\n\n---------should update!!!\n---------------\n\n\n");
  //   // this.setState({data: [], loading: true, filteredData: []});
  //   // }
  // }

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
