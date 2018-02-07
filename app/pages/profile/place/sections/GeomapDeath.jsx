import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapDeath = ({country, peopleDied}) => {
  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.deathplace;
  });

  const geomapDeathData = tmapDeathData.filter(d => d.place && d.place.lat_lon)
    .sort((a, b) => b.langs - a.langs)
    .slice(0, 100);
  geomapDeathData.forEach(d => {
    d.place_name = d.place.name;
    d.place_coord = d.place.lat_lon;
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",").map(Number);
    }
    d.place_coord.reverse();
  });

  return <section className="profile-section">
    <SectionHead title="Major cities by number of deaths" index={1} numSections={5} />
    <div className="section-body">
      <Geomap
        key="geomapDeaths"
        config={{
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
        }} />]
    </div>
  </section>;
};

export default GeomapDeath;