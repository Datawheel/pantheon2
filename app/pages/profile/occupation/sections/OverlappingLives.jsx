import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Priestley} from "d3plus-react";
import {plural} from "pluralize";
import {peopleTooltip, on} from "viz/helpers";
import {COLORS_CONTINENT} from "types";

const OverlappingLives = ({people, occupation}) => {
  people = people
    .filter(p => p.birthyear && p.occupation)
    .sort((a, b) => b.birthyear - a.birthyear);

  const tmapBornData = people
    .filter(p => p.birthyear !== null && p.birthyear > 1699 && p.bplace_country && p.bplace_country.country && p.bplace_country.continent && p.dplace_country && p.dplace_country.country && p.dplace_country.continent)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach(d => {
    d.borncountry = d.bplace_country.country_name;
    d.borncontinent = d.bplace_country.continent;
    d.diedcontinent = d.dplace_country.continent;
  });

  const priestleyMax = 25;

  const priestleyData = tmapBornData
    .filter(p => p.deathyear !== null && p.dplace_country !== null)
    .slice(0, priestleyMax);

  if (priestleyData.length < 3) {
    return null;
  }

  return (
    <section className="profile-section">
      <SectionHead title="Overlapping Lives" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Which {plural(occupation.occupation)} were alive at the same time? This visualization shows the lifespans of the {priestleyData.length} most globally memorable {plural(occupation.occupation)} since 1700.
          </p>
        </div>
      </div>
      <VizWrapper component={this} refKey="viz">
        <Priestley
          key="priestley1"
          config={{
            title: `Lifespans of the Top ${priestleyData.length} ${occupation.occupation}s`,
            data: priestleyData,
            depth: 1,
            detectVisible: false,
            end: "deathyear",
            groupBy: ["diedcontinent", "name"],
            height: 700,
            on: on("person", d => d.slug),
            shapeConfig: {
              fill: d => COLORS_CONTINENT[d.diedcontinent],
              labelPadding: 2
            },
            start: "birthyear",
            tooltipConfig: peopleTooltip
          }} />
      </VizWrapper>
    </section>
  );
};

export default OverlappingLives;
