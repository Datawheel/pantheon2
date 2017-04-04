import React, {Component} from "react";
import {connect} from "react-redux";
import "css/components/explore/explore";
import "css/components/explore/viz";
import {StackedArea, Treemap, Viz} from "d3plus-react";
import {changeViz} from "actions/explore";
import {COLORS_CONTINENT, COUNTRY_DEPTH, PLACE_DEPTH, OCCUPATION_DEPTH, DOMAIN_DEPTH, FORMATTERS, YEAR_BUCKETS} from "types";
import {extent} from "d3-array";
import {bucketScale, groupBy, groupTooltip, peopleTooltip, shapeConfig} from "viz/helpers";

class VizShell extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.changeViz("Treemap");
  }

  render() {
    const {data, show, occupation, viz, years} = this.props.explore;
    const {occupations} = occupation;
    const {type, config} = viz;
    let attrs, vizData, vizShapeConfig;

    if (!data.length) {
      return <div className="explore-viz-container">Loading data</div>;
    }

    if (show.type === "places") {
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
    else if (show.type === "occupations") {
      let birthyearSpan = extent(data, d => d.birthyear);
      birthyearSpan = birthyearSpan[1] - birthyearSpan[0];
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
          d.event = "OCCUPATIONS OF FAMOUS PEOPLE";
          d.place = d.birthplace;
          d.bucketyear = birthyearSpan < YEAR_BUCKETS * 2
                       ? d.birthyear
                       : Math.round(d.birthyear / YEAR_BUCKETS) * YEAR_BUCKETS;
          return d;
        });
      vizShapeConfig = shapeConfig(attrs);
    }

    const MyViz = type === "StackedArea" ? StackedArea : Treemap;

    return (
      <div className="explore-viz-container">
        <div className="viz-shell">
          <MyViz config={Object.assign(
            {
              shapeConfig: vizShapeConfig
            },
            config,
            {
              data: vizData,
              height: false,
              timeline: false,
              groupBy: config.groupBy.map(groupBy(attrs)),
              legendConfig: {
                shapeConfig: {
                  fontColor: "#4B4A48",
                  fontFamily: () => "Amiko",
                  fontResize: false,
                  fontSize: () => 14,
                  height: () => 13,
                  labelPadding: 0,
                  width: () => 13
                }
              },
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
    explore: state.explore
  };
}

const mapDispatchToProps = dispatch => ({
  changeViz: vizType => {
    dispatch(changeViz(vizType));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VizShell);
