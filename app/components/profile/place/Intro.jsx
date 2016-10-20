import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';

const Intro = ({ place }) => {

  return (
    <section className={'intro-section'}>
      <div className={'intro-content'}>
        <div className={'intro-text'}>
          <h3>
            <img src={iconProfW} />
            What is the Cultural Export of {place.name}?
          </h3>
          <p>
            {place.name} ranks <code>X</code> for producing culturally remembered individuals, behind <code>Country A</code> and <code>Country B</code>.
            Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
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
