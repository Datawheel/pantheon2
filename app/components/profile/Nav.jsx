import React, { PropTypes } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/profile/nav';

const cx = classNames.bind(styles);

const Nav = ({ sections }) => {

  return (
    <nav className={cx('profile-nav')}>
      <ul>
      {sections.map((section) =>
        <li key={section.slug}><a href={`#${section.slug}`}>{section.title}</a></li>
      )}
      </ul>
    </nav>
  );
};

export default Nav;
