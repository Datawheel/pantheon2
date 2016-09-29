import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const PeopleRanking = ({ ranking }) => {
  // console.log(ranking)
  // return (<div>rankking here...</div>)
  return (
    <div>
      <div>
        {ranking.map((person) =>
          <li key={person.id}>
            <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
            <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
            <p>{person.birthyear} - {person.deathyear}</p>
          </li>
        )}
      </div>
    </div>
  )
}

export default PeopleRanking;
