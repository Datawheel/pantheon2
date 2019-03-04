import React, {Component} from "react";
import {Link} from "react-router";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";

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
          Among {person.occupation.occupation}s, {person.name} ranks <a>{FORMATTERS.commas(me.occupation_rank)}</a> out of {FORMATTERS.commas(person.occupation.num_born)}.&nbsp;
          { betterPeers }
          { worsePeers }
        </p>
        <div className="rank-title">
          <h3>Top Global {person.occupation.occupation}s</h3>
          <Link to={`/explore/rankings?show=people&occupation=${person.occupation.id}`}>Go to all Rankings</Link>
        </div>
        <PhotoCarousel me={person} people={ranking} rankAccessor="occupation_rank_unique" />
      </div>
    );
  }
}

export default OccupationRanking;
