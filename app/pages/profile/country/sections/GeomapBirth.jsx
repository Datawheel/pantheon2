import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapBirth = ({country, peopleBorn}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach(d => {
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.bplace = d.bplace_geonameid;
  });

  const geomapBornData = tmapBornData.filter(d => d.bplace && d.bplace.lat && d.bplace.lon)
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapBornData.forEach(d => {
    d.place_name = d.bplace.place;
    d.place_coord = [d.bplace.lat, d.bplace.lon];
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",").map(Number);
    }
    d.place_coord.reverse();
  });

  return <section className="profile-section">
    <SectionHead title="Cities by Births" index={1} numSections={5} />
    <div className="section-body">
      <VizWrapper component={this} refKey="viz">
        <Geomap
          key="geomapBirths"
          config={{
            title: `Cities by birth in ${country.country}`,
            data: geomapBornData,
            depth: 1,
            fitFilter: `${country.country_num}`,
            groupBy: ["event", "place_name"],
            on: on("place", d => d.bplace.slug),
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
            tooltipConfig: groupTooltip(geomapBornData, d => d.bplace.slug)
          }} />
      </VizWrapper>
    </div>
  </section>;
};

export default GeomapBirth;
