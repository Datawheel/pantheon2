import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';
import { plural } from 'pluralize';
import { FORMATTERS } from 'types';

const Intro = ({ profession, professions }) => {
  const myIndex = professions.findIndex(p => p.id === profession.id);

  return (
    <section className={'intro-section'}>
      <div className={'intro-content'}>
        <div className={'intro-text'}>
          <h3>
            <img src={iconProfW} />
            What is the cultural export of {profession.name}?
          </h3>
          <p>
            {plural(profession.name)} { myIndex ? <span>rank {FORMATTERS.ordinal(myIndex+1)}</span> : <span>are the top ranked profession</span> } for producing culturally remembered individuals{ myIndex ? <span>, behind <AnchorList items={professions.slice(Math.max(0, myIndex-3), myIndex)} name={p => plural(p.name)} url={p => `/profile/profession/${p.slug}/`} /></span> : null }.
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
