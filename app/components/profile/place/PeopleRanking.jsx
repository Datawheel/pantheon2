import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import PhotoCarousel from 'components/utils/PhotoCarousel';
import { FORMATTERS } from "types";

const PeopleRanking = ({ place, peopleBorn, peopleDied }) => {
  const youngestBirthyear = Math.max.apply(Math, peopleBorn.map(r => r.birthyear));
  const oldestBirthyear = Math.min.apply(Math, peopleBorn.map(r => r.birthyear));
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 7);
  const topRankingDied = peopleDied.slice(0, 7);
  return (
    <div>
      <p>
        Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}, {place.name} was the birth place of {peopleBorn.length} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. Additionaly, {peopleDied.length} globally memorable people have passed away in {place.name} including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. { moreDeaths ? `Interestingly, more notably known people have passed away in ${place.name} than were born there.`: null}
      </p>
      <div className={'rank-title'}>
        <h3>People Born in {place.name}</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <PhotoCarousel people={topRankingBorn} />
      <div className={'rank-sec-body'}>
        <div className={'rank-title'}>
          <h3>People Deceased in {place.name}</h3>
          <a href='#'>Go to all Rankings</a>
        </div>
        <PhotoCarousel people={topRankingDied} />
      </div>
    </div>
  )
}

export default PeopleRanking;
