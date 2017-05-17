import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";

class OccupationRanking extends Component {

  render() {
    const {person} = this.props;
    let {ranking} = this.props;

    ranking = Object.assign({}, ranking, {
      betterPeers: ranking.peers.filter(p => p.occupation_rank_unique < ranking.me.occupation_rank_unique),
      worsePeers: ranking.peers.filter(p => p.occupation_rank_unique > ranking.me.occupation_rank_unique)
    });

    let betterPeers = null,
        worsePeers = null;

    if (ranking.betterPeers.length) {
      betterPeers = <span>Before { person.gender ? "him" : "her" } are <AnchorList items={ranking.betterPeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />. </span>;
    }
    if (ranking.worsePeers.length) {
      worsePeers = <span>After { person.gender ? "him" : "her" } are <AnchorList items={ranking.worsePeers} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : d.name} url={d => `/profile/person/${d.slug}/`} />.</span>;
    }

    return (
      <div>
        <p>
          Among {person.occupation.occupation}s, {person.name} ranks <a>{ranking.me.occupation_rank}</a> out of {person.occupation.num_born}.&nbsp;
          { betterPeers }
          { worsePeers }
        </p>
        <div className="rank-title">
          <h3>Top Global {person.occupation.occupation}s</h3>
          <a href="/explore/rankings">Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={ranking.peers} />
      </div>
    );
  }
}

export default OccupationRanking;
