import React from "react";
import PropTypes from "prop-types";
import {nest} from "d3-collection";
import {Treemap} from "d3plus-react";
import AnchorList from "components/utils/AnchorList";
import SectionHead from "pages/profile/common/SectionHead";
import VizWrapper from "pages/profile/common/VizWrapper";
import {plural} from "pluralize";
import {groupTooltip, on} from "viz/helpers";
import {COLORS_CONTINENT} from "types";

const Places = ({people, occupation}) => {
  const countriesBorn = nest()
    .key(p => p.birthcountry.id)
    .rollup(leaves => ({num_people: leaves.length, birthcountry: leaves[0].birthcountry}))
    .entries(people.filter(p => p.birthcountry))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesBorn = nest()
    .key(p => p.birthplace.id)
    .rollup(leaves => ({num_people: leaves.length, birthplace: leaves[0].birthplace}))
    .entries(people.filter(p => p.birthplace))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const countriesDied = nest()
    .key(p => p.deathcountry.id)
    .rollup(leaves => ({num_people: leaves.length, deathcountry: leaves[0].deathcountry}))
    .entries(people.filter(p => p.deathcountry))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesDied = nest()
    .key(p => p.deathplace.id)
    .rollup(leaves => ({num_people: leaves.length, deathplace: leaves[0].deathplace}))
    .entries(people.filter(p => p.deathplace))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const tmapBornData = people
    .filter(p => p.birthyear !== null && p.birthcountry && p.birthcountry.country_name && p.birthcountry.continent)
    .sort((a, b) => b.langs - a.langs);

  tmapBornData.forEach(d => {
    d.borncountry = d.birthcountry.country_name;
    d.borncontinent = d.birthcountry.continent;
  });

  const tmapDeathData = people
    .filter(p => p.deathyear !== null && p.deathcountry && p.deathcountry.country_name && p.deathcountry.continent)
    .sort((a, b) => b.langs - a.langs);

  tmapDeathData.forEach(d => {
    d.diedcountry = d.deathcountry.country_name;
    d.diedcontinent = d.deathcountry.continent;
  });

  return (
    <section className="profile-section">
      <SectionHead title="Places" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Most {plural(occupation.occupation)} were born in <AnchorList items={countriesBorn.slice(0, 3)} name={d => `${d.value.birthcountry.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthcountry.slug}/`} />.
            By city, the most common birth places were <AnchorList items={placesBorn.slice(0, 3)} name={d => `${d.value.birthplace.place} (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthplace.slug}/`} />.
            {tmapDeathData.length
              ? <React.Fragment>The most common death places of {plural(occupation.occupation)} were <AnchorList items={countriesDied.slice(0, 3)} name={d => `${d.value.deathcountry.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.deathcountry.slug}/`} />. By city, these were <AnchorList items={placesDied.slice(0, 3)} name={d => `${d.value.deathplace.place} (${d.value.num_people})`} url={d => `/profile/place/${d.value.deathplace.slug}/`} />.</React.Fragment>
              : null}
          </p>
        </div>
        <VizWrapper component={this} refKey="viz">
          <Treemap
            key="tmap_country1"
            config={{
              title: `Birth Places of ${plural(occupation.occupation)}`,
              data: tmapBornData,
              depth: 1,
              groupBy: ["borncontinent", "borncountry"],
              on: on("place", d => d.birthcountry.slug),
              legendConfig: {
                label: d => d.borncontinent
              },
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              // time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.birthcountry.slug),
              sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
            }} />
        </VizWrapper>
        {tmapDeathData.length
          ? <VizWrapper component={this} refKey="viz2">
            <Treemap
              key="tmap_country2"
              config={{
                title: `Death Places of ${plural(occupation.occupation)}`,
                data: tmapDeathData,
                depth: 1,
                groupBy: ["diedcontinent", "diedcountry"],
                on: on("place", d => d.deathcountry.slug),
                legendConfig: {
                  label: d => d.diedcontinent
                },
                shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
                // time: "deathyear",
                tooltipConfig: groupTooltip(tmapBornData, d => d.deathcountry.slug),
                sum: d => d.id ? d.id instanceof Array ? d.id.length : 1 : 0
              }} />
          </VizWrapper>
          : null}
      </div>
    </section>
  );
};

Places.propTypes = {
  occupation: PropTypes.object
};

export default Places;
