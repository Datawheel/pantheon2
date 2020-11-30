import React, {Component} from "react";
import {Link} from "react-router";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";

class YearRanking extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {person, birthYearRanking, deathYearRanking} = this.props;
    const meBy = birthYearRanking.find(rank => rank.slug === person.slug);

    // return <div>year ranking to come...</div>;

    let betterBirthPeers = null,
        betterDeathPeers = null,
        meDy = null,
        worseBirthPeers = null,
        worseDeathPeers = null;

    const betterRankedBirthPeers = birthYearRanking.filter(p => p.birthyear_rank_unique < meBy.birthyear_rank_unique);
    const worseRankedBirthPeers = birthYearRanking.filter(p => p.birthyear_rank_unique > meBy.birthyear_rank_unique);

    if (betterRankedBirthPeers.length) {
      betterBirthPeers = <span>Before {person.gender ? person.gender === "M" ? "him" : "her" : "them"} {betterRankedBirthPeers.length > 1 ? "are" : "is"} {<AnchorList items={betterRankedBirthPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (worseRankedBirthPeers.length) {
      worseBirthPeers = <span>After {person.gender ? person.gender === "M" ? "him" : "her" : "them"} {worseRankedBirthPeers.length > 1 ? "are" : "is"} {<AnchorList items={worseRankedBirthPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    // return <div>year ranking to come...</div>;
    if (deathYearRanking.length) {
      meDy = deathYearRanking.find(rank => rank.slug === person.slug);
      const betterRankedDeathPeers = deathYearRanking.filter(p => p.deathyear_rank_unique < meDy.deathyear_rank_unique);
      const worseRankedDeathPeers = deathYearRanking.filter(p => p.deathyear_rank_unique > meDy.deathyear_rank_unique);
      if (betterRankedDeathPeers.length) {
        betterDeathPeers = <span>Before {person.gender ? person.gender === "M" ? "him" : "her" : "them"} {betterRankedDeathPeers.length > 1 ? "are" : "is"} {<AnchorList items={betterRankedDeathPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}. </span>;
      }
      if (worseRankedDeathPeers.length) {
        worseDeathPeers = <span>After {person.gender ? person.gender === "M" ? "him" : "her" : "them"} {worseRankedDeathPeers.length > 1 ? "are" : "is"} {<AnchorList items={worseRankedDeathPeers} name={d => d.deathcountry ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />}.</span>;
      }
    }

    return (
      <div>
        <p>
          Among people born in {FORMATTERS.year(person.birthyear)}, {person.name} ranks <strong>{FORMATTERS.commas(meBy.birthyear_rank)}</strong>.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
          { deathYearRanking.length
            ? <span>&nbsp;Among people deceased in {FORMATTERS.year(person.deathyear)}, {person.name} ranks <strong>{meDy.deathyear_rank}</strong>.&nbsp;</span>
            : null}
          { betterDeathPeers }
          { worseDeathPeers }
        </p>
        <div className="rank-title">
          <h3>Others Born in {FORMATTERS.year(person.birthyear)}</h3>
          <Link to={`/explore/rankings?viz=treemap&show=people&years=${person.birthyear},${person.birthyear}&yearType=birthyear`}>Go to all Rankings</Link>
        </div>
        <PhotoCarousel me={person} people={birthYearRanking} rankAccessor="birthyear_rank_unique" />
        {deathYearRanking.length
          ? <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others Deceased in {FORMATTERS.year(person.deathyear)}</h3>
              <Link to={`/explore/rankings?viz=treemap&show=people&years=${person.deathyear},${person.deathyear}&yearType=deathyear`}>Go to all Rankings</Link>
            </div>
            <PhotoCarousel me={person} people={deathYearRanking} rankAccessor="deathyear_rank_unique" />
          </div>
          : null }
      </div>
    );
  }
}

export default YearRanking;
