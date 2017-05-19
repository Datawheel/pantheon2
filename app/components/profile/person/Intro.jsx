import React, {PropTypes} from "react";
import {connect} from "react-redux";
import "css/components/profile/intro";
import iconProfW from "images/globalNav/profile-w.svg";
import PersonImage from "components/utils/PersonImage";
import {FORMATTERS} from "types";

import {COLORS_DOMAIN} from "types";

const Intro = ({person, totalPageViews}) => {

  const age = person.deathyear !== null
            ? person.deathyear.id - person.birthyear.id
            : new Date().getFullYear() - person.birthyear.id,
        backgroundColor = COLORS_DOMAIN[person.occupation.domain_slug],
        decoLines = 14;

  let fromSentence;
  if (person.geacron_name !== person.birthcountry.name) {
    fromSentence = <span>born in {person.bplace_name}, {person.geacron_name} which is now part of modern day <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a> </span>;
  }
  else {
    const birthplace = person.birthplace.state
          ? <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}, {person.birthplace.state}</a>
          : <a href={`/profile/place/${person.birthplace.slug}`}>{person.birthplace.name}</a>;
    if (person.bplace_name !== person.birthplace.name) {
      fromSentence = <span>born in {person.bplace_name}, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a> which is part of the {birthplace} metro area </span>;
    }
    else {
      fromSentence = <span>born in {birthplace}, <a href={`/profile/place/${person.birthcountry.slug}`}>{person.birthcountry.name}</a></span>;
    }
  }

  return (
    <section className="intro-section person">
      <div className="intro-deco">
        <div className="deco-lines">
          { Array(decoLines).fill().map((d, i) => <span key={i} className="deco-line" style={{backgroundColor}}></span>) }
        </div>
      </div>
      <div className="intro-content">
        <PersonImage src={`/people/${person.id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className="intro-text">
          <h3>
            <img src={iconProfW} />
            {person.deathyear
            ? `In Cultural Memory of ${person.name}`
            : `The Global Cultural Production of ${person.name}`
            }
          </h3>
          <p>
            {person.name} {person.deathyear ? "was" : "is"} a <a href={`/profile/occupation/${person.occupation.occupation_slug}`}>{person.occupation.occupation}</a>&nbsp;
            {person.birthplace
             ? <span>{fromSentence}</span> : null}
             <span> in <b>{FORMATTERS.year(person.birthyear.name)}</b>.</span>
            {person.deathyear
              ? `${person.gender ? " He" : " She"} lived to be ${age} before passing in ${FORMATTERS.year(person.deathyear.name)}.` : null }
            &nbsp;Since the start of Wikipedia, {person.gender ? "he" : "she"} has accumulated {FORMATTERS.commas(totalPageViews)} page views, spanning {person.langs} total different language editions.
            By analyzing all "globally remembered people," Pantheon aims to understand cultural development through changes in occupations, birth and death places, and Wikipedia activity.&nbsp;
            <a href="/about/" className="deep-link">Read about our methods</a>
          </p>
        </div>
      </div>
    </section>
  );
};

Intro.propTypes = {
  person: PropTypes.object
};

function mapStateToProps(state) {
  return {
    person: state.personProfile.person
  };
}

export default connect(mapStateToProps)(Intro);
