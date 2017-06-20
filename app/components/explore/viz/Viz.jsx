import React, {Component} from "react";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import config from "helmconfig.js";
import "css/components/explore/explore";
import Controls from "components/explore/controls/Index";
import VizShell from "components/explore/viz/VizShell";
import {initExplore, initExplorePlace, initExploreOccupation, setExplorePage} from "actions/explore";
import {FORMATTERS, HPI_RANGE, LANGS_RANGE, COUNTRY_DEPTH, CITY_DEPTH} from "types";
import {plural} from "pluralize";

class Viz extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.setExplorePage("viz");
  }

  getOccupationSubject(occupation, genderedPronoun) {
    if (occupation.selectedOccupationSlug === "all") {
      return genderedPronoun;
    }
    const options = occupation.domains.concat(occupation.occupations);
    let returnOccupation = options.filter(d => d.slug === occupation.selectedOccupationSlug);
    returnOccupation = returnOccupation.length ? returnOccupation[0] : null;
    const selectedDepth = `${returnOccupation.occupations}`.includes(",") ? "DOMAIN" : "OCCUPATION";
    if (selectedDepth === "DOMAIN") {
      return `${genderedPronoun} in ${returnOccupation.name} occupations`;
    }
    else {
      const gendersLookup = {people: "", men: "male", women: "female"};
      console.log(gendersLookup[genderedPronoun], returnOccupation);
      return `${gendersLookup[genderedPronoun]} ${plural(returnOccupation.name)}`;
    }
  }

  getFromLocation(place) {
    if (place.selectedDepth === COUNTRY_DEPTH && place.selectedCountry !== "all") {
      const country = place.countries.filter(c => c.id === parseInt(place.selectedCountry, 10))[0];
      // return place.selectedPlaceInCountryStr && place.selectedPlaceInCountryStr !== "all" ? ` from ${place.selectedPlaceInCountryStr}, ${country.name}` : ` from ${country.name}`;
      return ` from ${country.name}`;
    }
    else if (place.selectedDepth === CITY_DEPTH && place.selectedPlace !== "all") {
      const thisPlace = place.places.filter(p => p.id === parseInt(place.selectedPlace, 10))[0];
      return ` from ${thisPlace.name}`;
    }
    return "";
  }

  render() {
    const {gender, show, years, metric, occupation, place} = this.props.explore;

    const metricRange = metric.metricType === "hpi" ? HPI_RANGE : LANGS_RANGE;
    let metricSentence;
    if (metric.cutoff > metricRange[0]) {
      if (metric.metricType === "hpi") {
        metricSentence = `Showing people with a Historical Popularity Index (HPI) greater than ${metric.cutoff}.`;
      }
      else {
        metricSentence = `Showing people with more than ${metric.cutoff} Wikipedia language editions.`;
      }
    }

    let genderedPronoun = "people";
    if (gender === true || gender === false) {
      genderedPronoun = gender === true ? "men" : "women";
    }
    const occupationSubject = this.getOccupationSubject(occupation, genderedPronoun);
    const fromLocation = this.getFromLocation(place);

    const title = show.type === "occupations"
      ? `What occupations were held by memorable ${occupationSubject}${fromLocation}?`
      : `Where were memorable ${occupationSubject}${fromLocation} born?`;

    return (
      <div className="explore">
        <Helmet
          htmlAttributes={{lang: "en", amp: undefined}}
          title={`${title} (${FORMATTERS.year(years[0])} - ${FORMATTERS.year(years[1])})`}
          meta={config.meta}
          link={config.link}
        />
        <div className="explore-head">
          <h1 className="explore-title">{title}</h1>
          <h3 className="explore-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
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

function mapStateToProps(state) {
  return {
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  setExplorePage: page => {
    dispatch(setExplorePage(page));
  }
});

Viz.need = [
  initExplore,
  initExplorePlace,
  initExploreOccupation
];

export default connect(mapStateToProps, mapDispatchToProps)(Viz);
