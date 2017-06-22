import React from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";
import {plural} from "pluralize";

const Occupations = ({place, peopleBorn, peopleDied}) => {
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
    <div>
      <p>
        Most individuals born in {place.name} were&nbsp;
        <AnchorList items={occupationsBorn.splice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_born})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />,&nbsp;
        while most who died were&nbsp;
        <AnchorList items={occupationsDied.splice(0, 5)} name={d => `${plural(d.occupation.occupation)} (${d.num_died})`} url={d => `/profile/occupation/${d.occupation.occupation_slug}`} />.
      </p>
    </div>
  );
};

export default Occupations;
