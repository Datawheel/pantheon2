import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';

import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';

const cx = classNames.bind(styles);

const Intro = ({ profession }) => {

  return (
    <section className={'intro-section'}>
      <div className={'intro-content'}>
        <div className={'intro-text'}>
          <h3>
            <img src={iconProfW} />
            What is the cultural export of {profession.name}?
          </h3>
          <p>
            {profession.name} ranks <code>X</code> for producing culturally remembered individuals, behind <code>Profession A</code> and <code>Profession B</code>.
            Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
          </p>
        </div>
      </div>
    </section>
  );
}

Intro.propTypes = {
  profession: PropTypes.object
};

export default Intro;
