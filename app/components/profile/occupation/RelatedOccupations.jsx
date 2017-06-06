import React from "react";
import PropTypes from "prop-types";
import AnchorList from "components/utils/AnchorList";
import {plural} from "pluralize";

const RelatedOccupations = ({ occupation, occupations }) => {

  return (
    <div>
      <p>
        {plural(occupation.occupation)} are found within the {occupation.domain} domain which also contains the following occupations <AnchorList items={occupations.filter(p => p.domain_slug==occupation.domain_slug && p.id!==occupation.id).slice(0, 5)} name={d => d.occupation} url={d => `/profile/occupation/${d.slug}/`} />.
      </p>
    </div>
  );
};

RelatedOccupations.propTypes = {
  occupation: PropTypes.object
};

export default RelatedOccupations;
