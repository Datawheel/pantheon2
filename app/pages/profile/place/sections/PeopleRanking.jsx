import React from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import {FORMATTERS} from "types/index";

const PeopleRanking = ({place, peopleBorn, peopleDied}) => {
  const youngestBirthyear = Math.max(...peopleBorn.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...peopleBorn.map(r => r.birthyear));
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  return (
    <section className="profile-section">
      <SectionHead title="People" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            {oldestBirthyear === youngestBirthyear ? <span>In {FORMATTERS.year(oldestBirthyear)}</span> : <span>Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}</span> }, {place.name} was the birth place of {peopleBorn.length} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {peopleDied.length} globally memorable people have passed away in {place.name} including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. { moreDeaths ? `Interestingly, more notably known people have passed away in ${place.name} than were born there.`: null}</span> : null}
          </p>
          <div className="rank-title">
            <h3>People Born in {place.name}</h3>
            <a href="/explore/rankings">Go to all Rankings</a>
          </div>
          <PhotoCarousel people={topRankingBorn} rankAccessor={place.is_country ? "birthcountry_rank_unique" : "birthplace_rank_unique"} />
          { topRankingDied.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Deceased in {place.name}</h3>
                <a href="/explore/rankings">Go to all Rankings</a>
              </div>
              <PhotoCarousel people={topRankingDied} rankAccessor={place.is_country ? "deathcountry_rank_unique" : "deathplace_rank_unique"} />
            </div> : null }
        </div>
      </div>
    </section>
  );
};

export default PeopleRanking;