import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import {Priestley} from "d3plus-react";
import VizWrapper from "pages/profile/common/VizWrapper";
import {groupBy, shapeConfig, peopleTooltip, on} from "viz/helpers";

const OverlappingLives = ({era, occupations, peopleBorn}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.birthplace;
  });

  const geomapBornData = tmapBornData.filter(d => d.place && d.place.lat_lon)
    .sort((a, b) => b.langs - a.langs)
    .slice(0, 100);
  geomapBornData.forEach(d => {
    d.place_name = d.place.place;
    d.place_coord = d.place.lat_lon;
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",").map(Number);
    }
    d.place_coord.reverse();
  });

  const priestleyMax = 25;
  const priestleyData = tmapBornData
    .filter(p => p.deathyear !== null)
    .slice(0, priestleyMax);

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  return <section className="profile-section">
    <SectionHead title="Overlapping Lives" index={1} numSections={5} />
    <div className="section-body">
      <VizWrapper component={this} refKey="viz">
        <Priestley
          key="priestley1"
          title={`Top ${priestleyMax} Contemporaries Born during the ${era.name}`}
          config={{
            data: priestleyData,
            depth: 1,
            detectVisible: false,
            end: "deathyear",
            groupBy: ["domain", "name"].map(groupBy(attrs)),
            on: on("person", d => d.slug),
            start: "birthyear",
            shapeConfig: Object.assign({}, shapeConfig(attrs), {
              labelPadding: 2
            }),
            tooltipConfig: peopleTooltip
          }} />
      </VizWrapper>
    </div>
  </section>;
};

export default OverlappingLives;
