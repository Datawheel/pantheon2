import React from "react";
import PropTypes from "prop-types";
import AnchorList from "components/utils/AnchorList";
import "pages/profile/common/Intro.css";
import {FORMATTERS} from "types/index";
import {nest} from "d3-collection";
import {plural} from "pluralize";

const Intro = ({place, country, placeRanks, peopleBornHere, peopleDiedHere}) => {
  const myIndex = placeRanks.findIndex(p => p.name === place.name);

  const occupationsBorn = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_born: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleBornHere.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value)
    .slice(0, 2);
  const occupationsDied = nest()
    .key(d => d.occupation.id)
    .rollup(leaves => ({num_died: leaves.length, occupation: leaves[0].occupation}))
    .entries(peopleDiedHere.filter(d => d.occupation_id))
    .sort((a, b) => b.value.num_died - a.value.num_died)
    .map(d => d.value)
    .slice(0, 2);

  return (
    <section className="intro-section">
      <div className="intro-content">
        <div className="intro-text">
          <h3>
            <img src="/images/ui/profile-w.svg" />
            {place.name}
          </h3>
          <p>
            {place.name} ranks {FORMATTERS.ordinal(place.born_rank_unique)} in number of biographies on Pantheon, behind <AnchorList items={placeRanks.slice(Math.max(0, myIndex - 3), myIndex)} name={d => d.name} url={d => `/profile/place/${d.slug}/`} />.
            Memorable people born in {place.name} include <AnchorList items={peopleBornHere.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.
            {peopleDiedHere
              ? <span> Memorable people who died in {place.name} include <AnchorList items={peopleDiedHere.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span>
              : null}
            {occupationsBorn
              ? <span> {place.name} has been the birth place of many <AnchorList items={occupationsBorn} name={d => plural(d.occupation.occupation)} url={d => `/profile/occupation/${d.occupation.occupation_slug}/`} /></span>
              : null}
            {occupationsDied
              ? <span> and the death place of many <AnchorList items={occupationsDied} name={d => plural(d.occupation.occupation)} url={d => `/profile/occupation/${d.occupation.occupation_slug}/`} />.</span>
              : <span>.</span>}
            {!place.is_country
              ? <span> {place.name} is located in <a href={`/profile/place/${country.slug}`}>{country.name}</a>.</span>
              : null}
          </p>
        </div>
      </div>
    </section>
  );
};

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
