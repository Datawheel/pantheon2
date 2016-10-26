import React, { Component, PropTypes } from 'react';
import AnchorList from 'components/utils/AnchorList';
import { plural } from 'pluralize';

const RelatedProfessions = ({ profession, professions }) => {

  return (
    <div>
      <p>
        {plural(profession.name)} are found within the {profession.domain} domain which also contains the following professions <AnchorList items={professions.filter(p => p.domain_slug==profession.domain_slug && p.id!==profession.id).slice(0, 5)} name={d => d.name} url={d => `/profile/profession/${d.slug}/`} />.
      </p>
    </div>
  );
}

RelatedProfessions.propTypes = {
  profession: PropTypes.object
};

export default RelatedProfessions;
