import React, {Component} from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";
import {plural} from "pluralize";
import {FORMATTERS} from "types";

const PlacesTime = ({ people, occupation }) => {
  const countriesBorn = nest()
    .key(p => p.birthcountry.id)
    .rollup(function(leaves) { return {num_people:leaves.length, birthcountry:leaves[0].birthcountry}; })
    .entries(people.filter(p => p.birthcountry))
    .sort(function (a, b) { return b.value.num_people-a.value.num_people });

  const oldestBirthyear = Math.min(...people.filter(p => p.birthyear).map(r => r.birthyear));

  return (
    <div>
      <p>
        The first globally memorable {occupation.occupation} in Pantheon was born in <a href="#">_(oldestBirthPlace)_</a> in {FORMATTERS.year(oldestBirthyear)}, making {plural(occupation.occupation)} the _(number)th_ oldest occupation. The concentration of {plural(occupation.occupation)} was largest during the <a href="#">_(Scribal Era)_</a>, which lasted between _(start year)_ to _(end year)_.
      </p>
    </div>
  );
}

export default PlacesTime;
