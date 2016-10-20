import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const Professions = ({ place, professionsBorn, professionsDied }) => {
  return (
    <div>
      <p>
        Most individuals born in {place.name} were <AnchorList items={professionsBorn} name={(d) => `${d.profession.name} (${d.num_born})`} url={(d) => `/profile/profession/${d.profession.slug}`} /> while most who died were <AnchorList items={professionsDied} name={(d) => `${d.profession.name} (${d.num_died})`} url={(d) => `/profile/profession/${d.profession.slug}`} />.
      </p>
    </div>
  );
}

export default Professions;
