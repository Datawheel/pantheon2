import React, {Component} from "react";
import {connect} from "react-redux";
import "css/components/explore/explore";
import "css/components/explore/viz";
import {StackedArea, Treemap} from "d3plus-react";
import {changeViz} from "actions/explore";
import {COLORS_CONTINENT} from "types";
import {calculateYearBucket, groupBy, groupTooltip, on, peopleTooltip, shapeConfig} from "viz/helpers";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.changeViz("Treemap");
  }

  render() {
    const {data, show, occupation, viz, place, yearType} = this.props.explore;
    const {occupations} = occupation;
    const {type, config} = viz;
    let attrs, vizData, vizShapeConfig;

    if (data.loading) {
      return <div className="explore-viz-container">
        <div className="loading-img">
          <p>Loading data<span className="loading-dot">.</span><span className="loading-dot">.</span><span className="loading-dot">.</span></p>
          <div className="spinner"></div>
          <div className="spin-cover"></div>
        </div>
      </div>;
    }

    if (!data.data.length) {
      return <div className="explore-viz-container">
        <div className="loading-img">
          <p>No data found.</p>
        </div>
      </div>;
    }

    const [yearLabels, ticks] = calculateYearBucket(data.data, d => d[yearType]);
    console.log("yearLabels:", yearLabels);
    console.log("ticks:", ticks);

    if (show.type === "places") {

      let dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent;
      if (place.selectedCountry !== "all") {
        dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent && p.birthplace;
      }
      vizData = data.data
        .filter(dataFilter)
        .map(d => {
          d.borncountry = d.birthcountry.country_name;
          if (place.selectedCountry !== "all") {
            d.bornplace = d.birthplace.name;
          }
          d.borncontinent = d.birthcountry.continent;
          return d;
        });
      vizShapeConfig = {fill: d => COLORS_CONTINENT[d.borncontinent]};
    }
    else if (show.type === "occupations") {
      attrs = occupations.reduce((obj, d) => {
        obj[d.id] = d;
        return obj;
      }, {});

      vizData = data.data
        .filter(p => p[yearType] !== null && p.occupation_id !== null)
        .map(d => {
          d.occupation_id = `${d.occupation_id}`;
          const o = attrs[d.occupation_id];
          if (o) {
            d.occupation_name = o.name;
            d.occupation_slug = o.slug;
            d.domain = o.domain;
            d.domain_slug = o.domain_slug;
            d.industry = o.industry;
          }
          else {
            console.log(d.profession_id, attrs);
          }
          d.event = "OCCUPATIONS OF FAMOUS PEOPLE";
          // d.place = d.birthplace.id;
          return d;
        });
      vizShapeConfig = shapeConfig(attrs);
    }

    const MyViz = type === "StackedArea" ? StackedArea : Treemap;

    const accessor = show.type === "places" ? d => d.birthcountry.slug : d => d.occupation_slug;

    return (
      <div className="explore-viz-container">
        <MyViz config={Object.assign(
          {
            shapeConfig: vizShapeConfig
          },
          config,
          {
            data: vizData,
            height: false,
            groupBy: config.groupBy.map(groupBy(attrs)),
            on: on(show.type.slice(0, show.type.length - 1), accessor),
            tooltipConfig: type === "Priestley" ? peopleTooltip : groupTooltip(vizData, accessor),
            xConfig: {
              labels: ticks,
              tickFormat: d => yearLabels[d]
            }
          }
        )} />
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
  changeViz: vizType => {
    dispatch(changeViz(vizType));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VizShell);
