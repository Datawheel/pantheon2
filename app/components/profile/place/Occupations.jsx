import React, { Component, PropTypes } from "react";
import AnchorList from "components/utils/AnchorList";

const Occupations = ({place, occupationsBorn, occupationsDied}) => {
  return (
    <div>
      <p>
        Most individuals born in {place.name} were <AnchorList items={occupationsBorn} name={(d) => `${d.occupation.occupation} (${d.num_born})`} url={(d) => `/profile/occupation/${d.occupation.occupation_slug}`} /> while most who died were <AnchorList items={occupationsDied} name={(d) => `${d.occupation.occupation} (${d.num_died})`} url={(d) => `/profile/occupation/${d.occupation.occupation_slug}`} />.
      </p>
    </div>
  );
}

export default Occupations;
