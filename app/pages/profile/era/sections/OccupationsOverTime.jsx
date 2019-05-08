import React from "react";
import {StackedArea} from "d3plus-react";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {calculateYearBucket, groupBy, groupTooltip, shapeConfig} from "viz/helpers";

const OccupationsOverTime = ({peopleBorn, peopleDied, occupations}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null && p.bplace_country !== null && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.borncountry = d.bplace_country.country;
    d.borncontinent = d.bplace_country.continent;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.bplace_geonameid;
  });

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null && p.occupation)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.deathplace;
  });

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  const [bornBuckets, bornTicks] = calculateYearBucket(tmapBornData, d => d.birthyear);
  // const [deathBuckets, deathTicks] = calculateYearBucket(tmapDeathData, d => d.deathyear);

  return (
    <section className="profile-section">
      <SectionHead title="Occupations Over Time" index={1} numSections={5} />
      <div className="section-body">
        <VizWrapper component={this} refKey="viz">
          <StackedArea
            key="stacked1"
            config={{
              title: "Births Over Time",
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              shapeConfig: shapeConfig(attrs),
              tooltipConfig: groupTooltip(tmapBornData),
              xConfig: {
                ticks: bornTicks,
                tickFormat: d => bornBuckets[d]
              }
            }} />
        </VizWrapper>
        <VizWrapper component={this} refKey="viz2">
          <StackedArea
            key="stacked2"
            config={{
              title: "Birth Shares Over Time",
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              shapeConfig: shapeConfig(attrs),
              stackOffset: "expand",
              tooltipConfig: groupTooltip(tmapBornData),
              xConfig: {
                ticks: bornTicks,
                tickFormat: d => bornBuckets[d]
              }
            }} />
        </VizWrapper>
      </div>
    </section>
  );
};

export default OccupationsOverTime;
