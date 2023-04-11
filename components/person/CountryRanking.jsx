import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import AnchorList from "../utils/AnchorList";
import PhotoCarousel from "../utils/PhotoCarousel";
import SectionLayout from "../common/SectionLayout";

async function getBirthCountryRankings(
  birthCountryId,
  birthCountryRankLow,
  birthCountryRankHigh
) {
  const res = await fetch(
    `https://api.pantheon.world/person_ranks?bplace_country=eq.${birthCountryId}&bplace_country_rank_unique=gte.${birthCountryRankLow}&bplace_country_rank_unique=lte.${birthCountryRankHigh}&order=bplace_country_rank_unique&select=bplace_country,hpi,bplace_country_rank,bplace_country_rank_unique,slug,gender,name,id,deathyear,birthyear`
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
  const bplaceCountryRankLow = personRanks.bplace_country_rank_unique
    ? Math.max(
        1,
        parseInt(personRanks.bplace_country_rank_unique, 10) - NUM_RANKINGS_PRE
      )
    : "9999";
  const bplaceCountryRankHigh = personRanks.bplace_country_rank_unique
    ? Math.max(
        NUM_RANKINGS,
        parseInt(personRanks.bplace_country_rank_unique, 10) + NUM_RANKINGS_POST
      )
    : "9999";
  const birthCountryRankings = await getBirthCountryRankings(
    personRanks.bplace_country,
    bplaceCountryRankLow,
    bplaceCountryRankHigh
  );
  const me = birthCountryRankings.find((rank) => rank.slug === person.slug);
  const betterRankedBirthPeers = birthCountryRankings.filter(
    (p) => p.bplace_country_rank_unique < me.bplace_country_rank_unique
  );
  const worseRankedBirthPeers = birthCountryRankings.filter(
    (p) => p.bplace_country_rank_unique > me.bplace_country_rank_unique
  );

  if (betterRankedBirthPeers.length) {
    betterBirthPeers = (
      <span>
        Before{" "}
        {person.gender ? (person.gender === "M" ? "him" : "her") : "them"} are{" "}
        {
          <AnchorList
            items={betterRankedBirthPeers}
            name={(d) => `${d.name} (${d.birthyear})`}
            url={(d) => `/profile/person/${d.slug}/`}
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
            name={(d) => `${d.name} (${d.birthyear})`}
            url={(d) => `/profile/person/${d.slug}/`}
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
          Among people born in{" "}
          <a href={`/profile/country/${person.bplace_country.slug}`}>
            {person.bplace_country.country}
          </a>
          , {person.name} ranks{" "}
          <strong>{FORMATTERS.commas(me.bplace_country_rank_unique)}</strong>{" "}
          out of {FORMATTERS.commas(person.bplace_country.num_born)}.&nbsp;
          {betterBirthPeers}
          {worseBirthPeers}
          {/* { ranking.deathcountryPeers.length
             ? <span>&nbsp;Among people deceased in <a href={`/profile/country/${person.deathcountry.slug}`}>{person.deathcountry.name}</a>, {person.name} ranks {ranking.me.deathcountry_rank_unique} out of {person.deathcountry.num_died}.&nbsp;</span>
             : null} */}
        </p>
        <div className="rank-title">
          <h3>
            Others born in{" "}
            <a href={`/profile/country/${person.bplace_country.slug}`}>
              {person.bplace_country.country}
            </a>
          </h3>
          <a
            href={`/explore/rankings?show=people&place=${person.bplace_country.country_code}`}
          >
            Go to all Rankings
          </a>
        </div>
        <PhotoCarousel
          me={person}
          people={birthCountryRankings}
          rankAccessor="bplace_country_rank_unique"
        />
      </div>
    </SectionLayout>
  );
}
