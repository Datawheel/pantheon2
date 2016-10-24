import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';
import { FORMATTERS } from "types";

import {COLORS_DOMAIN} from "types";

const Intro = ({ person }) => {

  const age = person.deathyear !== null
            ? person.deathyear.id - person.birthyear.id
            : new Date().getFullYear() - person.birthyear.id,
        backgroundColor = COLORS_DOMAIN[person.profession.domain_slug],
        decoLines = 14;

  return (
    <section className="intro-section">
      <div className="intro-deco">
        <div className="deco-lines">
          { Array(decoLines).fill().map(i => <span key={i} className="deco-line" style={{backgroundColor}}></span>) }
        </div>
      </div>
      <div className="intro-content">
        <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src={iconProfW} />
            {person.deathyear ?
            `In Cultural Memory of ${person.name}` :
            `The Global Cultural Production of ${person.name}`
            }
          </h3>
          <p>
            {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/profession/${person.profession.slug}`}>{person.profession.name}</a> born in <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a> in <b>{FORMATTERS.year(person.birthyear.name)}</b>.&nbsp;
            {person.deathyear ?
              `${person.gender ? "She" : "He"} lived to be ${age} before passing in ${FORMATTERS.year(person.deathyear.name)}.` : null }&nbsp;
            At {age} years old, {person.gender ? "she" : "he"} has reached (total page views) page views on Wikipedia, hitting a peak of (max page views) in (max page view year).
            By analyzing all "globally remembered people", Pantheon aims to understand cultural development through changes in professions, birth and death places, and Wikipedia activity.&nbsp;
            <a href="/about/" className="deep-link">Read more about our research</a>
          </p>
        </div>
      </div>
    </section>
  );
}

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
