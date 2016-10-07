import React, { PropTypes } from 'react';
import styles from 'css/components/profile/nav';

const Nav = ({ sections }) => {
  return (
    <nav className='profile-nav'>
      <ul>
      {sections.map((section) =>
        <li key={section.slug}><a href={`#${section.slug}`}>{section.title}</a></li>
      )}
      </ul>
    </nav>
  );
};

export default Nav;
