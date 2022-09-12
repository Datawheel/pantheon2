import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchData } from "@datawheel/canon-core";
import { Helmet } from "react-helmet-async";
import Controls from "pages/explore/controls/Index";
import RankingTable from "pages/explore/rankings/RankingTable";
import { nest } from "d3-collection";
import { merge } from "d3-array";
import { FORMATTERS, HPI_RANGE, LANGS_RANGE } from "types";
import { animateScroll as scroll } from "react-scroll";
import { plural } from "pluralize";
import "pages/explore/Explore.css";
import VizTitle from "pages/explore/viz/VizTitle";
import { initRankingsAndViz, unmountRankingsAndViz } from "actions/vb";
import { SANITIZERS } from "types";
import Spinner from "components/Spinner";

class Ranking extends Component {
  constructor(props) {
    super(props);
    const { location, initRankingsAndViz } = props;
    const { query: qParams } = location;
    const country = SANITIZERS.country(qParams.place) || "all";
    const city = SANITIZERS.city(qParams.place) || "all";
    const gender = SANITIZERS.gender(qParams.gender);
    const occupation = qParams.occupation || "all";
    const years = SANITIZERS.years(qParams.years);
    const metricCutoff = SANITIZERS.metric(
      qParams.l ? "l" : "hpi",
      qParams.l || qParams.hpi || 0
    ).cutoff;
    const metricType = qParams.l ? "l" : "hpi";
    const onlyShowNew = qParams.new === "true";
    const show = qParams.show
      ? SANITIZERS.show(qParams.show, "rankings")
      : "people";
    initRankingsAndViz({
      country,
      city,
      gender,
      metricCutoff,
      metricType,
      onlyShowNew,
      page: "rankings",
      occupation,
      show,
      years,
    });
  }

  componentWillUnmount() {
    this.props.unmountRankingsAndViz();
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
    } else {
      this.setState(updatedState);
    }
  };
  update = (newState) => {
    this.setState(Object.assign({}, this.state, newState, { page: 0 }));
  };
  search = (term) => {
    const { data, show } = this.state;
    this.setState({
      searching: true,
      filteredData: data.filter((d) => d.name.toLowerCase().includes(term)),
    });
  };

  render() {
    const { pageType } = this.props.route;
    const { places, occupationResponse } = this.props.data;
    const { query: qParams, pathname } = this.props.location;
    const { metricCutoff, metricType, rankingData, onlyShowNew, years } =
      this.props;

    if (!occupationResponse) {
      return <div>loading...</div>;
    }

    const { nestedOccupations, occupations } = occupationResponse;

    const metricRange = metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    let metricSentence;

    if (metricCutoff > metricRange[0]) {
      metricSentence = onlyShowNew
        ? "Only showing newly added biographies (as of 2022)"
        : "Only showing biographies";
      if (metricType === "hpi") {
        metricSentence = `${metricSentence} with a Historical Popularity Index (HPI) greater than ${metricCutoff}.`;
      } else {
        metricSentence = `${metricSentence} with more than ${metricCutoff} Wikipedia language editions.`;
      }
    } else if (onlyShowNew) {
      metricSentence = "Only showing newly added biographies (as of 2022)";
    }

    return (
      <div className="explore">
        <Helmet title="Rankings" />
        <div className="explore-head">
          <VizTitle />
          {/* <VizTitle
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
          /> */}
          {years.length ? (
            <h3 className="explore-date">
              {FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}
            </h3>
          ) : null}
          {metricSentence ? <p>{metricSentence}</p> : null}
        </div>
        <div className="explore-body">
          <Controls
            countryLookup={this.countryLookup}
            updateData={this.updateData}
            update={this.update}
            nestedOccupations={nestedOccupations}
            pageType={pageType}
            places={places}
            pathname={pathname}
            qParams={qParams}
          />
          {rankingData.data ? <RankingTable /> : <Spinner />}
          {/* <RankingTable
            changePageSize={this.update}
            // countryLookup={this.countryLookup}
            // data={searching ? filteredData : data}
            // loading={loading}
            // occupations={occupations}
            // page={page}
            // pageSize={pageSize}
            // places={places}
            // onPageChange={page => {
            //   scroll.scrollToTop();
            //   this.setState({page});
            // }}
            search={this.search}
            // show={show}
            // viz={viz}
            // yearType={yearType}
          /> */}
        </div>
      </div>
    );
  }
}

Ranking.need = [
  fetchData(
    "places",
    "/place?select=id,place,lat,lon,slug,country:country_fk(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died",
    {
      format: (res) => {
        const places = nest()
          .key((d) => d.country_id)
          .entries(res)
          .map((countryData) => ({
            country: countryData.values[0].country,
            cities: countryData.values,
          }))
          .filter((countryData) => countryData.country);
        return places;
      },
      useParams: false,
    }
  ),
  fetchData("occupationResponse", "/occupation", {
    format: (res) => {
      const nestedOccupations = nest()
        .key((d) => d.domain_slug)
        .entries(res)
        .map((occData) => ({
          domain: {
            id: `${occData.values.map((o) => o.id)}`,
            slug: occData.values[0].domain_slug,
            name: occData.values[0].domain,
          },
          occupations: occData.values,
        }));

      return { nestedOccupations, occupations: res };
    },
    useParams: false,
  }),
];

const mapDispatchToProps = { initRankingsAndViz, unmountRankingsAndViz };

const mapStateToProps = (state) => ({
  data: state.data,
  rankingData: state.vb.data,
  years: state.vb.years,
  metricCutoff: state.vb.metricCutoff,
  metricType: state.vb.metricType,
  onlyShowNew: state.vb.onlyShowNew,
});

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);
