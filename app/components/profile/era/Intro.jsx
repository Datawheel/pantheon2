import React from "react";
import HelpText from "components/utils/HelpText";
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
  return <section className="intro-section era">
    <div className="intro-content">
      <div className="intro-text">
        <h3>
          <img src={iconProfW} />
          What was the cultural production of the {era.name}?
        </h3>
        <p>
          The {era.name} occured roughly between {FORMATTERS.year(era.start_year)} and {FORMATTERS.year(era.end_year)} and is defined by the rapid adoption of a new <HelpText text="communication technology" />.
          The most globally remembered individuals born in this time period are <AnchorList items={peopleBorn} name={d => d.birthcountry ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})` : `${d.name}`} url={d => `/profile/person/${d.slug}/`} />.&nbsp;
          {nextPrevSentence}&nbsp;
          Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.&nbsp;
          <a href="/about/" className="deep-link">Read about our methods</a>
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
