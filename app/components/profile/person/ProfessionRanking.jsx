import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import PersonImage from "components/utils/PersonImage";
import { FORMATTERS } from "types";

const ProfessionRanking = ({ person, ranking }) => {

  ranking = Object.assign({}, ranking, {
    betterPeers: ranking.peers.filter(p => p.profession_rank_unique < ranking.me.profession_rank_unique),
    worsePeers: ranking.peers.filter(p => p.profession_rank_unique > ranking.me.profession_rank_unique)
  });

  let betterPeers = null,
      worsePeers = null;

  if(ranking.betterPeers.length){
    betterPeers = <span>Before { person.gender ? "her" : "him" } are <AnchorList items={ranking.betterPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />. </span>
  }
  if(ranking.worsePeers.length){
    worsePeers = <span>After { person.gender ? "her" : "him" } are <AnchorList items={ranking.worsePeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={(d) => `/profile/person/${d.slug}/`} />.</span>
  }

  return (
    <div>
      <p>
        Among {person.profession.name}s, {person.name} ranks <a>{ranking.me.profession_rank}</a> out of {person.profession.num_born}.&nbsp;
        { betterPeers }
        { worsePeers }
      </p>
      <div className={'rank-title'}>
        <h3>Top Global {person.profession.name}s</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <div className={'rank-carousel'}>
        <ul className={'rank-list'}>
          {ranking.peers.map((peer) =>
            <li key={peer.id} className={ranking.me.profession_rank_unique === peer.profession_rank_unique ? 'rank-me' : null}>
              <div className={'rank-photo'}>
                <a href={`/profile/person/${peer.slug}/`}>
                  <PersonImage src={`/people/${peer.wiki_id}.jpg`} alt={`Photo of ${peer.name}`} />
                </a>
              </div>
              <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
              <p className={'rank-year'}>{FORMATTERS.year(peer.birthyear)} - {peer.deathyear ? `${FORMATTERS.year(peer.deathyear)}` : 'Present'}</p>
              <p className={'rank-prof'}>{peer.profession.name}</p>
              <p className={'rank-num'}>Rank <span>{peer.profession_rank}</span></p>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ProfessionRanking;
