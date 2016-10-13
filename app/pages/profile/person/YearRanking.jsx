import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const YearRanking = ({ person, ranking }) => {

  let betterBirthPeers = null,
      worseBirthPeers = null,
      betterDeathPeers = null,
      worseDeathPeers = null,
      deathyearRanking;

  const birthyearRanking = Object.assign({}, ranking.birthyearPeers, {
    betterPeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique < ranking.me.birthyear_rank_unique),
    worsePeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique > ranking.me.birthyear_rank_unique)
  });

  if(birthyearRanking.betterPeers.length){
    betterBirthPeers = <span>Before { person.gender ? "her" : "him" } are: {<AnchorList items={birthyearRanking.betterPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />}. </span>
  }
  if(birthyearRanking.worsePeers.length){
    worseBirthPeers = <span>After { person.gender ? "her" : "him" } are: {<AnchorList items={birthyearRanking.worsePeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />}.</span>
  }

  if(ranking.deathyearPeers.length){
    deathyearRanking = Object.assign({}, ranking.deathyearPeers, {
      betterPeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique < ranking.me.deathyear_rank_unique),
      worsePeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique > ranking.me.deathyear_rank_unique)
    });
    if(deathyearRanking.betterPeers.length){
      betterDeathPeers = <span>Before { person.gender ? "her" : "him" } are: {<AnchorList items={deathyearRanking.betterPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />}. </span>
    }
    if(deathyearRanking.worsePeers.length){
      worseDeathPeers = <span>After { person.gender ? "her" : "him" } are: {<AnchorList items={deathyearRanking.worsePeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />}.</span>
    }
  }


  return (
    <div>
      <p>
        Among people born in {person.birthyear.name}, {person.name} ranks {ranking.me.birthyear_rank_unique} out of {person.birthyear.num_born}.&nbsp;
        { betterBirthPeers }
        { worseBirthPeers }
        { ranking.deathyearPeers.length ?
          <span>&nbsp;Among people deceased in {person.deathyear.name}, {person.name} ranks {ranking.me.deathyear_rank_unique} out of {person.deathyear.num_died}.&nbsp;</span>
          : null}
        { betterDeathPeers }
        { worseDeathPeers }
      </p>
      <div>
        {ranking.birthyearPeers.map((peer) =>
          <li key={peer.id}>
            <img src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
            <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
            <p>{peer.birthyear} - {peer.deathyear}</p>
            <p>Rank: {peer.birthyear_rank}</p>
          </li>
        )}
      </div>
      { ranking.deathyearPeers.length ?
        <div>
          <h3>People deceased in {person.deathyear.name}</h3>
          <div>
            {ranking.deathyearPeers.map((peer) =>
              <li key={peer.id}>
                <img src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
                <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
                <p>{peer.birthyear} - {peer.deathyear}</p>
                <p>Rank: {peer.deathyear_rank}</p>
              </li>
            )}
          </div>
        </div>
        : null }
    </div>
  )
}

export default YearRanking;
