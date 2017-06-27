import React from "react";
import {nest} from "d3-collection";
import {plural} from "pluralize";
import {FORMATTERS} from "types";
import AnchorList from "components/utils/AnchorList";

const PlacesTime = ({eras, people, occupation}) => {
  people = people
            .filter(p => p.birthyear)
            .sort((a, b) => b.birthyear - a.birthyear);
  people.forEach(p => {
    const thisEra = eras.filter(e => p.birthyear >= e.start_year && p.birthyear <= e.end_year);
    p.era = thisEra.length ? thisEra[0].id : null;
  });
  const oldestPeople = people.slice(Math.max(people.length - 3, 1));
  // const oldestPlace = oldestPerson.birthplace;
  const youngestPerson = people[1];
  const youngestPlace = youngestPerson.birthplace;
  const peopleByEra = nest()
    .key(p => p.era)
    .entries(people.filter(p => p.era))
    .sort((a, b) => b.values.length - a.values.length);
  const eraWithMostPeople = eras.filter(e => e.id.toString() === peopleByEra[0].key)[0];

  return (
    <div>
      <p>
        The first {plural(occupation.occupation)} in Pantheon are <AnchorList items={oldestPeople} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.&nbsp;
        The concentration of {plural(occupation.occupation)} was largest during the <a href={`/profile/era/${eraWithMostPeople.slug}`}>{eraWithMostPeople.name}</a>, which lasted from {FORMATTERS.year(eraWithMostPeople.start_year)} to {FORMATTERS.year(eraWithMostPeople.end_year)}.
        Some birth or death locations for earlier {plural(occupation.occupation)} are unknown, which may account for timeline differences below.
      </p>
    </div>
  );
};

export default PlacesTime;
