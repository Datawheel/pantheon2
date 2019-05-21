import React from "react";
import {nest} from "d3-collection";
import {plural} from "pluralize";
import {Treemap} from "d3plus-react";
import AnchorList from "components/utils/AnchorList";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {groupBy, groupTooltip, on, shapeConfig} from "viz/helpers";

const Occupations = ({era, peopleBorn, peopleDied, occupations}) => {
  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_born: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleBorn.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_died: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleDied.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);

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
    d.place = d.dplace_geonameid;
  });

  const attrs = occupations.reduce((obj, d) => {
    obj[d.id] = d;
    return obj;
  }, {});

  return (
    <section className="profile-section">
      <SectionHead title="Occupations" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Most individuals born in the {era.name} were&nbsp;
            <AnchorList items={occupationsBorn.slice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_born})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />,&nbsp;
            while most who died were&nbsp;
            <AnchorList items={occupationsDied.slice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_died})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />.
          </p>
        </div>
        <VizWrapper component={this} refKey="viz">
          <Treemap
            key="tmap1"
            config={{
              title: `Occupations of People Born during the ${era.name}`,
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.occupation.occupation_slug)
            }} />
        </VizWrapper>
        <VizWrapper component={this} refKey="viz2">
          <Treemap
            key="tmap2"
            config={{
              title: `Occupations of People Deceased during the ${era.name}`,
              data: tmapDeathData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              time: "deathyear",
              tooltipConfig: groupTooltip(tmapDeathData, d => d.occupation.occupation_slug)
            }} />
        </VizWrapper>
      </div>
    </section>
  );
};

export default Occupations;
