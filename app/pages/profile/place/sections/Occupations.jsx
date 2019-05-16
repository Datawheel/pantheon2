import React from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {Treemap} from "d3plus-react";
import {plural} from "pluralize";
import {groupBy, groupTooltip, on, shapeConfig} from "viz/helpers";

const Occupations = ({attrs, place, peopleBorn, peopleDied}) => {
  const tmapBornData = peopleBorn
    .filter(p => p.birthyear !== null)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach(d => {
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.place = d.bplace_geonameid;
    d.l = 0;
  });

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null)
    .sort((a, b) => b.l - a.l);

  tmapDeathData.forEach(d => {
    d.industry = d.occupation.industry;
    d.domain = d.occupation.domain;
    d.occupation_name = d.occupation.occupation;
    d.occupation_id = `${d.occupation_id}`;
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

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
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value);

  return (
    <section className="profile-section">
      <SectionHead title="Occupations" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Most individuals born in present day {place.place} were&nbsp;
            <AnchorList items={occupationsBorn.splice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_born})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />,&nbsp;
            while most who died were&nbsp;
            <AnchorList items={occupationsDied.splice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_died})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />.
          </p>
        </div>
        <VizWrapper component={this} refKey="occAliveTmapViz">
          <Treemap
            key="occAliveTmapViz"
            config={{
              title: `Occupations of People Born in present day ${place.place}`,
              total: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0,
              data: tmapBornData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              // time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.occupation.occupation_slug)
            }} />
        </VizWrapper>
        <VizWrapper component={this} refKey="occDeadTmapViz">
          <Treemap
            key="occDeadTmapViz"
            config={{
              title: `Occupations of People Deceased in present day ${place.place}`,
              total: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0,
              data: tmapDeathData,
              depth: 2,
              groupBy: ["domain", "industry", "occupation_name"].map(groupBy(attrs)),
              on: on("occupation", d => d.occupation.occupation_slug),
              shapeConfig: shapeConfig(attrs),
              // time: "deathyear",
              tooltipConfig: groupTooltip(tmapDeathData, d => d.occupation.occupation_slug)
            }} />
        </VizWrapper>
      </div>
    </section>
  );
};

export default Occupations;
