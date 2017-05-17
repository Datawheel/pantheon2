import React, {Component} from "react";
import PersonImage from "components/utils/PersonImage";
import defaultImage from "images/icons/icon-person.svg";
import {COLORS_DOMAIN, FORMATTERS} from "types";

class PhotoCarousel extends Component {

  componentDidMount() {
    const rankMe = this.rankList.querySelector(".rank-me");
    if (rankMe) {
      const myL = rankMe.offsetLeft;
      const myW = rankMe.offsetWidth;
      const listW = this.rankList.offsetWidth;
      this.rankList.scrollLeft = myL + (myW / 2) - (listW / 2);
    }
  }

  render() {
    const {me, people} = this.props;
    const myId = me ? me.id : null;

    return (
      <div className="rank-carousel">
        <ul className="rank-list" ref={ul => {this.rankList = ul}}>
          {people.map(person =>
            <li key={person.id} className={person.id === myId ? "rank-me" : null}>
              <div className="rank-photo" style={{backgroundColor: COLORS_DOMAIN[person.occupation.domain_slug]}}>
                <a href={`/profile/person/${person.slug}/`}>
                  <PersonImage src={`/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} fallbackSrc={defaultImage} />
                </a>
              </div>
              <h2><a href={`/profile/person/${person.slug}/`}>{person.name}</a></h2>
              <p className="rank-year">{FORMATTERS.year(person.birthyear)} - {person.deathyear ? `${FORMATTERS.year(person.deathyear)}` : "Present"}</p>
              <p className="rank-year"><strong>{FORMATTERS.decimal(person.hpi)}</strong> HPI</p>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default PhotoCarousel;
