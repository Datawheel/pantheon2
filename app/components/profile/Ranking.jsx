import React, { Component, PropTypes } from 'react';

const PersonAnchor = ({ person, type }) => {
  return (
    <a href={`/profile/person/${person.id}/`}>{person.name} ({ type === "birthcountry" ? person.birthyear : person.birthcountry.toUpperCase()})</a>
  )
}

const PeerList = ({ peers }) => {
  return (<span>
    {peers.map((peer, index) =>
      <span key={index}>
       { (index && index === peers.length-1) ? " and " : null }
       <PersonAnchor person={peer.person} type="profession" />
       { peers.length !== 2 ? index < peers.length-1 ? ", " : null : null }
      </span>
    )}
  </span>)
}

const Ranking = ({ person, rankings, type }) => {

  rankings = rankings.map((ranking) => {
    return Object.assign({}, ranking, {
      betterPeers: ranking.peers.filter(p => p.rank_unique < ranking.me.rank_unique),
      worsePeers: ranking.peers.filter(p => p.rank_unique > ranking.me.rank_unique)
    });
  });

  return (
    <div>
      {rankings.map((ranking, i) =>
      <div key={i}>
        <p>
        Among {type !== "profession" ? "people born in" : null} {type === "birthyear" ? person[type].name : person[type].name}, {person.name} ranks {ranking.me.rank_unique} out of {person[type].num_born}.&nbsp;
        { ranking.betterPeers.length ? `Before ${person.gender ? "her" : "him"} are:` : null } { ranking.betterPeers.length ? <PeerList peers={ranking.betterPeers} /> : null }{ ranking.betterPeers.length ? ". " : null }
        { ranking.worsePeers.length ? `After ${person.gender ? "her" : "him"} are:` : null } { ranking.worsePeers.length ? <PeerList peers={ranking.worsePeers} /> : null }{ ranking.worsePeers.length ? "." : null }
        </p>
        <div>
          {ranking.peers.map((peer) =>
            <li key={peer.person.id}>
              <img src={`/people/${peer.person.id}.jpg`} alt={`Photo of ${peer.person.name}`} />
              <h2><a href={`/profile/person/${peer.person.id}/`}>{peer.person.name}</a></h2>
              <p>{peer.person.birthyear} - {peer.person.deathyear}</p>
              <p>Rank: {peer.rank}</p>
            </li>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

export default Ranking;
