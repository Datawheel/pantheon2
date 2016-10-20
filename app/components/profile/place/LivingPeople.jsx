import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const LivingPeople = ({ place, data }) => {
  return (
    <div>
      <p>
        Among living memorable people from {place.name}, the three most remembered are <AnchorList items={data} name={(d) => d.name} url={(d) => `/profile/person/${d.id}/`} />. Below are the careers of the top 10 people born in {place.name}.
      </p>
      <div className={'rank-title'}>
        <h3>MAGICAL PLACEHOLDER: Mapping Global Career</h3>
        <a href='#'>Go to all Rankings</a>
        <button type='button'>Suggest Life Event</button>
      </div>
    </div>
  );
}

export default LivingPeople;
