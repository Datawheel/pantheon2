import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import styles from 'css/components/profile/intro';
import iconProfW from 'images/globalNav/profile-w.svg';
import { FORMATTERS } from 'types';

const Intro = ({ place, placeRanks }) => {
  const { me, peers } = placeRanks;
  const myIndex = peers.findIndex(p => p.name==me.name);

  return (
    <section className={'intro-section'}>
      <div className={'intro-content'}>
        <div className={'intro-text'}>
          <h3>
            <img src={iconProfW} />
            What is the Cultural Export of {place.name}?
          </h3>
          <p>
            {place.name} ranks {FORMATTERS.ordinal(me.born_rank_unique)} for producing culturally remembered individuals, behind <AnchorList items={peers.slice(Math.max(0, myIndex-3), myIndex)} name={d => d.name} url={d => `/profile/place/${d.slug}/`} />.
            Pantheon aims to help us understand global cultural development by visualizing a dataset of "globally memorable people" through their professions, birth and resting places, and Wikipedia activity.
            &nbsp;<a href="/about/" className="deep-link">Read more about our research</a>
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
