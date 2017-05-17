import React from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import {FORMATTERS} from "types";
import {plural} from "pluralize";

const People = ({people, occupation}) => {

  const youngestBirthyear = Math.max(...people.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...people.filter(p => p.birthyear).map(r => r.birthyear));
  const peopleAlive = people.filter(p => p.alive);
  const peopleDead = people.filter(p => !p.alive);
  const shareAlive = peopleAlive.length / people.length;

  return (
    <div>
      <p>
        Between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}, there have been {FORMATTERS.commas(people.length)} globally memorable {plural(occupation.occupation)}, with {FORMATTERS.share(shareAlive)} still alive.
        The most globally memorable living {plural(occupation.occupation)} are <AnchorList items={people.filter(p => p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.
        { peopleDead.length
          ? <span> By contrast, the most memorable deceased {plural(occupation.occupation)} are <AnchorList items={people.filter(p => !p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span>
          : null }
      </p>
      <div className="rank-title">
        <h3>Most famous living {plural(occupation.occupation)}</h3>
        <a href="/explore/rankings">Go to all Rankings</a>
      </div>
      <PhotoCarousel people={peopleAlive.slice(0, 12)} rankAccessor="occupation_rank_unique" />
      { peopleDead.length
        ? <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Most famous deceased {plural(occupation.occupation)}</h3>
              <a href="/explore/rankings">Go to all Rankings</a>
            </div>
            <PhotoCarousel people={peopleDead.slice(0, 12)} rankAccessor="occupation_rank_unique" />
          </div>
        : null }
    </div>
  );
};

export default People;
