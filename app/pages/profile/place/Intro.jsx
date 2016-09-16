import React, { Component, PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/header';

const cx = classNames.bind(styles);

const Intro = ({ place }) => {

  return (
    <div>
      <p>
      Intro text here...
      </p>
    </div>
  );
}

Intro.propTypes = {
  person: PropTypes.object
};

export default Intro;
