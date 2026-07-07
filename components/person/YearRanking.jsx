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
import {BASE_API} from "@/app/constants";
import {getTranslations} from "@/app/translations";

async function getBirthYearRankings(
  birthYear,
  birthYearRankLow,
  birthYearRankHigh
) {
  try {
    const res = await fetch(
      `${BASE_API}/person_ranks?birthyear=eq.${birthYear}&birthyear_rank_unique=gte.${birthYearRankLow}&birthyear_rank_unique=lte.${birthYearRankHigh}&order=birthyear_rank_unique&select=occupation,bplace_country,hpi,birthyear_rank,birthyear_rank_unique,slug,gender,name,id,birthyear,deathyear`
    );
    if (!res.ok) {
      console.error(`[getBirthYearRankings] HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getBirthYearRankings] Got HTML instead of JSON`);
      return [];
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getBirthYearRankings] Error: ${e.message}`);
    return [];
  }
}

async function getDeathYearRankings(
  deathyear,
  deathYearRankLow,
  deathYearRankHigh
) {
  // Living people (or incomplete data) have no death-year cohort to rank against.
  if (
    deathyear === null ||
    deathyear === undefined ||
    deathyear === "" ||
    !Number.isFinite(Number(deathyear)) ||
    !Number.isFinite(Number(deathYearRankLow)) ||
    !Number.isFinite(Number(deathYearRankHigh))
  ) {
    return [];
  }

  try {
    const res = await fetch(
      `${BASE_API}/person_ranks?deathyear=eq.${deathyear}&deathyear_rank_unique=gte.${deathYearRankLow}&deathyear_rank_unique=lte.${deathYearRankHigh}&order=deathyear_rank_unique&select=occupation,dplace_country,hpi,deathyear_rank,deathyear_rank_unique,slug,gender,name,id,deathyear,birthyear`
    );
    if (!res.ok) {
      // 400 is expected for some edge cases (e.g. stale/partial rankings), treat as no data.
      if (res.status !== 400) {
        console.error(`[getDeathYearRankings] HTTP ${res.status}`);
      }
      return [];
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getDeathYearRankings] Got HTML instead of JSON`);
      return [];
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getDeathYearRankings] Error: ${e.message}`);
    return [];
  }
}

export default async function YearRanking({person, personRanks, title, slug, lang = "en"}) {
  const t = getTranslations(lang);
  if (!person.birthyear || !personRanks || !personRanks.birthyear_rank_unique) {
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
  const hasDeathYearRanking =
    person.deathyear !== null &&
    person.deathyear !== undefined &&
    person.deathyear !== "" &&
    personRanks.deathyear_rank_unique;

  const deathYearRankLow = hasDeathYearRanking
    ? Math.max(
        1,
        parseInt(personRanks.deathyear_rank_unique, 10) - NUM_RANKINGS_PRE
      )
    : null;
  const deathYearRankHigh = hasDeathYearRanking
    ? Math.max(
        NUM_RANKINGS,
        parseInt(personRanks.deathyear_rank_unique, 10) + NUM_RANKINGS_POST
      )
    : null;
  const deathYearRankingsData = hasDeathYearRanking
    ? getDeathYearRankings(person.deathyear, deathYearRankLow, deathYearRankHigh)
    : Promise.resolve([]);

  const [birthYearRanking, deathYearRanking] = await Promise.all([
    birthYearRankingsData,
    deathYearRankingsData,
  ]);

  const meBy = birthYearRanking.find(rank => rank.slug === person.slug);

  // If person not found in birth year rankings (can happen with stale cache), return null
  if (!meBy) {
    return null;
  }

  // return <div>year ranking to come...</div>;

  let betterBirthPeers = null,
    betterDeathPeers = null,
    meDy = null,
    worseBirthPeers = null,
    worseDeathPeers = null;

  const betterRankedBirthPeers = birthYearRanking.filter(
    p => p.birthyear_rank_unique < meBy.birthyear_rank_unique
  );
  const worseRankedBirthPeers = birthYearRanking.filter(
    p => p.birthyear_rank_unique > meBy.birthyear_rank_unique
  );

  if (betterRankedBirthPeers.length) {
    betterBirthPeers = (
      <span>
        {t.person.ranking.beforePeers({
          gender: person.gender,
          count: betterRankedBirthPeers.length,
        })}
        {
          <AnchorList
            items={betterRankedBirthPeers}
            name={d =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
            url={d => `/profile/person/${d.slug}/`}
            andWord={t.person.ranking.and}
          />
        }
        .{" "}
      </span>
    );
  }
  if (worseRankedBirthPeers.length) {
    worseBirthPeers = (
      <span>
        {t.person.ranking.afterPeers({
          gender: person.gender,
          count: worseRankedBirthPeers.length,
        })}
        {
          <AnchorList
            items={worseRankedBirthPeers}
            name={d =>
              d.birthcountry
                ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
                : d.name
            }
            url={d => `/profile/person/${d.slug}/`}
            andWord={t.person.ranking.and}
          />
        }
        .
      </span>
    );
  }

  if (deathYearRanking.length) {
    meDy = deathYearRanking.find(rank => rank.slug === person.slug);

    // Only process death year peers if person found in rankings
    if (meDy) {
      const betterRankedDeathPeers = deathYearRanking.filter(
        p => p.deathyear_rank_unique < meDy.deathyear_rank_unique
      );
      const worseRankedDeathPeers = deathYearRanking.filter(
        p => p.deathyear_rank_unique > meDy.deathyear_rank_unique
      );
    if (betterRankedDeathPeers.length) {
      betterDeathPeers = (
        <span>
          {t.person.ranking.beforePeers({
            gender: person.gender,
            count: betterRankedDeathPeers.length,
          })}
          {
            <AnchorList
              items={betterRankedDeathPeers}
              name={d =>
                d.deathcountry
                  ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})`
                  : d.name
              }
              url={d => `/profile/person/${d.slug}/`}
              andWord={t.person.ranking.and}
            />
          }
          .{" "}
        </span>
      );
    }
    if (worseRankedDeathPeers.length) {
      worseDeathPeers = (
        <span>
          {t.person.ranking.afterPeers({
            gender: person.gender,
            count: worseRankedDeathPeers.length,
          })}
          {
            <AnchorList
              items={worseRankedDeathPeers}
              name={d =>
                d.deathcountry
                  ? `${d.name} (${d.deathcountry.country_code.toUpperCase()})`
                  : d.name
              }
              url={d => `/profile/person/${d.slug}/`}
              andWord={t.person.ranking.and}
            />
          }
          .
        </span>
      );
    }
    }
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: t.person.ranking.amongBornYearRanks({
                year: FORMATTERS.year(person.birthyear),
                name: person.name,
                rankHtml: `<strong>${FORMATTERS.commas(meBy.birthyear_rank)}</strong>`,
              }),
            }}
          />
          &nbsp;
          {betterBirthPeers}
          {worseBirthPeers}
          {deathYearRanking.length && meDy ? (
            <span>
              &nbsp;
              <span
                dangerouslySetInnerHTML={{
                  __html: t.person.ranking.amongDeceasedYearRanks({
                    year: FORMATTERS.year(person.deathyear),
                    name: person.name,
                    rankHtml: `<strong>${meDy.deathyear_rank}</strong>`,
                  }),
                }}
              />
              &nbsp;
            </span>
          ) : null}
          {betterDeathPeers}
          {worseDeathPeers}
        </p>
        <div className="rank-title">
          <h3>
            {t.person.ranking.othersBornInYear({
              year: FORMATTERS.year(person.birthyear),
            })}
          </h3>
          <Link
            href={`/explore/rankings?viz=treemap&show=people&years=${person.birthyear},${person.birthyear}&yearType=birthyear`}
          >
            {t.person.ranking.goToAllRankings}
          </Link>
        </div>
        <PhotoCarousel
          me={person}
          people={birthYearRanking}
          rankAccessor="birthyear_rank_unique"
          showOccupation={true}
          lang={lang}
        />
        {deathYearRanking.length && meDy ? (
          <div className="rank-sec-body">
            <div className="rank-title">
              <h3>
                {t.person.ranking.othersDeceasedInYear({
                  year: FORMATTERS.year(person.deathyear),
                })}
              </h3>
              <Link
                href={`/explore/rankings?viz=treemap&show=people&years=${person.deathyear},${person.deathyear}&yearType=deathyear`}
              >
                {t.person.ranking.goToAllRankings}
              </Link>
            </div>
            <PhotoCarousel
              me={person}
              people={deathYearRanking}
              rankAccessor="deathyear_rank_unique"
              showOccupation={true}
              lang={lang}
            />
          </div>
        ) : null}
      </div>
    </SectionLayout>
  );
}
