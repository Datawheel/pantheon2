import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';
import PersonImage from "components/utils/PersonImage";
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
          { Array(decoLines).fill().map((d, i) => <span key={i} className="deco-line" style={{backgroundColor}}></span>) }
        </div>
      </div>
      <div className="intro-content">
        <PersonImage src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src={iconProfW} />
            {person.deathyear ?
            `In Cultural Memory of ${person.name}` :
            `The Global Cultural Production of ${person.name}`
            }
          </h3>
          <p>
            {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/profession/${person.profession.slug}`}>{person.profession.name}</a> born in <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a> in <b>{FORMATTERS.year(person.birthyear.name)}</b>.
            {person.deathyear ?
              `${person.gender ? " She" : " He"} lived to be ${age} before passing in ${FORMATTERS.year(person.deathyear.name)}.` : null }
            &nbsp;Since the start of Wikipedia, {person.gender ? "she" : "he"} has accumulated <a>(total page views)</a> page views, spanning <a>(# languages)</a> total different languages.
            By analyzing all "globally remembered people", Pantheon aims to understand cultural development through changes in professions, birth and death places, and Wikipedia activity.&nbsp;
            <a href="/about/" className="deep-link">Read about our methods</a>
          </p>
        </div>
      </div>
    </section>
  );
}

Intro.propTypes = {
  person: PropTypes.object
};

function mapStateToProps(state) {
  return {
    person: state.personProfile.person
  };
}

export default connect(mapStateToProps)(Intro);
