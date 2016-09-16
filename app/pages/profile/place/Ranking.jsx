import React, { Component, PropTypes } from 'react';

const Ranking = ({ rankings }) => {

  return (
    <div>
      {rankings.map((ranking, i) =>
      <div key={i}>
        <div>
          {ranking.map((person, i) =>
            <li key={person.id}>
              <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
              <h2><a href={`/profile/person/${person.id}/`}>{person.name}</a></h2>
              <p>{person.birthyear} - {person.deathyear}</p>
              <p>Rank: {i+1}</p>
            </li>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default Ranking;
