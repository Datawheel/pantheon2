import React, { Component } from 'react';
import { FORMATTERS } from "types";

const PhotoCarousel = ({ people }) => {
  return (<ul className={'rank-list'}>
    {people.map((person, index) =>
      <li key={person.id}>
        <div className={'rank-photo'}>
          <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
        </div>
        <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
        <p className={'rank-year'}>{FORMATTERS.year(person.birthyear)} - {person.deathyear ? `${FORMATTERS.year(person.deathyear)}` : 'Present'}</p>
      </li>
    )}
  </ul>)
}

export default PhotoCarousel;
