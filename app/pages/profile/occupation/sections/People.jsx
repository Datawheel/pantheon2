import React from "react";
import AnchorList from "components/utils/AnchorList";
import PhotoCarousel from "components/utils/PhotoCarousel";
import SectionHead from "pages/profile/common/SectionHead";
import {FORMATTERS} from "types";
import {plural} from "pluralize";

const People = ({people, occupation}) => {

  const youngestBirthyear = Math.max(...people.map(r => r.birthyear));
  const oldestBirthyear = Math.min(...people.filter(p => p.birthyear).map(r => r.birthyear));
  const peopleAlive = people.filter(p => p.alive);
  const peopleDead = people.filter(p => !p.alive);
  const shareAlive = peopleAlive.length / people.length;

  return (
    <section className="profile-section">
      <SectionHead title="People" index={1} numSections={5} />
      <div className="section-body">
        <div>
          <p>
          Pantheon has information on {FORMATTERS.commas(people.length)} {plural(occupation.occupation)} born between {FORMATTERS.year(oldestBirthyear)} and {FORMATTERS.year(youngestBirthyear)}. {FORMATTERS.share(shareAlive)} or {FORMATTERS.commas(peopleAlive.length)} are still alive.
          The most famous living {plural(occupation.occupation)} include <AnchorList items={people.filter(p => p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.
            {peopleDead.length
              ? <span> The most famous deceased {plural(occupation.occupation)} include <AnchorList items={people.filter(p => !p.alive).slice(0, 3)} name={d => d.name} url={d => `/profile/person/${d.slug}/`} />.</span>
              : null }
          </p>
          <div className="rank-title">
            <h3>Living {plural(occupation.occupation)}</h3>
            <a href="/explore/rankings">Go to all Rankings</a>
          </div>
          <PhotoCarousel people={peopleAlive.slice(0, 12)} rankAccessor="occupation_rank_unique" />
          { peopleDead.length
            ? <div className="rank-sec-body">
              <div className="rank-title">
                <h3>Deceased {plural(occupation.occupation)}</h3>
                <a href="/explore/rankings">Go to all Rankings</a>
              </div>
              <PhotoCarousel people={peopleDead.slice(0, 12)} rankAccessor="occupation_rank_unique" />
            </div>
            : null }
        </div>
      </div>
    </section>
  );
};

export default People;
