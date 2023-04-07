import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Priestley} from "d3plus-react";
import {groupBy, shapeConfig, peopleTooltip, on} from "viz/helpers";

const Lifespans = ({attrs, country, peopleBorn}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null && p.birthyear > 1699 && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.birthplace;
  });

  const priestleyMax = 25;

  const priestleyData = tmapBornData
    .filter(p => p.deathyear !== null)
    .slice(0, priestleyMax);

  return <section className="profile-section">
    <SectionHead title="Overlapping Lives" index={1} numSections={5} />
    <div className="section-body">
      <p>Below is a visual represetation of the lifespans of the top {priestleyData.length} globally memorable people born in present day {country.country} since 1700.</p>
      <VizWrapper component={this} refKey="lifespansViz">
        <Priestley
          title={`Lifespans of Top ${priestleyData.length} Individuals Born in ${country.country}`}
          key="priestley1"
          config={{
            data: priestleyData,
            depth: 1,
            detectVisible: false,
            end: "deathyear",
            groupBy: ["domain", "name"].map(groupBy(attrs)),
            height: 700,
            legendConfig: {
              label: d => d.occupation.domain
            },
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

export default Lifespans;
