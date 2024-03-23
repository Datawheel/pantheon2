import {plural} from "pluralize";
import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import AnchorList from "../utils/AnchorList";
import PhotoCarousel from "../utils/PhotoCarousel";
import {toTitleCase} from "../utils/vizHelpers";
import SectionLayout from "../common/SectionLayout";

async function getBirthCountryRankings(
  occupationId,
  birthCountryId,
  bplaceCountryOccupationRankLow,
  bplaceCountryOccupationRankHigh
) {
  const res = await fetch(
    `https://api-dev.pantheon.world/person_ranks?occupation=eq.${occupationId}&bplace_country=eq.${birthCountryId}&bplace_country_occupation_rank_unique=gte.${bplaceCountryOccupationRankLow}&bplace_country_occupation_rank_unique=lte.${bplaceCountryOccupationRankHigh}&order=bplace_country_occupation_rank_unique&select=bplace_country,occupation,hpi,slug,bplace_country_occupation_rank,bplace_country_occupation_rank_unique,gender,name,id,deathyear,birthyear`
  );
  return res.json();
}

export default async function CountryRanking({
  person,
  personRanks,
  title,
  slug,
}) {
  if (!person.bplace_country) {
    return null;
  }
  let betterBirthPeers = null,
    worseBirthPeers = null;
  const bplaceCountryOccupationRankLow =
    personRanks.bplace_country_occupation_rank_unique
      ? Math.max(
          1,
          parseInt(personRanks.bplace_country_occupation_rank_unique, 10) -
            NUM_RANKINGS_PRE
        )
      : "9999";
  const bplaceCountryOccupationRankHigh =
    personRanks.bplace_country_occupation_rank_unique
      ? Math.max(
          NUM_RANKINGS,
          parseInt(personRanks.bplace_country_occupation_rank_unique, 10) +
            NUM_RANKINGS_POST
        )
      : "9999";
  const birthCountryRankings = await getBirthCountryRankings(
    person.occupation.id,
    personRanks.bplace_country,
    bplaceCountryOccupationRankLow,
    bplaceCountryOccupationRankHigh
  );
  const me = birthCountryRankings.find(rank => rank.slug === person.slug);
  const betterRankedBirthPeers = birthCountryRankings.filter(
    p =>
      p.bplace_country_occupation_rank_unique <
      me.bplace_country_occupation_rank_unique
  );
  const worseRankedBirthPeers = birthCountryRankings.filter(
    p =>
      p.bplace_country_occupation_rank_unique >
      me.bplace_country_occupation_rank_unique
  );

  if (betterRankedBirthPeers.length) {
    betterBirthPeers = (
      <span>
        Before{" "}
        {person.gender ? (person.gender === "M" ? "him" : "her") : "them"} are{" "}
        {
          <AnchorList
            items={betterRankedBirthPeers}
            name={d => `${d.name} (${d.birthyear})`}
            url={d => `/profile/person/${d.slug}/`}
          />
        }
        .{" "}
      </span>
    );
  }
  if (worseRankedBirthPeers.length) {
    worseBirthPeers = (
      <span>
        After {person.gender ? (person.gender === "M" ? "him" : "her") : "them"}{" "}
        are{" "}
        {
          <AnchorList
            items={worseRankedBirthPeers}
            name={d => `${d.name} (${d.birthyear})`}
            url={d => `/profile/person/${d.slug}/`}
          />
        }
        .
      </span>
    );
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Among {plural(person.occupation.occupation.toLowerCase())} born in{" "}
          <a href={`/profile/country/${person.bplace_country.slug}`}>
            {person.bplace_country.country}
          </a>
          , {person.name} ranks{" "}
          <strong>
            {FORMATTERS.commas(me.bplace_country_occupation_rank_unique)}
          </strong>
          .&nbsp;
          {betterBirthPeers}
          {worseBirthPeers}
        </p>
        <div className="rank-title">
          <h3>
            <a
              href={`/profile/occupation/${person.occupation.occupation_slug}/country/${person.bplace_country.slug}`}
            >
              {person.bplace_country.demonym} born{" "}
              {toTitleCase(plural(person.occupation.occupation.toLowerCase()))}
            </a>
          </h3>
          <a
            href={`/explore/rankings?show=people&place=${person.bplace_country.country_code}&occupation=${person.occupation.id}`}
          >
            Go to all Rankings
          </a>
        </div>
        <PhotoCarousel
          me={person}
          people={birthCountryRankings}
          rankAccessor="bplace_country_occupation_rank_unique"
        />
      </div>
    </SectionLayout>
  );
}
