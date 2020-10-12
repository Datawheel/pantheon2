import React from "react";
import {Link} from "react-router";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import {FORMATTERS} from "types/index";

const PeopleRanking = ({country, peopleBorn, peopleDied}) => {
  const newPeopleBorn = peopleBorn.filter(p => !p.hpi_prev).sort((personA, personB) => personB.hpi - personA.hpi);
  const newPeopleDied = peopleDied.filter(p => !p.hpi_prev).sort((personA, personB) => personB.hpi - personA.hpi);
  const youngestBirthyear = Math.max(...peopleBorn.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...peopleBorn.map(r => r.birthyear));
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  const placeQueryParamId = country.country_code || country.id;

  return (
    <section className="profile-section">
      <SectionHead title="People" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
            {oldestBirthyear === youngestBirthyear ? <span>In {FORMATTERS.year(oldestBirthyear)}</span> : <span>Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}</span> }, present day {country.country} was the birth place of {FORMATTERS.commas(peopleBorn.length)} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {FORMATTERS.commas(peopleDied.length)} globally memorable people have passed away in present day {country.country} including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. { moreDeaths ? `Interestingly, more notably known people have passed away in ${country.country} than were born there.` : null}</span> : null}
          </p>
          {topRankingBorn.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Born in Present Day {country.country}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={topRankingBorn} rankAccessor={"bplace_country_rank_unique"} peopleAll={peopleBorn} />
            </div>
            : null}
          {newPeopleBorn.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>Newly Added People Born in Present Day {country.country}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={newPeopleBorn.slice(0, 12)} rankAccessor={"bplace_country_rank_unique"} peopleAll={newPeopleBorn} />
            </div>
            : null}
          {topRankingDied.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>People Deceased in Present Day {country.country}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}&placeType=deathplace`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={topRankingDied} rankAccessor={"dplace_country_rank_unique"} peopleAll={peopleDied} />
            </div> : null}
          {newPeopleDied.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>Newly Added People Deceased in Present Day {country.country}</h3>
                <Link to={`/explore/rankings?show=people&place=${placeQueryParamId}`}>Go to all Rankings</Link>
              </div>
              <PhotoCarousel people={newPeopleDied.slice(0, 12)} rankAccessor={"dplace_country_rank_unique"} peopleAll={newPeopleDied} />
            </div>
            : null}
        </div>
      </div>
    </section>
  );
};

export default PeopleRanking;
