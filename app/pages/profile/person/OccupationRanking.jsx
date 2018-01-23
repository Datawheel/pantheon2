import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";

class OccupationRanking extends Component {

  render() {
    const {person, ranking} = this.props;
    const me = ranking.find(rank => rank.slug === person.slug);

    const betterRankedPeers = ranking.filter(p => p.occupation_rank_unique < me.occupation_rank_unique);
    const worseRankedPeers = ranking.filter(p => p.occupation_rank_unique > me.occupation_rank_unique);

    let betterPeers = null,
        worsePeers = null;

    if (betterRankedPeers.length) {
      betterPeers = <span>Before { person.gender ? "him" : "her" } are <AnchorList items={betterRankedPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />. </span>;
    }
    if (worseRankedPeers.length) {
      worsePeers = <span>After { person.gender ? "him" : "her" } are <AnchorList items={worseRankedPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />.</span>;
    }

    return (
      <div>
        <p>
          Among {person.occupation.occupation}s, {person.name} ranks <a>{me.occupation_rank}</a> out of {person.occupation.num_born}.&nbsp;
          { betterPeers }
          { worsePeers }
        </p>
        <div className="rank-title">
          <h3>Top Global {person.occupation.occupation}s</h3>
          <a href="/explore/rankings">Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={ranking} rankAccessor="occupation_rank_unique" />
      </div>
    );
  }
}

export default OccupationRanking;
