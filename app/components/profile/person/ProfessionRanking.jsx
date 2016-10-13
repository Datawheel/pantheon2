import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const ProfessionRanking = ({ person, ranking }) => {

  ranking = Object.assign({}, ranking, {
    betterPeers: ranking.peers.filter(p => p.profession_rank_unique < ranking.me.profession_rank_unique),
    worsePeers: ranking.peers.filter(p => p.profession_rank_unique > ranking.me.profession_rank_unique)
  });

  let betterPeers = null,
      worsePeers = null;

  if(ranking.betterPeers.length){
    betterPeers = <span>Before { person.gender ? "her" : "him" } are: <AnchorList items={ranking.betterPeers} name={(d) => `${d.name} (${d.birthcountry.country_code.toUpperCase()})`} url={(d) => `/profile/person/${d.slug}/`} />. </span>
  }
  if(ranking.worsePeers.length){
    worsePeers = <span>After { person.gender ? "her" : "him" } are: <AnchorList items={ranking.worsePeers} name={(d) => `${d.name} (${d.birthcountry.country_code.toUpperCase()})`} url={(d) => `/profile/person/${d.slug}/`} />.</span>
  }

  return (
    <div>
      <p>
        Among {person.profession.name}, {person.name} ranks {ranking.me.rank_unique} out of {person.profession.num_born}.&nbsp;
        { betterPeers }
        { worsePeers }
      </p>
      <div>
        {ranking.peers.map((peer) =>
          <li key={peer.id}>
            <img src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
            <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
            <p>{peer.birthyear} - {peer.deathyear}</p>
            <p>Rank: {peer.profession_rank}</p>
          </li>
        )}
      </div>
    </div>
  )
}

export default ProfessionRanking;
