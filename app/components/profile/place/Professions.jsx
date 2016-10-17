import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const Professions = ({ data }) => {
  return (
    <div>
      <p>
        Most individuals born in the United Kingdom were <AnchorList items={data} name={(d) => d.profession.name} url={(d) => `/profile/profession/${d.profession.slug}`} /> while most who died were x, y, and z.
      </p>
    </div>
  );
}

export default Professions;
