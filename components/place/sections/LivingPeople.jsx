import React from "react";
import SectionHead from "pages/profile/common/SectionHead";
import AnchorList from "components/utils/AnchorList";

const LivingPeople = ({place, data}) => (
  <section className="profile-section">
    <SectionHead title="Living People" index={1} numSections={5} />
    <div className="section-body">
      <div>
        <p>
          Among living memorable people from {place.place}, the three most
          remembered are{" "}
          <AnchorList
            items={data}
            name={d => d.name}
            url={d => `/profile/person/${d.id}/`}
          />
          . Below are the careers of the top 10 people born in {place.place}.
        </p>
      </div>
    </div>
  </section>
);

export default LivingPeople;
