import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';

const LivingPeople = ({ data }) => {
  return (
    <div>
      <p>
        Among living memorable people from the United Kingdom, the three most remembered are <AnchorList items={data} name={(d) => d.name} url={(d) => `/profile/person/${d.id}/`} />. Below are the careers of the top 10 people born in the UK.
      </p>
    </div>
  );
}

export default LivingPeople;
