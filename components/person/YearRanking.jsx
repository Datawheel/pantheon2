import Link from "next/link";
import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import AnchorList from "../utils/AnchorList";
import PhotoCarousel from "../utils/PhotoCarousel";
import SectionLayout from "../common/SectionLayout";

async function getBirthYearRankings(
  birthYear,
  birthYearRankLow,
  birthYearRankHigh
) {
  const res = await fetch(
    `https://api-dev.pantheon.world/person_ranks?birthyear=eq.${birthYear}&birthyear_rank_unique=gte.${birthYearRankLow}&birthyear_rank_unique=lte.${birthYearRankHigh}&order=birthyear_rank_unique&select=occupation,bplace_country,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,birthyear,deathyear`
  );
  return res.json();
}

async function getDeathYearRankings(
  deathyear,
  deathYearRankLow,
  deathYearRankHigh
) {
  const res = await fetch(
    `https://api-dev.pantheon.world/person_ranks?deathyear=eq.${deathyear}&deathyear_rank_unique=gte.${deathYearRankLow}&deathyear_rank_unique=lte.${deathYearRankHigh}&order=deathyear_rank_unique&select=occupation,dplace_country,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,deathyear,birthyear`
  );
  return res.json();
}

export default async function YearRanking({
  person,
  personRanks,
  title,
  slug,
}) {
  if (!person.birthyear) {
    return null;
  }
  // Calculate min/max for birthyear peers
  const birthYearRankLow = Math.max(
    1,
    parseInt(personRanks.birthyear_rank_unique, 10) - NUM_RANKINGS_PRE
  );
  const birthYearRankHigh = Math.max(
    NUM_RANKINGS,
    parseInt(personRanks.birthyear_rank_unique, 10) + NUM_RANKINGS_POST
  );
  const birthYearRankingsData = getBirthYearRankings(
    person.birthyear,
    birthYearRankLow,
    birthYearRankHigh
  );
  // Calculate min/max for deathyear peers
  const deathYearRankLow = personRanks.deathyear_rank_unique
    ? Math.max(
        1,
        parseInt(personRanks.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE
      )
    : "9999";
  const deathYearRankHigh = personRanks.deathyear_rank_unique
    ? Math.max(
        NUM_RANKINGS,
        parseInt(personRanks.deathyear_rank_unique, 10) + NUM_RANKINGS_POST
      )
    : "9999";
  const deathYearRankingsData = getDeathYearRankings(
    person.deathyear,
    deathYearRankLow,
    deathYearRankHigh
  );

  const [birthYearRanking, deathYearRanking] = await Promise.all([
    birthYearRankingsData,
    deathYearRankingsData,
  ]);

  const meBy = birthYearRanking.find((rank) => rank.slug === person.slug);

  // return <div>year ranking to come...</div>;

  let betterBirthPeers = null,
    betterDeathPeers = null,
    meDy = null,
    worseBirthPeers = null,
    worseDeathPeers = null;

  const betterRankedBirthPeers = birthYearRanking.filter(
    (p) => p.birthyear_rank_unique < meBy.birthyear_rank_unique
  );
  const worseRankedBirthPeers = birthYearRanking.filter(
    (p) => p.birthyear_rank_unique > meBy.birthyear_rank_unique
  );

  if (betterRankedBirthPeers.length) {
    betterBirthPeers = (
      <span>
        Before{" "}
        {person.gender ? (person.gender === "M" ? "him" : "her") : "them"}{" "}
        {betterRankedBirthPeers.length > 1 ? "are" : "is"}{" "}
        {
          <AnchorList
            items={betterRankedBirthPeers}
            name={(d) =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
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
        {worseRankedBirthPeers.length > 1 ? "are" : "is"}{" "}
        {
          <AnchorList
            items={worseRankedBirthPeers}
            name={(d) =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
            url={(d) => `/profile/person/${d.slug}/`}
          />
        }
        .
      </span>
    );
  }

  if (deathYearRanking.length) {
    meDy = deathYearRanking.find((rank) => rank.slug === person.slug);
    const betterRankedDeathPeers = deathYearRanking.filter(
      (p) => p.deathyear_rank_unique < meDy.deathyear_rank_unique
    );
    const worseRankedDeathPeers = deathYearRanking.filter(
      (p) => p.deathyear_rank_unique > meDy.deathyear_rank_unique
    );
    if (betterRankedDeathPeers.length) {
      betterDeathPeers = (
        <span>
          Before{" "}
          {person.gender ? (person.gender === "M" ? "him" : "her") : "them"}{" "}
          {betterRankedDeathPeers.length > 1 ? "are" : "is"}{" "}
          {
            <AnchorList
              items={betterRankedDeathPeers}
              name={(d) =>
                d.deathcountry
                  ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})`
                  : d.name
              }
              url={(d) => `/profile/person/${d.slug}/`}
            />
          }
          .{" "}
        </span>
      );
    }
    if (worseRankedDeathPeers.length) {
      worseDeathPeers = (
        <span>
          After{" "}
          {person.gender ? (person.gender === "M" ? "him" : "her") : "them"}{" "}
          {worseRankedDeathPeers.length > 1 ? "are" : "is"}{" "}
          {
            <AnchorList
              items={worseRankedDeathPeers}
              name={(d) =>
                d.deathcountry
                  ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})`
                  : d.name
              }
              url={(d) => `/profile/person/${d.slug}/`}
            />
          }
          .
        </span>
      );
    }
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Among people born in {FORMATTERS.year(person.birthyear)},{" "}
          {person.name} ranks{" "}
          <strong>{FORMATTERS.commas(meBy.birthyear_rank)}</strong>.&nbsp;
          {betterBirthPeers}
          {worseBirthPeers}
          {deathYearRanking.length ? (
            <span>
              &nbsp;Among people deceased in {FORMATTERS.year(person.deathyear)}
              , {person.name} ranks <strong>{meDy.deathyear_rank}</strong>
              .&nbsp;
            </span>
          ) : null}
          {betterDeathPeers}
          {worseDeathPeers}
        </p>
        <div className="rank-title">
          <h3>Others Born in {FORMATTERS.year(person.birthyear)}</h3>
          <Link
            href={`/explore/rankings?viz=treemap&show=people&years=${person.birthyear},${person.birthyear}&yearType=birthyear`}
          >
            Go to all Rankings
          </Link>
        </div>
        <PhotoCarousel
          me={person}
          people={birthYearRanking}
          rankAccessor="birthyear_rank_unique"
        />
        {deathYearRanking.length ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>Others Deceased in {FORMATTERS.year(person.deathyear)}</h3>
              <Link
                href={`/explore/rankings?viz=treemap&show=people&years=${person.deathyear},${person.deathyear}&yearType=deathyear`}
              >
                Go to all Rankings
              </Link>
            </div>
            <PhotoCarousel
              me={person}
              people={deathYearRanking}
              rankAccessor="deathyear_rank_unique"
            />
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
