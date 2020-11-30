import React, {Component} from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";
import {plural} from "pluralize";
import {toTitleCase} from "viz/helpers";

class CountryOccupationRanking extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {person, ranking} = this.props;
    const meBc = ranking.find(rank => rank.slug === person.slug);
    let betterBirthPeers = null,
        worseBirthPeers = null;

    const betterRankedBirthPeers = ranking.filter(p => p.bplace_country_occupation_rank_unique < meBc.bplace_country_occupation_rank_unique);
    const worseRankedBirthPeers = ranking.filter(p => p.bplace_country_occupation_rank_unique > meBc.bplace_country_occupation_rank_unique);

    if (betterRankedBirthPeers.length) {
      betterBirthPeers = <span>Before {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={betterRankedBirthPeers} name={d => `${d.name} (${d.birthyear})`} url={d => `/profile/person/${d.slug}/`} />}. </span>;
    }
    if (worseRankedBirthPeers.length) {
      worseBirthPeers = <span>After {person.gender ? person.gender === "M" ? "him" : "her" : "them"} are {<AnchorList items={worseRankedBirthPeers} name={d => `${d.name} (${d.birthyear})`} url={d => `/profile/person/${d.slug}/`} />}.</span>;
    }

    return (
      <div>
        <p>
          Among {plural(person.occupation.occupation.toLowerCase())} born in <a href={`/profile/country/${person.bplace_country.slug}`}>{person.bplace_country.country}</a>, {person.name} ranks <strong>{FORMATTERS.commas(meBc.bplace_country_occupation_rank_unique)}</strong>.&nbsp;
          { betterBirthPeers }
          { worseBirthPeers }
        </p>
        <div className="rank-title">
          <h3>{toTitleCase(plural(person.occupation.occupation.toLowerCase()))} Born in <a href={`/profile/country/${person.bplace_country.slug}`}>{person.bplace_country.country}</a></h3>
          <a href={`/explore/rankings?show=people&place=${person.bplace_country.country_code}&occupation=${person.occupation.id}`}>Go to all Rankings</a>
        </div>
        <PhotoCarousel me={person} people={ranking} rankAccessor="bplace_country_occupation_rank_unique" />
      </div>
    );
  }
}

export default CountryOccupationRanking;
