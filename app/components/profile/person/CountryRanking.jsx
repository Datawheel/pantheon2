import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";

class CountryRanking extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    const {person, ranking} = this.props;
    let betterBirthPeers = null,
        betterDeathPeers = null,
        deathcountryRanking,
        worseBirthPeers = null,
        worseDeathPeers = null;

    const birthcountryRanking = Object.assign({}, ranking.birthcountryPeers, {
      betterPeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique < ranking.me.birthcountry_rank_unique),
      worsePeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique > ranking.me.birthcountry_rank_unique)
    });

    if (birthcountryRanking.betterPeers.length) {
      betterBirthPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={birthcountryRanking.betterPeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (birthcountryRanking.worsePeers.length) {
      worseBirthPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={birthcountryRanking.worsePeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    if (ranking.deathcountryPeers.length) {
      deathcountryRanking = Object.assign({}, ranking.deathcountryPeers, {
        betterPeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique < ranking.me.deathcountry_rank_unique),
        worsePeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique > ranking.me.deathcountry_rank_unique)
      });
      if (deathcountryRanking.betterPeers.length) {
        betterDeathPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={deathcountryRanking.betterPeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}. </span>;
      }
      if (deathcountryRanking.worsePeers.length) {
        worseDeathPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={deathcountryRanking.worsePeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}.</span>;
      }
    }

    return (
      <div>
        <p>
          Among people born in <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a>, {person.name} ranks <a>{ranking.me.birthcountry_rank}</a> out of {person.birthcountry.num_born}.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
          { ranking.deathcountryPeers.length ?
            <span>&nbsp;Among people deceased in <a href={`/profile/place/${person.deathcountry.slug}`}>{person.deathcountry.name}</a>, {person.name} ranks {ranking.me.deathcountry_rank_unique} out of {person.deathcountry.num_died}.&nbsp;</span>
            : null}
          { betterDeathPeers }
          { worseDeathPeers }
        </p>
        <div className="rank-title">
          <h3>Others born in <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a></h3>
          <a href="/explore/rankings">Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={ranking.birthcountryPeers} rankAccessor="birthcountry_rank_unique" />
        { ranking.deathcountryPeers.length ?
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others deceased in <a href={`/profile/place/${person.deathcountry.slug}`}>{person.deathcountry.name}</a></h3>
              <a href="/explore/rankings">Go to all Rankings</a>
            </div>
            <PhotoCarousel me={person} people={ranking.deathcountryPeers} rankAccessor="deathcountry_rank_unique" />
          </div>
          : null }
      </div>
    );
  }
}

export default CountryRanking;
