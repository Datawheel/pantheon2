import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapBirth = ({era, peopleBorn}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.bplace_geonameid;
  });

  const geomapBornData = tmapBornData.filter(d => d.place && d.place.lat && d.place.lon)
    .sort((a, b) => b.langs - a.langs)
    .slice(0, 500);
  geomapBornData.forEach(d => {
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
    <SectionHead title="Major cities by number of births" index={1} numSections={5} />
    <div className="section-body">
      <VizWrapper component={this} refKey="viz">
        <Geomap
          key="geomapBirths"
          config={{
            title: `Major Cities in ${era.name} for Births of Cultural Celebrities`,
            data: geomapBornData,
            pointSizeMax: 30,
            pointSizeMin: 2,
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
            tooltipConfig: groupTooltip(geomapBornData, d => d.place.slug)
          }} />
      </VizWrapper>
    </div>
  </section>;
};

export default GeomapBirth;
