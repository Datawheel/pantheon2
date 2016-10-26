import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import PhotoCarousel from 'components/utils/PhotoCarousel';
import { FORMATTERS } from "types";
import { plural } from 'pluralize';

const People = ({ people, profession }) => {

  const youngestBirthyear = Math.max.apply(Math, people.map(r => r.birthyear));
  const oldestBirthyear = Math.min.apply(Math, people.map(r => r.birthyear));
  const shareAlive = people.filter(p => p.alive).length / people.length;
  console.log(youngestBirthyear, oldestBirthyear, shareAlive)


  // return <div>People ranking here...</div>
  return (
    <div>
      <p>
        Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}, there have been {people.length} globally memorable {profession.name}, with {FORMATTERS.share(shareAlive)} alive.
        The most globally memorable living {plural(profession.name)} are <AnchorList items={people.filter(p => p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.
        By contract, the most memorable deceased {plural(profession.name)} are <AnchorList items={people.filter(p => !p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.
      </p>
    </div>
  );

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  return (
    <div>
      <p>
        { oldestBirthyear == youngestBirthyear ? <span>In {FORMATTERS.year(oldestBirthyear)}</span> : <span>Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}</span> }, {place.name} was the birth place of {peopleBorn.length} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {peopleDied.length} globally memorable people have passed away in {place.name} including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. { moreDeaths ? `Interestingly, more notably known people have passed away in ${place.name} than were born there.`: null}</span> : null }
      </p>
      <div className={'rank-title'}>
        <h3>People Born in {place.name}</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <PhotoCarousel people={topRankingBorn} />
      { topRankingDied.length ?
        <div className={'rank-sec-body'}>
          <div className={'rank-title'}>
            <h3>People Deceased in {place.name}</h3>
            <a href='#'>Go to all Rankings</a>
          </div>
          <PhotoCarousel people={topRankingDied} />
        </div> : null }
    </div>
  )
}

export default People;
