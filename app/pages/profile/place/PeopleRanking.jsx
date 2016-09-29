import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const PeopleRanking = ({ ranking }) => {

  return (
    <div>
      <div>
        {ranking.map((peer) =>
          <li key={peer.person.id}>
            <img src={`/people/${peer.person.wiki_id}.jpg`} alt={`Photo of ${peer.person.name}`} />
            <h2><a href={`/profile/person/${peer.person.slug}/`}>{peer.person.name}</a></h2>
            <p>{peer.person.birthyear} - {peer.person.deathyear}</p>
            <p>Rank: {peer.rank}</p>
          </li>
        )}
      </div>
    </div>
  )
}

export default PeopleRanking;
