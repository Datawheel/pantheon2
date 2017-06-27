import React from "react";
import {nest} from "d3-collection";
import AnchorList from "components/utils/AnchorList";
import "css/components/profile/intro";
import iconProfW from "images/globalNav/profile-w.svg";
import {FORMATTERS} from "types";

const Intro = ({era, eras, peopleBorn}) => {
  const currentEraIndex = eras.findIndex(e => e.slug === era.slug);
  const prevEra = currentEraIndex > 0 ? eras[currentEraIndex - 1] : null;
  const nextEra = currentEraIndex < eras.length - 1 ? eras[currentEraIndex + 1] : null;
  let nextPrevSentence;
  if (prevEra && nextEra) {
    nextPrevSentence = <span>This Era was preceded by the <a href={`/profile/era/${prevEra.slug}`}>{prevEra.name}</a> and followed by the <a href={`/profile/era/${nextEra.slug}`}>{nextEra.name}</a>.</span>;
  }
  else if (prevEra) {
    nextPrevSentence = <span>This Era was preceded by the <a href={`/profile/era/${prevEra.slug}`}>{prevEra.name}</a>.</span>;
  }
  else if (nextEra) {
    nextPrevSentence = <span>This Era was followed by the <a href={`/profile/era/${nextEra.slug}`}>{nextEra.name}</a>.</span>;
  }
  const cities = nest()
    .key(d => d.place.id)
    .rollup(leaves => ({num_born: leaves.length, city: leaves[0].place}))
    .entries(peopleBorn.filter(d => d.place))
    .sort((a, b) => b.value.num_born - a.value.num_born)
    .map(d => d.value);
  
  return <section className="intro-section era">
    <div className="intro-content">
      <div className="intro-text">
        <h3><img src={iconProfW} /></h3>
        <p>
          The {era.name} took place between {FORMATTERS.year(era.start_year)} and {FORMATTERS.year(era.end_year)}.
          &nbsp;{nextPrevSentence}&nbsp;
          The most memorable people born in this era include <AnchorList items={peopleBorn.slice(0, 3)} name={d => `${d.name}`} url={d => `/profile/person/${d.slug}/`} />.
          The most important cities in this era were <AnchorList items={cities.slice(0, 3)} name={d => `${d.city.name} (${d.num_born})`} url={d => `/profile/place/${d.city.slug}/`} />.
        </p>
      </div>
      <ul className="items era-timeline">
        {eras.map(e =>
          <li key={e.slug} className="item era-time">
            <a href={`/profile/era/${e.slug}`} className={e.slug === era.slug ? "item-link era-time-link active" : "item-link era-time-link"}>{e.name}</a>
          </li>
        )}
      </ul>
    </div>
  </section>;
};

export default Intro;
