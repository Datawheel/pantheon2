import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Intro = ({ domain }) => {

  return (
    <div>
      <h3>What is the cultural export of {domain.name}?</h3>
      <p>
      {domain.name} ranks <code>X</code> for producing culturally remembered individuals, behind <code>Domain A</code> and <code>Domain B</code>.
      Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
      </p>
    </div>
  );
}

Intro.propTypes = {
  domain: PropTypes.object
};

export default Intro;
