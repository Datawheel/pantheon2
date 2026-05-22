// "use client";
// import Tippy from "@tippyjs/react";
// const Tippy = dynamic(() => import("@tippyjs/react"), {ssr: false});
import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import {BASE_API} from "@/app/constants";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {toTitleCase} from "../utils/vizHelpers";
import PersonImage from "../utils/PersonImage";
import "../../components/common/Footer.css";

const baseUrl = process.env.URL || "https://pantheon.world";

const PERSON_FALLBACK = "https://static.pantheon.world/icons/icon-person.svg";

async function getWikiRelatedPeople(personId) {
  try {
    const relRes = await fetch(
      `${BASE_API}/person_related?person_id=eq.${personId}&order=score.asc&limit=20`,
    );
    if (!relRes.ok) {
      console.error(`[getWikiRelatedPeople] HTTP ${relRes.status} for id: ${personId}`);
      return [];
    }
    const related = await relRes.json();
    if (!Array.isArray(related)) {
      return [];
    }
    if (!related.length) return [];

    const idQuery = related.map(r => `id.eq.${r.related_id}`).join(",");
    let peopleRes = await fetch(
      `${BASE_API}/person?or=(${idQuery})&select=id,birthyear,name,slug,description,gender,occupation`,
    );
    if (!peopleRes.ok) {
      // Fall back for environments where the person view does not expose description.
      peopleRes = await fetch(
        `${BASE_API}/person?or=(${idQuery})&select=id,birthyear,name,slug,gender,occupation`,
      );
    }
    if (!peopleRes.ok) {
      console.error(`[getWikiRelatedPeople] Pantheon people HTTP ${peopleRes.status} for id: ${personId}`);
      return [];
    }
    const people = await peopleRes.json();
    if (!Array.isArray(people)) {
      return [];
    }

    const scoreOrder = new Map(related.map(r => [`${r.related_id}`, r.score]));
    return people
      .map(p => ({
        ...p,
        description: p.description || p.occupation?.occupation_name || "",
      }))
      .sort((a, b) => (scoreOrder.get(`${a.id}`) ?? 999) - (scoreOrder.get(`${b.id}`) ?? 999));
  } catch (e) {
    console.error(`[getWikiRelatedPeople] Error for id ${personId}: ${e.message}`);
    return [];
  }
}

async function getOccupationRankings(
  occupationId,
  occupationRankLow,
  occupationRankHigh,
) {
  try {
    const encodedOccupationId = encodePostgrestValue(occupationId);
    const res = await fetch(
      `${BASE_API}/person_ranks?occupation=eq.${encodedOccupationId}&occupation_rank_unique=gte.${occupationRankLow}&occupation_rank_unique=lte.${occupationRankHigh}&order=occupation_rank_unique&select=occupation,bplace_country,hpi,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear`,
    );
    if (!res.ok) {
      console.error(`[getOccupationRankings] HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getOccupationRankings] Got HTML instead of JSON`);
      return [];
    }
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(`[getOccupationRankings] Error: ${e.message}`);
    return [];
  }
}

export default async function Footer({person, personRanks}) {
  if (
    !personRanks ||
    !person.occupation ||
    !personRanks.occupation_rank_unique
  ) {
    return null;
  }
  const wikiRelatedPeople = await getWikiRelatedPeople(person.id);
  const occupationRankLow = Math.max(
    1,
    parseInt(personRanks.occupation_rank_unique, 10) - NUM_RANKINGS_PRE,
  );
  const occupationRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(personRanks.occupation_rank_unique, 10) + NUM_RANKINGS_POST,
  );
  const occupationRankings = await getOccupationRankings(
    person.occupation.id,
    occupationRankLow,
    occupationRankHigh,
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
                  backgroundImage: `url(https://static.pantheon.world/profile/occupation/${person.occupation.occupation_slug}.jpg)`,
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
            <p>{FORMATTERS.commas(person.occupation.num_born)} Individuals</p>
          </li>

          {belowMe ? (
            <li className="footer-carousel-item">
              <a
                className="footer-carousel-item-photo"
                aria-label={`${belowMe.name} profile`}
                href={`/profile/person/${belowMe.slug}`}
              >
                <PersonImage
                  person={belowMe}
                  src={`/profile/people/${belowMe.id}.jpg`}
                  alt={belowMe.name}
                  fallbackSrc={PERSON_FALLBACK}
                />
              </a>
              <h4 className="footer-carousel-item-title">
                <a href={`/profile/person/${belowMe.slug}`}>{belowMe.name}</a>
              </h4>
              <p>Rank {FORMATTERS.commas(belowMe.occupation_rank)}</p>
            </li>
          ) : null}

          {aboveMe ? (
            <li className="footer-carousel-item">
              <a
                className="footer-carousel-item-photo"
                aria-label={`${aboveMe.name} profile`}
                href={`/profile/person/${aboveMe.slug}`}
              >
                <PersonImage
                  person={aboveMe}
                  src={`/profile/people/${aboveMe.id}.jpg`}
                  alt={aboveMe.name}
                  fallbackSrc={PERSON_FALLBACK}
                />
              </a>
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
                    backgroundImage: `url(https://static.pantheon.world/profile/place/${person.birthcountry.id}.jpg)`,
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
                    backgroundImage: `url(https://static.pantheon.world/profile/place/${person.birthcountry.id}.jpg)`,
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
                  <a
                    className="footer-carousel-item-photo"
                    aria-label={`${relatedBio.name} profile`}
                    href={`/profile/person/${relatedBio.slug}`}
                  >
                    <PersonImage
                      person={relatedBio}
                      src={`/profile/people/${relatedBio.id}.jpg`}
                      alt={relatedBio.name}
                      fallbackSrc={PERSON_FALLBACK}
                    />
                  </a>
                  <h4 className="footer-carousel-item-title">
                    <a href={`/profile/person/${relatedBio.slug}`}>
                      {relatedBio.name}
                    </a>
                  </h4>
                  <p className="footer-carousel-item-subtitle">
                    {relatedBio.description || toTitleCase(relatedBio.occupation?.occupation_name || "")}
                  </p>
                </li>
              ))
            : null}
        </ul>
      </div>
    </footer>
  );
}
