import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';

const Intro = ({ person }) => {
  const today = new Date();
  const year = today.getFullYear();
  let age = year - person.birthyear.id;
  if(person.deathyear) age = person.deathyear.id - person.birthyear.id;

  return (
    <section className={'intro-section'}>
      <div className={'intro-deco'}>
        <div className={'deco-lines'}>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
          <span className={'deco-line'}></span>
        </div>
      </div>
      <div className={'intro-content'}>
        <img src={`/people/${person.wiki_id}.jpg`} alt={`Photo of ${person.name}`} />
        <div className={'intro-text'}>
          <h3>
            <img src={iconProfW} alt={`Individual Cultural Production`} />
            {person.deathyear ?
            `In Cultural Memory of ${person.name}` :
            `The Cultural Production of ${person.name}`
            }
          </h3>
          <p>
            {person.name} {person.deathyear ? "was" : "is"} a <a href="">{person.profession.name}</a> born in <a href="">{person.birthplace.name}</a>, <a href="">{person.birthcountry.name}</a> in <a href="">{person.birthyear.name}</a>.&nbsp;
            {person.deathyear ?
              `${person.gender ? "She" : "He"} lived to be ${age} before passing in ${person.deathyear.name}.` :
              `${person.gender ? "She" : "He"} is currently ${age} years old.`
            }
            &nbsp;Pantheon aims to help us understand global cultural development by visualizing a dataset of “globally memorable people” through their professions, birth and resting places, and Wikipedia activity.&nbsp;
            <a href="/about/" className={'deep-link'}>Read more</a>
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
