import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import PersonImage from "components/utils/PersonImage";
import { FORMATTERS } from "types";

const CountryRanking = ({ person, ranking }) => {

  let betterBirthPeers = null,
      worseBirthPeers = null,
      betterDeathPeers = null,
      worseDeathPeers = null,
      deathcountryRanking;

  const birthcountryRanking = Object.assign({}, ranking.birthcountryPeers, {
    betterPeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique < ranking.me.birthcountry_rank_unique),
    worsePeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique > ranking.me.birthcountry_rank_unique)
  });

  if(birthcountryRanking.betterPeers.length){
    betterBirthPeers = <span>Before { person.gender ? "her" : "him" } are {<AnchorList items={birthcountryRanking.betterPeers} name={(d) => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={(d) => `/profile/person/${d.slug}/`} />}. </span>
  }
  if(birthcountryRanking.worsePeers.length){
    worseBirthPeers = <span>After { person.gender ? "her" : "him" } are {<AnchorList items={birthcountryRanking.worsePeers} name={(d) => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={(d) => `/profile/person/${d.slug}/`} />}.</span>
  }

  if(ranking.deathcountryPeers.length){
    deathcountryRanking = Object.assign({}, ranking.deathcountryPeers, {
      betterPeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique < ranking.me.deathcountry_rank_unique),
      worsePeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique > ranking.me.deathcountry_rank_unique)
    });
    if(deathcountryRanking.betterPeers.length){
      betterDeathPeers = <span>Before { person.gender ? "her" : "him" } are {<AnchorList items={deathcountryRanking.betterPeers} name={(d) => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={(d) => `/profile/person/${d.slug}/`} />}. </span>
    }
    if(deathcountryRanking.worsePeers.length){
      worseDeathPeers = <span>After { person.gender ? "her" : "him" } are {<AnchorList items={deathcountryRanking.worsePeers} name={(d) => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={(d) => `/profile/person/${d.slug}/`} />}.</span>
    }
  }

  // return (<div>testing...</div>)
  return (
    <div>
      <p>
        Among people born in {person.birthcountry.name}, {person.name} ranks <a>{ranking.me.birthcountry_rank}</a> out of {person.birthcountry.num_born}.&nbsp;
        { betterBirthPeers }
        { worseBirthPeers }
        { ranking.deathcountryPeers.length ?
          <span>&nbsp;Among people deceased in {person.deathcountry.name}, {person.name} ranks {ranking.me.deathcountry_rank_unique} out of {person.deathcountry.num_died}.&nbsp;</span>
          : null}
        { betterDeathPeers }
        { worseDeathPeers }
      </p>
      <div className={'rank-title'}>
        <h3>Others born in {person.birthcountry.name}</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <div className={'rank-carousel'}>
        <ul className={'rank-list'}>
          {ranking.birthcountryPeers.map((peer) =>
            <li key={peer.id} className={ranking.me.birthcountry_rank_unique === peer.birthcountry_rank_unique ? 'rank-me' : null}>
              <div className={'rank-photo'}>
                <a href={`/profile/person/${peer.slug}/`}>
                  <PersonImage src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
                </a>
              </div>
              <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
              <p className={'rank-year'}>{FORMATTERS.year(peer.birthyear)} - {peer.deathyear ? `${FORMATTERS.year(peer.deathyear)}` : 'Present'}</p>
              <p className={'rank-num'}>Rank <span>{peer.birthcountry_rank}</span></p>
            </li>
          )}
        </ul>
      </div>
      { ranking.deathcountryPeers.length ?
        <div className={'rank-sec-body'}>
          <div className={'rank-title'}>
            <h3>Others deceased in {person.deathcountry.name}</h3>
            <a href='#'>Go to all Rankings</a>
          </div>
          <div className={'rank-carousel'}>
            <ul className={'rank-list'}>
              {ranking.deathcountryPeers.map((peer) =>
                <li key={peer.id} className={ranking.me.deathcountry_rank_unique === peer.deathcountry_rank_unique ? 'rank-me' : null}>
                  <div className={'rank-photo'}>
                    <a href={`/profile/person/${peer.slug}/`}>
                      <PersonImage src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
                    </a>
                  </div>
                  <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
                  <p className={'rank-year'}>{FORMATTERS.year(peer.birthyear)} - {peer.deathyear ? `${FORMATTERS.year(peer.deathyear)}` : 'Present'}</p>
                  <p className={'rank-num'}>Rank <span>{peer.deathcountry_rank}</span></p>
                </li>
              )}
            </ul>
          </div>
        </div>
        : null }
    </div>
  )
}

export default CountryRanking;
