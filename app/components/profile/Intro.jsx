import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Intro = ({ person }) => {
  const today = new Date();
  const year = today.getFullYear();
  let age = year - person.birthyear.id;
  if(person.deathyear)
    age = person.deathyear - person.birthyear.id;
  return (
    <div>
      <p>
      {person.name} {person.deathyear ? "was" : "is"} a {person.occupation.name} born in {person.birthplace.name}, {person.birthcountry.name} in {person.birthyear.name}.&nbsp;
      {person.deathyear ?
        `${person.gender ? "She" : "He"} lived to be ${age} before passing in ${person.deathyear}.` :
        `${person.gender ? "She" : "He"} is currently ${age} years old.`
      }
      &nbsp;Pantheon aims to help us understand global cultural development by visualizing a dataset of “globally memorable people” through their professions, birth and resting places, and Wikipedia activity.
      </p>
    </div>
  );
}

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
