"use client";
import Tippy from "@tippyjs/react";
import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import {toTitleCase} from "../utils/vizHelpers";
import "../../components/common/Footer.css";
import "tippy.js/dist/tippy.css"; // optional

async function getWikiRelatedPeople(personSlug) {
  const res = await fetch(
    `https://pantheon.world/api/wikiRelated?slug=${personSlug}`
  );
  return res.json();
}

async function getOccupationRankings(
  occupationId,
  occupationRankLow,
  occupationRankHigh
) {
  const res = await fetch(
    `https://api-dev.pantheon.world/person_ranks?occupation=eq.${occupationId}&occupation_rank_unique=gte.${occupationRankLow}&occupation_rank_unique=lte.${occupationRankHigh}&order=occupation_rank_unique&select=occupation,bplace_country,hpi,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear`
  );
  return res.json();
}

export default async function Footer({person, personRanks}) {
  const wikiRelatedPeople = await getWikiRelatedPeople(person.slug);
  const occupationRankLow = Math.max(
    1,
    parseInt(personRanks.occupation_rank_unique, 10) - NUM_RANKINGS_PRE
  );
  const occupationRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(personRanks.occupation_rank_unique, 10) + NUM_RANKINGS_POST
  );
  const occupationRankings = await getOccupationRankings(
    person.occupation.id,
    occupationRankLow,
    occupationRankHigh
  );

  const me = occupationRankings.findIndex(rank => rank.slug === person.slug);
  const aboveMe = occupationRankings[me + 1];
  const belowMe = occupationRankings[me - 1];

  return (
    <footer className="profile-footer">
      <div className="footer-container">
        <h4 className="footer-title">Related Profiles</h4>
        <ul className="footer-carousel-container">
          <li className="footer-carousel-item">
            <div className="footer-carousel-item-photo">
              <a
                aria-label={`${person.occupation.occupation} profile`}
                href={`/profile/occupation/${person.occupation.occupation_slug}`}
                style={{
                  backgroundImage: `url(/images/profile/occupation/${person.occupation.occupation_slug}.jpg)`,
                }}
              ></a>
            </div>
            <h4 className="footer-carousel-item-title">
              <a
                href={`/profile/occupation/${person.occupation.occupation_slug}`}
              >
                {person.occupation.occupation}
              </a>
            </h4>
            <p>{person.occupation.num_born} Individuals</p>
          </li>

          {belowMe ? (
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a
                  aria-label={`${belowMe.name} profile`}
                  href={`/profile/person/${belowMe.slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/people/${belowMe.id}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${belowMe.slug}`}>{belowMe.name}</a>
              </h4>
              <p>Rank {FORMATTERS.commas(belowMe.occupation_rank)}</p>
            </li>
          ) : null}

          {aboveMe ? (
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a
                  aria-label={`${aboveMe.name} profile`}
                  href={`/profile/person/${aboveMe.slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/people/${aboveMe.id}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${aboveMe.slug}`}>{aboveMe.name}</a>
              </h4>
              <p>Rank {FORMATTERS.commas(aboveMe.occupation_rank)}</p>
            </li>
          ) : null}

          {person.birthplace ? (
            <li className="footer-carousel-item">
              <div className="footer-carousel-item-photo">
                <a
                  aria-label={`${person.birthplace.place} profile`}
                  href={`/profile/place/${person.birthplace.slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/place/${person.birthcountry.id}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/place/${person.birthplace.slug}`}>
                  {person.birthplace.place}
                </a>
              </h4>
              <p>{person.birthplace.num_born} Individuals</p>
            </li>
          ) : null}

          {person.birthcountry ? (
            <li className="footer-carousel-item">
              <div
                className="footer-carousel-item-photo"
                style={{
                  backgroundImage: `url(/place/${person.birthcountry.id}.jpg)`,
                }}
              >
                <a
                  aria-label={`${person.birthcountry.name} profile`}
                  href={`/profile/place/${person.birthcountry.slug}`}
                  style={{
                    backgroundImage: `url(/images/profile/place/${person.birthcountry.id}.jpg)`,
                  }}
                ></a>
              </div>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/place/${person.birthcountry.slug}`}>
                  {person.birthcountry.name}
                </a>
              </h4>
              <p>{person.birthcountry.num_born} Individuals</p>
            </li>
          ) : null}

          {wikiRelatedPeople.length
            ? wikiRelatedPeople.map(relatedBio => (
                <li className="footer-carousel-item" key={relatedBio.id}>
                  <div className="footer-carousel-item-photo">
                    <Tippy content={relatedBio.extract}>
                      <a
                        aria-label={`${relatedBio.name} profile`}
                        href={`/profile/person/${relatedBio.slug}`}
                        style={{
                          backgroundImage: `url(/images/profile/people/${relatedBio.id}.jpg)`,
                        }}
                      ></a>
                    </Tippy>
                  </div>
                  <h4 className="footer-carousel-item-title">
                    <a href={`/profile/person/${relatedBio.slug}`}>
                      {relatedBio.name}
                    </a>
                  </h4>
                  <p>{toTitleCase(relatedBio.description)}</p>
                </li>
              ))
            : null}
        </ul>
      </div>
    </footer>
  );
}
