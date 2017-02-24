import React, {Component, PropTypes} from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";
import {plural} from "pluralize";
import {FORMATTERS} from "types";

const Places = ({ people, occupation }) => {
  const countriesBorn = nest()
    .key(p => p.birthcountry.id)
    .rollup(function(leaves) { return {num_people:leaves.length, birthcountry:leaves[0].birthcountry}; })
    .entries(people.filter(p => p.birthcountry))
    .sort(function (a, b) { return b.value.num_people-a.value.num_people });
  const placesBorn = nest()
    .key(p => p.birthplace.id)
    .rollup(function(leaves) { return {num_people:leaves.length, birthplace:leaves[0].birthplace}; })
    .entries(people.filter(p => p.birthplace))
    .sort(function (a, b) { return b.value.num_people-a.value.num_people });

    const countriesDied = nest()
      .key(p => p.deathcountry.id)
      .rollup(function(leaves) { return {num_people:leaves.length, deathcountry:leaves[0].deathcountry}; })
      .entries(people.filter(p => p.deathcountry))
      .sort(function (a, b) { return b.value.num_people-a.value.num_people });
    const placesDied = nest()
      .key(p => p.deathplace.id)
      .rollup(function(leaves) { return {num_people:leaves.length, deathplace:leaves[0].deathplace}; })
      .entries(people.filter(p => p.deathplace))
      .sort(function (a, b) { return b.value.num_people-a.value.num_people });

  return (
    <div>
      <p>
        Most {plural(occupation.occupation)} were born in the countries <AnchorList items={countriesBorn.slice(0, 3)} name={d => `${d.value.birthcountry.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthcountry.slug}/`} />.
        Broken down by city, the most common birth places were <AnchorList items={placesBorn.slice(0, 3)} name={d => `${d.value.birthplace.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthplace.slug}/`} />.

        By contrast, the most common death places of {plural(occupation.occupation)} were <AnchorList items={countriesDied.slice(0, 3)} name={d => `${d.value.deathcountry.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.deathcountry.slug}/`} />.
        By city, these were <AnchorList items={placesDied.slice(0, 3)} name={d => `${d.value.deathplace.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.deathplace.slug}/`} />.
      </p>
    </div>
  );
};

Places.propTypes = {
  occupation: PropTypes.object
};

export default Places;
