import React from "react";
import {Link} from "react-router";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import {FORMATTERS} from "types/index";

const PeopleRanking = ({country, place, peopleBorn, peopleDied}) => {
  const youngestBirthyear = Math.max(...peopleBorn.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...peopleBorn.map(r => r.birthyear));
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  const placeQueryParamId = country ? `${country.id}|${place.id}` : `|${place.id}`;

  return (
    <section className="profile-section">
      <SectionHead title="People" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            {oldestBirthyear === youngestBirthyear ? <span>In {FORMATTERS.year(oldestBirthyear)}</span> : <span>Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}</span> }, {place.place} was the birth place of {FORMATTERS.commas(peopleBorn.length)} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {FORMATTERS.commas(peopleDied.length)} globally memorable people have passed away in {place.place} including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. { moreDeaths ? `Interestingly, more notably known people have passed away in ${place.place} than were born there.` : null}</span> : null}
          </p>
          {topRankingBorn.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Born in {place.place}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={topRankingBorn} rankAccessor="bplace_name_rank" peopleAll={peopleBorn} />
            </div>
            : null}
          {topRankingDied.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Deceased in {place.place}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}&placeType=deathplace`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={topRankingDied} rankAccessor="dplace_name_rank" peopleAll={peopleDied} />
            </div> : null}
        </div>
      </div>
    </section>
  );
};

export default PeopleRanking;
