import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const Occupations = ({ data }) => {
  return (
    <div>
      <p>
        Most individuals born in the United Kingdom were <AnchorList items={data} name={(d) => d.occupation.name} url={(d) => `/profile/occupation/${d.occupation.slug}`} /> while most who died were x, y, and z.
      </p>
    </div>
  );
}

export default Occupations;
