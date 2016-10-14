import React, { PropTypes } from 'react';
import styles from 'css/components/profile/nav';

const Nav = ({ sections }) => {
  return (
    <nav className='profile-nav'>
      <ol>
      {sections.map((section) =>
        <li key={section.slug}>
          <a href={`#${section.slug}`} className={`${section.slug}`}>. {section.title}</a>
        </li>
      )}
      </ol>
    </nav>
  );
};

export default Nav;
