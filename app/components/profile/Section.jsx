import React, { Component, PropTypes } from 'react';
import styles from 'css/components/profile/section';
import {Icon} from 'react-fa'

const Section = ({ children, index, numSections, slug, title }) => {

  return (
    <section>
      <a name={slug}>{title}</a>
      {[...Array(numSections)].map((x, i) =>
        i === index ? <Icon key={i} name="circle" /> : <Icon key={i} name="circle-o" />
      )}
      { children }
    </section>
  );
}

export default Section;
