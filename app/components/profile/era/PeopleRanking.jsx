import React from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";

const PeopleRanking = ({era, peopleBorn, peopleDied}) => {
  const youngestBirthyear = Math.max(...peopleBorn.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...peopleBorn.map(r => r.birthyear));
  const moreDeaths = peopleDied.length > peopleBorn.length ? true : false;

  const topRankingBorn = peopleBorn.slice(0, 12);
  const topRankingDied = peopleDied.slice(0, 12);
  return (
    <div>
      <p>
        Between {FORMATTERS.year(era.start_year)} and {FORMATTERS.year(era.end_year)}, the {era.name} era was the birth place of {FORMATTERS.commas(peopleBorn.length)} globally memorable people, including <AnchorList items={peopleBorn.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />. {topRankingDied.length ? <span>Additionaly, {FORMATTERS.commas(peopleDied.length)} globally memorable people have passed away during the {era.name} era including <AnchorList items={peopleDied.slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span> : null}
      </p>
      <div className="rank-title">
        <h3>People Born during the {era.name} era</h3>
        <a href="#">Go to all Rankings</a>
      </div>
      <PhotoCarousel people={topRankingBorn} />
      { topRankingDied.length ?
        <div className="rank-sec-body">
          <div className="rank-title">
            <h3>People Deceased during the {era.name} era</h3>
            <a href="#">Go to all Rankings</a>
          </div>
          <PhotoCarousel people={topRankingDied} />
        </div> : null }
    </div>
  );
};

export default PeopleRanking;
