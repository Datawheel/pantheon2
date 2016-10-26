import React, { Component, PropTypes } from 'react';
import {nest} from 'd3-collection';
import AnchorList from 'components/utils/AnchorList';
import { plural } from 'pluralize';
import { FORMATTERS } from 'types';

const Places = ({ people, profession }) => {
  const countriesBorn = nest()
    .key(p => p.birthcountry.id)
    .rollup(function(leaves) { return {num_people:leaves.length, birthcountry:leaves[0].birthcountry}; })
    .entries(people.filter(p => p.birthcountry))
    .sort(function (a, b) { return b.value.num_people-a.value.num_people });
  const placesBorn = nest()
    .key(p => p.birthplace.id)
    .rollup(function(leaves) { return {num_people:leaves.length, birthplace:leaves[0].birthplace}; })
    .entries(people.filter(p => p.birthcountry))
    .sort(function (a, b) { return b.value.num_people-a.value.num_people });
  
  return (
    <div>
      <p>
        Most {plural(profession.name)} were born in the countries <AnchorList items={countriesBorn.slice(0, 3)} name={d => `${d.value.birthcountry.name} (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthcountry.slug}/`} />.
        By city, most {plural(profession.name)} were born in <AnchorList items={placesBorn.slice(0, 3)} name={d => `${d.value.birthplace.name}  (${d.value.num_people})`} url={d => `/profile/place/${d.value.birthplace.slug}/`} />.
      </p>
    </div>
  );
}

Places.propTypes = {
  profession: PropTypes.object
};

export default Places;
