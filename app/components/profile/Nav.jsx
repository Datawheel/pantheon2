import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/nav';

const cx = classNames.bind(styles);

const Nav = () => {
  const sections = [
    "Metrics",
    "Among Singers",
    "Contemporaries",
    "Among People in the US",
    "Digital Afterlife"
  ];

  return (
    <nav className={cx('profile-nav')}>
      <ul>
      {sections.map((section, key) =>
        <li key={key}>{section}</li>
      )}
      </ul>
    </nav>
  );
};

export default Nav;
