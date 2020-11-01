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
    const meBc = ranking.find(rank => rank.slug === person.slug);
    let betterBirthPeers = null, worseBirthPeers = null;
    const betterDeathPeers = null;

    // const birthcountryRanking = Object.assign({}, ranking.birthcountryPeers, {
    //   betterPeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique < ranking.me.birthcountry_rank_unique),
    //   worsePeers: ranking.birthcountryPeers.filter(p => p.birthcountry_rank_unique > ranking.me.birthcountry_rank_unique)
    // });
    const betterRankedBirthPeers = ranking.filter(p => p.bplace_country_rank_unique < meBc.bplace_country_rank_unique);
    const worseRankedBirthPeers = ranking.filter(p => p.bplace_country_rank_unique > meBc.bplace_country_rank_unique);

    if (betterRankedBirthPeers.length) {
      betterBirthPeers = <span>Before {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={betterRankedBirthPeers} name={d => `${d.name} (${d.birthyear})`} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (worseRankedBirthPeers.length) {
      worseBirthPeers = <span>After {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={worseRankedBirthPeers} name={d => `${d.name} (${d.birthyear})`} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    // if (ranking.deathcountryPeers.length) {
    //   deathcountryRanking = Object.assign({}, ranking.deathcountryPeers, {
    //     betterPeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique < ranking.me.deathcountry_rank_unique),
    //     worsePeers: ranking.deathcountryPeers.filter(p => p.deathcountry_rank_unique > ranking.me.deathcountry_rank_unique)
    //   });
    //   if (deathcountryRanking.betterPeers.length) {
    //     betterDeathPeers = <span>Before {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={deathcountryRanking.betterPeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    //   }
    //   if (deathcountryRanking.worsePeers.length) {
    //     worseDeathPeers = <span>After {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={deathcountryRanking.worsePeers} name={d => `${d.name} (${FORMATTERS.year(d.birthyear)})`} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    //   }
    // }

    return (
      <div>
        <p>
          Among people born in <a href={`/profile/country/${person.bplace_country.slug}`}>{person.bplace_country.country}</a>, {person.name} ranks <a>{FORMATTERS.commas(meBc.bplace_country_rank_unique)}</a> out of {FORMATTERS.commas(person.bplace_country.num_born)}.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
          {/* { ranking.deathcountryPeers.length
            ? <span>&nbsp;Among people deceased in <a href={`/profile/country/${person.deathcountry.slug}`}>{person.deathcountry.name}</a>, {person.name} ranks {ranking.me.deathcountry_rank_unique} out of {person.deathcountry.num_died}.&nbsp;</span>
            : null} */}
          { betterDeathPeers }
        </p>
        <div className="rank-title">
          <h3>Others born in <a href={`/profile/country/${person.bplace_country.slug}`}>{person.bplace_country.country}</a></h3>
          <a href={`/explore/rankings?show=people&place=${person.bplace_country.country_code}`}>Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={ranking} rankAccessor="bplace_country_rank_unique" />
        {/* { ranking.deathcountryPeers.length
          ? <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others deceased in <a href={`/profile/country/${person.deathcountry.slug}`}>{person.deathcountry.name}</a></h3>
              <a href="/explore/rankings">Go to all Rankings</a>
            </div>
            <PhotoCarousel me={person} people={ranking.deathcountryPeers} rankAccessor="deathcountry_rank_unique" />
          </div>
          : null } */}
      </div>
    );
  }
}

export default CountryRanking;
