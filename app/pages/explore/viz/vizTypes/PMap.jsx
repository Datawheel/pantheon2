import React, {Component} from "react";
import {Geomap} from "d3plus-react";
import {RESET} from "d3plus-common";
import {nest} from "d3-collection";
import {groupTooltip, groupBy} from "viz/helpers";
import {COLORS_DOMAIN} from "types/index";

class PMap extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, occupations, show, yearType} = this.props;

    // dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent;
    // const uniqCountries = nest().key(d => d.birthcountry.id).entries(data.filter(dataFilter));
    // if (uniqCountries.length === 1) {
    //   grouping = ["borncountry", "bornplace"];
    //   dataFilter = p => p[yearType] !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent && p.bplace_geonameid;
    // }

    const geomapData = data
      .filter(d => d.bplace_geonameid && d.bplace_geonameid.lat && d.bplace_geonameid.lon)
      .sort((a, b) => b.l - a.l)
      .slice(0, 1000)
      .map(d => {
        d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
        d.borncountry = d.bplace_country ? d.bplace_country.country : d.bplace_country;
        d.bornplace = d.bplace_geonameid ? d.bplace_geonameid.place : d.bplace_geonameid;
        d.borncontinent = d.bplace_country ? d.bplace_country.continent : d.bplace_country;
        d.occupation_id = `${d.occupation_id}`;
        d.place_name = d.bplace_geonameid.place;
        d.place_coord = [d.bplace_geonameid.lat, d.bplace_geonameid.lon];
        if (!(d.place_coord instanceof Array)) {
          d.place_coord = d.place_coord
            .replace("(", "")
            .replace(")", "")
            .split(",").map(Number);
        }
        d.place_coord.reverse();
        return d;
      });
    // console.log("geomapData", geomapData);

    return (
      <Geomap
        config={{
          data: geomapData,
          depth: 1,
          fitFilter: d => ["152", "643"].includes(d.id),
          groupBy: ["event", "place_name"],
          height: RESET,
          // on: on("place", d => d.place.slug),
          shapeConfig: {
            fill: d => d.event.toLowerCase().indexOf("birth") > 0
              ? "rgba(76, 94, 215, 0.4)"
              : "rgba(95, 1, 22, 0.4)",
            stroke: () => "#4A4948",
            strokeWidth: 1,
            Path: {
              fill: "transparent",
              stroke: "#4A4948",
              strokeWidth: 0.75
            }
          },
          tooltipConfig: groupTooltip(geomapData, d => d.bplace_geonameid.slug)
        }}
      />
    );
  }

}

export default PMap;
