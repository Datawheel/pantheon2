import React from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";

const OccupationTrends = ({place, peopleBorn, peopleDied, occupations}) => {

  const currentYear = new Date().getFullYear();
  const topModern = nest()
    .key(function(d) { return d.occupation.id; })
    .sortValues((a, b) => b.langs-a.langs)
    .entries(peopleBorn.filter(d => d.birthyear >= (currentYear-100)))
    .sort(function (a, b) { return b.values.length-a.values.length });
  const topOverall = nest()
    .key(function(d) { return d.occupation.id; })
    .sortValues((a, b) => b.langs-a.langs)
    .entries(peopleBorn)
    .sort(function (a, b) { return b.values.length-a.values.length });
  const occupationsLookup = occupations.reduce(function(obj, item){
        obj[item.id] = item;
        return obj;
    },{});

  if(!topOverall.length && !topModern.length){
    return null;
  }

  if(!topModern.length){
    return (
      <div>
        <p>
          Throughout history the profession with the most memorable people from {place.name} has been {occupationsLookup[topOverall[0].key].name}, including <AnchorList items={topOverall[0].values.slice(0, 3)} name={d => d.name} url={(d) => `/profile/person/${d.slug}`} />.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Over the past 100 years the top profession of globally memorable people from {place.name} has been {occupationsLookup[topModern[0].key].name}, including <AnchorList items={topModern[0].values.slice(0, 3)} name={d => d.name} url={(d) => `/profile/person/${d.slug}`} />. Whereas throughout history the profession with the most memorable people from {place.name} has been {occupationsLookup[topOverall[0].key].name}, including <AnchorList items={topOverall[0].values.slice(0, 3)} name={d => d.name} url={(d) => `/profile/person/${d.slug}`} />.
      </p>
    </div>
  );
}

export default OccupationTrends;
