import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapDeath = ({country, peopleDied}) => {
  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l);

  tmapDeathData.forEach(d => {
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

  const geomapDeathData = tmapDeathData.filter(d => d.place && d.place.lat && d.place.lon && d.occupation !== null)
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapDeathData.forEach(d => {
    d.place_name = d.place.place;
    d.place_coord = [d.place.lat, d.place.lon];
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",").map(Number);
    }
    d.place_coord.reverse();
  });

  return <section className="profile-section">
    <SectionHead title="Cities by Deaths" index={1} numSections={5} />
    <div className="section-body">
      <VizWrapper component={this} refKey="viz">
        <Geomap
          key="geomapDeaths"
          config={{
            title: `Cities by deaths in ${country.country}`,
            data: geomapDeathData,
            depth: 1,
            fitFilter: `${country.country_num}`,
            groupBy: ["event", "place_name"],
            on: on("place", d => d.place.slug),
            shapeConfig: {
              fill: d => d.event.toLowerCase().indexOf("birth") > 0
                ? "rgba(76, 94, 215, 0.4)"
                : "rgba(95, 1, 22, 0.4)",
              stroke: () => "#4A4948",
              strokeWidth: 1,
              Path: {
                fill: d => parseInt(d.id, 10) === parseInt(country.country_num, 10) ? "#ccc" : "transparent",
                stroke: "#4A4948",
                strokeWidth: 0.75
              }
            },
            tooltipConfig: groupTooltip(geomapDeathData, d => d.place.slug)
          }}
        />
      </VizWrapper>
    </div>
  </section>;
};

export default GeomapDeath;
