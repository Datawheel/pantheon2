import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/section';

const Section = ({ children, index, numSections, slug, title }) => {

  return (
    <section className={'profile-section'}>
      <a name={slug}>{title}</a>
      {[...Array(numSections)].map((x, i) =>
        i === index ? 'circle-icon' : 'open-circle-icon'
      )}
      { children }
    </section>
  );
}

export default Section;
