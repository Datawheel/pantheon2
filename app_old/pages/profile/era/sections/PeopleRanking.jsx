import React from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import {FORMATTERS} from "types";

const PeopleRanking = ({era, peopleBorn, peopleDied}) => {
  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  return (
    <section className="profile-section">
      <SectionHead title="Most Remembered" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            Between {FORMATTERS.year(era.start_year)} and {FORMATTERS.year(era.end_year)}, the {era.name} era was the birth place of {FORMATTERS.commas(peopleBorn.length)} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {FORMATTERS.commas(peopleDied.length)} globally memorable people passed away during the {era.name} era including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span> : null}
          </p>
          <div className="rank-title">
            <h3>People Born during the {era.name} era</h3>
            <a href="/explore/rankings">Go to all Rankings</a>
          </div>
          <PhotoCarousel people={topRankingBorn} rankAccessor="birthera_rank_unique" />
          {topRankingDied.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Deceased during the {era.name} era</h3>
                <a href="/explore/rankings">Go to all Rankings</a>
              </div>
              <PhotoCarousel people={topRankingDied} rankAccessor="deathera_rank_unique" />
            </div> : null }
        </div>
      </div>
    </section>
  );
};

export default PeopleRanking;
