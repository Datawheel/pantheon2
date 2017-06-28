import React from "react";
import AnchorList from "components/utils/AnchorList";

const LivingPeople = ({place, data}) => {
  return (
    <div>
      <p>
        Among living memorable people from {place.name}, the three most remembered are <AnchorList items={data} name={(d) => d.name} url={(d) => `/profile/person/${d.id}/`} />. Below are the careers of the top 10 people born in {place.name}.
      </p>
    </div>
  );
};

export default LivingPeople;
