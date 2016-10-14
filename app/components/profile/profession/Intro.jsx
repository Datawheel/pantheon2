import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Intro = ({ profession }) => {

  return (
    <div>
      <h3>What is the cultural export of {profession.name}?</h3>
      <p>
      {profession.name} ranks <code>X</code> for producing culturally remembered individuals, behind <code>Profession A</code> and <code>Profession B</code>.
      Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
      </p>
    </div>
  );
}

Intro.propTypes = {
  profession: PropTypes.object
};

export default Intro;
