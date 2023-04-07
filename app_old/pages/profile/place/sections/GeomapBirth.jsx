import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Geomap} from "d3plus-react";
import {groupTooltip, on} from "viz/helpers";

const GeomapBirth = ({place, peopleBorn}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.deathyear !== null)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach(d => {
    d.devent = "CITY OF DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

  const geomapBornData = tmapBornData.filter(d => d.dplace_geonameid && d.dplace_geonameid.lat && d.dplace_geonameid.lon)
    .sort((a, b) => b.l - a.l)
    .slice(0, 100);
  geomapBornData.forEach(d => {
    d.place_name = d.dplace_geonameid.place;
    d.place_coord = [d.dplace_geonameid.lat, d.dplace_geonameid.lon];
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",").map(Number);
    }
    d.place_coord.reverse();
  });

  return <section className="profile-section">
    <SectionHead title="Death Places" index={1} numSections={5} />
    <div className="section-body">
      <VizWrapper component={this} refKey="viz">
        <Geomap
          key="geomapDeaths"
          config={{
            title: `Death places for people born in ${place.place}`,
            data: geomapBornData,
            depth: 1,
            // fitFilter: `${country.country_num}`,
            groupBy: ["devent", "place_name"],
            on: on("place", d => d.dplace_geonameid.slug),
            shapeConfig: {
              fill: d => d.devent.toLowerCase().indexOf("birth") > 0
                ? "rgba(76, 94, 215, 0.4)"
                : "rgba(95, 1, 22, 0.4)",
              stroke: () => "#4A4948",
              strokeWidth: 1,
              Path: {
                fill: d => parseInt(d.id, 10) === parseInt(place.country_num, 10) ? "#ccc" : "transparent",
                stroke: "#4A4948",
                strokeWidth: 0.75
              }
            },
            tooltipConfig: groupTooltip(geomapBornData, d => d.dplace_geonameid.slug)
          }} />
      </VizWrapper>
    </div>
  </section>;
};

export default GeomapBirth;
