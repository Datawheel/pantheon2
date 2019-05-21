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
    .key(p => p.bplace_country.id)
    .rollup(leaves => ({num_people: leaves.length, bplace_country: leaves[0].bplace_country}))
    .entries(people.filter(p => p.bplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesBorn = nest()
    .key(p => p.bplace_geonameid.id)
    .rollup(leaves => ({num_people: leaves.length, bplace_geonameid: leaves[0].bplace_geonameid}))
    .entries(people.filter(p => p.bplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  const countriesDied = nest()
    .key(p => p.dplace_country.id)
    .rollup(leaves => ({num_people: leaves.length, dplace_country: leaves[0].dplace_country}))
    .entries(people.filter(p => p.dplace_country))
    .sort((a, b) => b.value.num_people - a.value.num_people);
  const placesDied = nest()
    .key(p => p.dplace_geonameid.id)
    .rollup(leaves => ({num_people: leaves.length, dplace_geonameid: leaves[0].dplace_geonameid}))
    .entries(people.filter(p => p.dplace_geonameid))
    .sort((a, b) => b.value.num_people - a.value.num_people);

  // console.log("people", people);
  const tmapBornData = people
    .filter(p => p.birthyear !== null && p.bplace_country && p.bplace_country.country && p.bplace_country.continent)
    .sort((a, b) => b.l - a.l)
    .map(d => ({...d, borncountry: d.bplace_country.country, borncontinent: d.bplace_country.continent}));

  const tmapDeathData = people
    .filter(p => p.deathyear !== null && p.dplace_country && p.dplace_country.country && p.dplace_country.continent)
    .sort((a, b) => b.l - a.l)
    .map(d => ({...d, diedcountry: d.dplace_country.country, diedcontinent: d.dplace_country.continent}));

  return (
    <section className="profile-section">
      <SectionHead title="Places" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Most {plural(occupation.occupation)} were born in <AnchorList items={countriesBorn.slice(0, 3)} name={d => `${d.value.bplace_country.country} (${d.value.num_people})`} url={d => `/profile/country/${d.value.bplace_country.slug}/`} />.
            By city, the most common birth places were <AnchorList items={placesBorn.slice(0, 3)} name={d => `${d.value.bplace_geonameid.place} (${d.value.num_people})`} url={d => `/profile/place/${d.value.bplace_geonameid.slug}/`} />.
            {tmapDeathData.length
              ? <React.Fragment>The most common death places of {plural(occupation.occupation)} were <AnchorList items={countriesDied.slice(0, 3)} name={d => `${d.value.dplace_country.country} (${d.value.num_people})`} url={d => `/profile/country/${d.value.dplace_country.slug}/`} />. By city, these were <AnchorList items={placesDied.slice(0, 3)} name={d => `${d.value.dplace_geonameid.place} (${d.value.num_people})`} url={d => `/profile/place/${d.value.dplace_geonameid.slug}/`} />.</React.Fragment>
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
              on: on("place", d => d.bplace_country.slug),
              legendConfig: {
                label: d => d.borncontinent
              },
              shapeConfig: {fill: d => COLORS_CONTINENT[d.borncontinent]},
              // time: "birthyear",
              tooltipConfig: groupTooltip(tmapBornData, d => d.bplace_country.slug),
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
                on: on("place", d => d.dplace_country.slug),
                legendConfig: {
                  label: d => d.diedcontinent
                },
                shapeConfig: {fill: d => COLORS_CONTINENT[d.diedcontinent]},
                // time: "deathyear",
                tooltipConfig: groupTooltip(tmapBornData, d => d.dplace_country.slug),
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
