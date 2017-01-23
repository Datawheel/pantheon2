import React, { Component } from 'react';
import PersonImage from "components/utils/PersonImage";
import {COLORS_DOMAIN, FORMATTERS} from "types";

const PhotoCarousel = ({ people }) => {

  return (<div className={'rank-carousel'}>
    <ul className={'rank-list'}>
      {people.map((person, index) =>
        <li key={person.id}>
          <div className={'rank-photo'}>
            <a href={`/profile/person/${person.slug}/`}>
              <PersonImage src={`/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} color={COLORS_DOMAIN[person.occupation.domain_slug]} />
            </a>
          </div>
          <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
          <p className={'rank-year'}>{FORMATTERS.year(person.birthyear)} - {person.deathyear ? `${FORMATTERS.year(person.deathyear)}` : 'Present'}</p>
        </li>
      )}
    </ul>
  </div>);

}

export default PhotoCarousel;
