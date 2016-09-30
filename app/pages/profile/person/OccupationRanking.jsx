import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const OccupationRanking = ({ person, ranking }) => {

  ranking = Object.assign({}, ranking, {
    betterPeers: ranking.peers.filter(p => p.rank_unique < ranking.me.rank_unique),
    worsePeers: ranking.peers.filter(p => p.rank_unique > ranking.me.rank_unique)
  });

  let betterPeers = null,
      worsePeers = null;

  if(ranking.betterPeers.length){
    betterPeers = <span>Before { person.gender ? "her" : "him" } are: <AnchorList items={ranking.betterPeers} name={(d) => `${d.person.name} (${d.person.birthcountry})`} url={(d) => `/profile/person/${d.person.slug}/`} />. </span>
  }
  if(ranking.worsePeers.length){
    worsePeers = <span>After { person.gender ? "her" : "him" } are: <AnchorList items={ranking.worsePeers} name={(d) => `${d.person.name} (${d.person.birthcountry})`} url={(d) => `/profile/person/${d.person.slug}/`} />.</span>
  }

  return (
    <div>
      <p>
        Among {person.occupation.name}, {person.name} ranks {ranking.me.rank_unique} out of {person.occupation.num_born}.&nbsp;
        { betterPeers }
        { worsePeers }
      </p>
      <div>
        {ranking.peers.map((peer) =>
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

export default OccupationRanking;
