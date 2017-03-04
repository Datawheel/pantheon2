import React, {Component} from "react";
import {connect} from "react-redux";
import "css/components/explore/explore";
import {Viz} from "d3plus-react";
import {changeCity, changeCityInCountry, changeCountry, changeGrouping, changeOccupations,
  changeOccupationDepth, changePlaceDepth, changeViz, changeYears} from "actions/explorer";
import {COLORS_CONTINENT, COUNTRY_DEPTH, CITY_DEPTH, OCCUPATION_DEPTH, DOMAIN_DEPTH, FORMATTERS, YEAR_BUCKETS} from "types";
import {extent} from "d3-array";
import {groupBy, groupTooltip, peopleTooltip, shapeConfig} from "viz/helpers";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  sanitizeYear(yr) {
    const yearAsNumber = Math.abs(yr.match(/\d+/)[0]);
    if (yr.replace(".", "").toLowerCase().includes("bc") || parseInt(yr, 10) < 0) {
      return yearAsNumber * -1;
    }
    return yearAsNumber;
  }

  sanitizeQueryYears(yearStr) {
    if (!yearStr || !yearStr.includes(",")) return [1990, 2015];
    let yearArr = [this.sanitizeYear(yearStr.split(",")[0]),
                    this.sanitizeYear(yearStr.split(",")[1])];
    return yearArr;
  }

  sanitizeQueryViz(vizStr) {
    if (["Treemap", "StackedArea"].indexOf(vizStr) === -1) return "Treemap";
    return vizStr;
  }

  sanitizeQueryGrouping(groupingStr) {
    if (["places", "occupations"].indexOf(groupingStr) === -1) return "places";
    return groupingStr;
  }

  sanitizeQueryCountry(countryStr) {
    if (!countryStr || !countryStr.includes("|")) return null;
    return countryStr.split("|");
  }

  sanitizeQueryCity(cityStr) {
    if (!cityStr) return null;
    return cityStr;
  }

  sanitizeQueryOccupation(occupationStr) {
    if (!occupationStr || !occupationStr.includes("|")) return null;
    return occupationStr.split("|");
  }

  componentDidMount() {
    let {city, country, grouping, occupation, viz, years} = this.props.queryParams;
    years = this.sanitizeQueryYears(years);
    if (years) {
      this.props.changeYears(years);
    }
    country = this.sanitizeQueryCountry(country);
    city = this.sanitizeQueryCity(city);
    if (country) {
      this.props.changeCountry(country);
      if (city) {
        this.props.changeCityInCountry(city);
      }
      this.props.changePlaceDepth(COUNTRY_DEPTH);
    }
    else if (city) {
      this.props.changeCity(city);
      this.props.changePlaceDepth(CITY_DEPTH);
    }
    occupation = this.sanitizeQueryOccupation(occupation);
    if (occupation) {
      if (occupation[1].includes(",")) {
        this.props.changeOccupationDepth(DOMAIN_DEPTH);
      }
      else {
        this.props.changeOccupationDepth(OCCUPATION_DEPTH);
      }
      this.props.changeOccupation(occupation);
    }
    grouping = this.sanitizeQueryGrouping(grouping);
    this.props.changeGrouping(grouping);
    viz = this.sanitizeQueryViz(viz);
    this.props.changeViz(viz);
  }

  render() {
    const {data, grouping, occupation, viz, years} = this.props.explorer;
    const {occupations} = occupation;
    const {type, config} = viz;
    let attrs, vizData, vizShapeConfig;

    if (!data.length) {
      return <div className="explore-viz-container">no data yet (or loading...)</div>;
    }

    if (grouping === "places") {
      let birthyearSpan = extent(data, d => d.birthyear);
      birthyearSpan = birthyearSpan[1] - birthyearSpan[0];

      vizData = data
        .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
        .map(d => {
          d.borncountry = d.birthcountry.country_name;
          d.borncontinent = d.birthcountry.continent;
          d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                       ? d.birthyear
                       : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
          return d;
        });
      vizShapeConfig = {fill: d => COLORS_CONTINENT[d.borncontinent]};
    }
    else if (grouping === "occupations") {
      attrs = occupations.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {});
      vizData = data
        .filter(p => p.birthyear !== null && p.occupation_id !== null)
        .map(d => {
          d.occupation_id = `${d.occupation_id}`;
          const o = attrs[d.occupation_id];
          if (o) {
            d.occupation_name = o.name;
            d.domain = o.domain;
            d.domain_slug = o.domain_slug;
            d.industry = o.industry;
          }
          else {
            console.log(d.profession_id, attrs);
          }
          d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
          d.place = d.birthplace;
          return d;
        });
      vizShapeConfig = shapeConfig(attrs);
    }

    return (
      <div className="explore-viz-container">
        <h1>How have the {grouping} of all globally remembered people changed over time?</h1>
        <h3 className="explore-viz-date">{FORMATTERS.year(years[0])} - {FORMATTERS.year(years[1])}</h3>
        <div className="viz-shell">
          <Viz type={type} config={Object.assign(
            {
              shapeConfig: vizShapeConfig
            },
            config,
            {
              data: vizData,
              groupBy: config.groupBy.map(groupBy(attrs)),
              tooltipConfig: type === "Priestley" ? peopleTooltip : groupTooltip(vizData)
            }
          )} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    explorer: state.explorer
  };
}

const mapDispatchToProps = dispatch => ({
  changeCountry: countryArr => {
    dispatch(changeCountry(countryArr[0], countryArr[1], false));
  },
  changeGrouping: grouping => {
    dispatch(changeGrouping(grouping));
  },
  changeOccupation: occArr => {
    dispatch(changeOccupations(occArr[0], occArr[1], false));
  },
  changeCity: city => {
    dispatch(changePlaceDepth(city));
  },
  changeCityInCountry: city => {
    dispatch(changeCityInCountry(city));
  },
  changeOccupationDepth: depth => {
    dispatch(changeOccupationDepth(depth));
  },
  changePlaceDepth: depth => {
    dispatch(changePlaceDepth(depth));
  },
  changeViz: type => {
    dispatch(changeViz(type));
  },
  changeYears: years => {
    dispatch(changeYears(years, false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VizShell);
