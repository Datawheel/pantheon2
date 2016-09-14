import React, { Component, PropTypes } from 'react';
// import classNames from 'classnames/bind';
import styles from 'css/components/profile/section';
import {Icon} from 'react-fa'

// const cx = classNames.bind(styles);

const Section = ({ children, index, numSections, slug, title }) => {

  return (
    <section>
      <a name={slug}>{title}</a>
      {[...Array(numSections)].map((x, i) =>
        i === index ? <Icon name="circle" /> : <Icon name="circle-o" />
      )}
      { children }
    </section>
  );
}

export default Section;
