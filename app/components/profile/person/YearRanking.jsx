import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PersonImage from "components/utils/PersonImage";
import {FORMATTERS} from "types";

class YearRanking extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {rankListBorn, rankListDead} = this.refs;
    rankListBorn.scrollLeft = 700;
    if (rankListDead) rankListDead.scrollLeft = 780;
  }

  render() {

    const {person, ranking} = this.props;

    let betterBirthPeers = null,
        betterDeathPeers = null,
        deathyearRanking,
        worseBirthPeers = null,
        worseDeathPeers = null;

    const birthyearRanking = Object.assign({}, ranking.birthyearPeers, {
      betterPeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique < ranking.me.birthyear_rank_unique),
      worsePeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique > ranking.me.birthyear_rank_unique)
    });

    if (birthyearRanking.betterPeers.length) {
      betterBirthPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={birthyearRanking.betterPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (birthyearRanking.worsePeers.length) {
      worseBirthPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={birthyearRanking.worsePeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    if (ranking.deathyearPeers.length) {
      deathyearRanking = Object.assign({}, ranking.deathyearPeers, {
        betterPeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique < ranking.me.deathyear_rank_unique),
        worsePeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique > ranking.me.deathyear_rank_unique)
      });
      if (deathyearRanking.betterPeers.length) {
        betterDeathPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={deathyearRanking.betterPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
      }
      if (deathyearRanking.worsePeers.length) {
        worseDeathPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={deathyearRanking.worsePeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
      }
    }


    return (
      <div>
        <p>
          Among people born in {FORMATTERS.year(person.birthyear.name)}, {person.name} ranks <a>{ranking.me.birthyear_rank}</a> out of {person.birthyear.num_born}.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
          { ranking.deathyearPeers.length ?
            <span>&nbsp;Among people deceased in {FORMATTERS.year(person.deathyear.name)}, {person.name} ranks <a>{ranking.me.deathyear_rank}</a> out of {person.deathyear.num_died}.&nbsp;</span>
            : null}
          { betterDeathPeers }
          { worseDeathPeers }
        </p>
        <div className="rank-title">
          <h3>Others Born in {FORMATTERS.year(person.birthyear.name)}</h3>
          <a href="/explore/rankings">Go to all Rankings</a>
        </div>
        <div className="rank-carousel">
          <ul className="rank-list" ref="rankListBorn">
            {ranking.birthyearPeers.map(peer =>
              <li key={peer.id} className={ranking.me.birthyear_rank_unique === peer.birthyear_rank_unique ? "rank-me" : null}>
                <div className="rank-photo">
                  <a href={`/profile/person/${peer.slug}/`}>
                    <PersonImage src={`/people/${peer.id}.jpg`} alt={`Photo of ${peer.name}`} />
                  </a>
                </div>
                <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
                <p className="rank-year">{FORMATTERS.year(peer.birthyear)} - {peer.deathyear ? `${FORMATTERS.year(peer.deathyear)}` : "Present"}</p>
                <p className="rank-num">Rank <span>{peer.birthyear_rank_unique}</span></p>
              </li>
            )}
          </ul>
        </div>
        { ranking.deathyearPeers.length ?
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others Deceased in {FORMATTERS.year(person.deathyear.name)}</h3>
              <a href="/explore/rankings">Go to all Rankings</a>
            </div>
            <div className="rank-carousel">
              <ul className="rank-list" ref="rankListDead">
                {ranking.deathyearPeers.map(peer =>
                  <li key={peer.id} className={ranking.me.deathyear_rank_unique === peer.deathyear_rank_unique ? "rank-me" : null}>
                    <div className="rank-photo">
                      <a href={`/profile/person/${peer.slug}/`}>
                        <PersonImage src={`/people/${peer.id}.jpg`} alt={`Photo of ${peer.name}`} />
                      </a>
                    </div>
                    <h2><a href={`/profile/person/${peer.slug}/`}>{peer.name}</a></h2>
                    <p className="rank-year">{FORMATTERS.year(peer.birthyear)} - {peer.deathyear ? `${FORMATTERS.year(peer.deathyear)}` : "Present"}</p>
                    <p className="rank-num">Rank <span>{peer.deathyear_rank_unique}</span></p>
                  </li>
                )}
              </ul>
            </div>
          </div>
          : null }
      </div>
    );
  }
};

export default YearRanking;
