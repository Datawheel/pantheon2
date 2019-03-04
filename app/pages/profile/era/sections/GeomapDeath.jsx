import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapDeath = ({era, peopleDied}) => {
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
      <VizWrapper component={this} refKey="viz">
        <Geomap
          key="geomapDeaths"
          config={{
            title: `Major Cities in ${era.name} for Deaths of Cultural Celebrities`,
            data: geomapDeathData,
            depth: 1,
            fitFilter: d => ["152", "643"].includes(d.id),
            groupBy: ["event", "place_name"],
            on: on("place", d => d.place.slug),
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
            tooltipConfig: groupTooltip(geomapDeathData, d => d.place.slug)
          }} />
      </VizWrapper>
    </div>
  </section>;
};

export default GeomapDeath;
