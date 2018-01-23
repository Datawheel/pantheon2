import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
// import {FORMATTERS} from "types";
import {FORMATTERS} from "types/index";

class YearRanking extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {person, birthYearRanking, deathYearRanking} = this.props;
    const me = birthYearRanking.find(rank => rank.slug === person.slug);

    let betterBirthPeers = null,
        betterDeathPeers = null,
        worseBirthPeers = null,
        worseDeathPeers = null;

    // const birthyearRanking = Object.assign({}, birthYearRanking, {
    //   betterPeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique < ranking.me.birthyear_rank_unique),
    //   worsePeers: ranking.birthyearPeers.filter(p => p.birthyear_rank_unique > ranking.me.birthyear_rank_unique)
    // });
    const betterRankedBirthPeers = birthYearRanking.filter(p => p.birthyear_rank_unique < me.birthyear_rank_unique);
    const worseRankedBirthPeers = birthYearRanking.filter(p => p.birthyear_rank_unique > me.birthyear_rank_unique);

    if (betterRankedBirthPeers.length) {
      betterBirthPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={betterRankedBirthPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (worseRankedBirthPeers.length) {
      worseBirthPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={worseRankedBirthPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    if (deathYearRanking) {
      // deathyearRanking = Object.assign({}, ranking.deathyearPeers, {
      //   betterPeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique < ranking.me.deathyear_rank_unique),
      //   worsePeers: ranking.deathyearPeers.filter(p => p.deathyear_rank_unique > ranking.me.deathyear_rank_unique)
      // });
      const betterRankedDeathPeers = deathYearRanking.filter(p => p.deathyear_rank_unique < me.deathyear_rank_unique);
      const worseRankedDeathPeers = deathYearRanking.filter(p => p.deathyear_rank_unique > me.deathyear_rank_unique);
      if (betterRankedDeathPeers.length) {
        betterDeathPeers = <span>Before { person.gender ? "him" : "her" } are {<AnchorList items={betterRankedDeathPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
      }
      if (worseRankedDeathPeers.length) {
        worseDeathPeers = <span>After { person.gender ? "him" : "her" } are {<AnchorList items={worseRankedDeathPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
      }
    }


    return (
      <div>
        <p>
          Among people born in {FORMATTERS.year(person.birthyear.name)}, {person.name} ranks <a>{me.birthyear_rank}</a> out of {person.birthyear.num_born}.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
          { deathYearRanking ?
            <span>&nbsp;Among people deceased in {FORMATTERS.year(person.deathyear.name)}, {person.name} ranks <a>{me.deathyear_rank}</a> out of {person.deathyear.num_died}.&nbsp;</span>
            : null}
          { betterDeathPeers }
          { worseDeathPeers }
        </p>
        <div className="rank-title">
          <h3>Others Born in {FORMATTERS.year(person.birthyear.name)}</h3>
          <a href="/explore/rankings">Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={birthYearRanking} rankAccessor="birthyear_rank_unique" />
        {deathYearRanking
          ? <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others Deceased in {FORMATTERS.year(person.deathyear.name)}</h3>
              <a href="/explore/rankings">Go to all Rankings</a>
            </div>
            <PhotoCarousel me={person} people={deathYearRanking} rankAccessor="deathyear_rank_unique" />
          </div>
          : null }
      </div>
    );
  }
}

export default YearRanking;
