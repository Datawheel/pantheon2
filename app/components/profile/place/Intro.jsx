import React, { Component, PropTypes } from 'react';

const Intro = ({ place }) => {

  return (
    <div>
      <h3>What is the cultural export of {place.name}?</h3>
      <p>
      {place.name} ranks <code>X</code> for producing culturally remembered individuals, behind <code>Country A</code> and <code>Country B</code>.
      Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
      </p>
    </div>
  );
}

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
