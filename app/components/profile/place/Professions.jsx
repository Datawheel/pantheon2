import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const Professions = ({ data }) => {
  return (
    <div>
      <p>
        Most individuals born in the United Kingdom were <AnchorList items={data} name={(d) => d.profession.name} url={(d) => `/profile/profession/${d.profession.slug}`} /> while most who died were x, y, and z.
      </p>
      <div className={'rank-title'}>
        <h3>Professions of People Born in MAGICAL PLACEHOLDER</h3>
        <a href='#'>Go to all Rankings</a>
      </div>
      <ul className={'rank-list'}>
      </ul>
      <h2>missing dead people plz</h2>
    </div>
  );
}

export default Professions;
