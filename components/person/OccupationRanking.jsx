import {plural} from "pluralize";
import Link from "next/link";
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
import {BASE_API} from "@/app/constants";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {getTranslations} from "@/app/translations";

async function getOccupationRankings(
  occupationId,
  occupationRankLow,
  occupationRankHigh
) {
  try {
    const encodedOccupationId = encodePostgrestValue(occupationId);
    const res = await fetch(
      `${BASE_API}/person_ranks?occupation=eq.${encodedOccupationId}&occupation_rank_unique=gte.${occupationRankLow}&occupation_rank_unique=lte.${occupationRankHigh}&order=occupation_rank_unique&select=occupation,bplace_country,hpi,occupation_rank,occupation_rank_unique,slug,gender,name,id,birthyear,deathyear`
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
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getOccupationRankings] Error: ${e.message}`);
    return [];
  }
}

export default async function OccupationRanking({
  person,
  personRanks,
  slug,
  title,
  lang = "en",
}) {
  const t = getTranslations(lang);
  if (
    !personRanks ||
    !person.occupation ||
    !personRanks.occupation_rank_unique
  ) {
    return null;
  }
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
  const me = occupationRankings.find(rank => rank.slug === person.slug);

  // If person not found in rankings (can happen with stale cache), return null
  if (!me) {
    return null;
  }

  const betterRankedPeers = occupationRankings.filter(
    p => p.occupation_rank_unique < me.occupation_rank_unique
  );
  const worseRankedPeers = occupationRankings.filter(
    p => p.occupation_rank_unique > me.occupation_rank_unique
  );

  let betterPeers = null,
    worsePeers = null;

  if (betterRankedPeers.length) {
    betterPeers = (
      <span>
        {t.person.ranking.beforePeers({
          gender: person.gender,
          count: betterRankedPeers.length,
        })}
        <AnchorList
          items={betterRankedPeers}
          name={d =>
            d.birthcountry
              ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
              : d.name
          }
          url={d => `/profile/person/${d.slug}/`}
          andWord={t.person.ranking.and}
        />
        .{" "}
      </span>
    );
  }
  if (worseRankedPeers.length) {
    worsePeers = (
      <span>
        {t.person.ranking.afterPeers({
          gender: person.gender,
          count: worseRankedPeers.length,
        })}
        <AnchorList
          items={worseRankedPeers}
          name={d =>
            d.birthcountry
              ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
              : d.name
          }
          url={d => `/profile/person/${d.slug}/`}
          andWord={t.person.ranking.and}
        />
        .
      </span>
    );
  }

  const occupationPlural =
    lang === "en"
      ? plural(person.occupation.occupation.toLowerCase())
      : person.occupation.occupation;

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: t.person.ranking.amongOccupationRanks({
                occupationPlural,
                name: person.name,
                rankHtml: `<strong>${FORMATTERS.commas(me.occupation_rank)}</strong>`,
                totalFormatted: FORMATTERS.commas(person.occupation.num_born),
              }),
            }}
          />
          &nbsp;
          {betterPeers}
          {worsePeers}
        </p>
        <div className="rank-title">
          <h3>
            {t.person.ranking.mostPopularInWikipedia({
              occupationPlural:
                lang === "en"
                  ? toTitleCase(plural(person.occupation.occupation))
                  : person.occupation.occupation,
            })}
          </h3>
          <Link
            href={`/explore/rankings?show=people&occupation=${person.occupation.id}`}
          >
            {t.person.ranking.goToAllRankings}
          </Link>
        </div>
        <PhotoCarousel
          me={person}
          people={occupationRankings}
          rankAccessor="occupation_rank_unique"
          lang={lang}
        />
      </div>
    </SectionLayout>
  );
}
