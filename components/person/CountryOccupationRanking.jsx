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
import {BASE_API} from "@/app/constants";
import {DEFAULT_LOCALE} from "@/app/locales";
import {encodePostgrestValue} from "@/app/utils/postgrest";

async function getBirthCountryRankings(
  occupationId,
  birthCountryId,
  bplaceCountryOccupationRankLow,
  bplaceCountryOccupationRankHigh
) {
  try {
    const encodedOccupationId = encodePostgrestValue(occupationId);
    const res = await fetch(
      `${BASE_API}/person_ranks?occupation=eq.${encodedOccupationId}&bplace_country=eq.${birthCountryId}&bplace_country_occupation_rank_unique=gte.${bplaceCountryOccupationRankLow}&bplace_country_occupation_rank_unique=lte.${bplaceCountryOccupationRankHigh}&order=bplace_country_occupation_rank_unique&select=bplace_country,occupation,hpi,slug,bplace_country_occupation_rank,bplace_country_occupation_rank_unique,gender,name,id,deathyear,birthyear`
    );
    if (!res.ok) {
      console.error(`[getBirthCountryRankings] HTTP ${res.status}`);
      return [];
    }
    const text = await res.text();
    if (text.startsWith("<")) {
      console.error(`[getBirthCountryRankings] Got HTML instead of JSON`);
      return [];
    }
    return JSON.parse(text);
  } catch (e) {
    console.error(`[getBirthCountryRankings] Error: ${e.message}`);
    return [];
  }
}

export default async function CountryRanking({
  person,
  personRanks,
  title,
  slug,
  lang = "en",
}) {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

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
  if (!me) {
    return (
      <SectionLayout slug={slug} title={title}>
        <p>
          {person.name} is not ranked in {person.bplace_country.country}
        </p>
      </SectionLayout>
    );
  }
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
            url={d => `${localePrefix}/profile/person/${d.slug}/`}
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
            url={d => `${localePrefix}/profile/person/${d.slug}/`}
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
          <a href={`${localePrefix}/profile/country/${person.bplace_country.slug}`}>
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
              href={`${localePrefix}/profile/occupation/${person.occupation.occupation_slug}/country/${person.bplace_country.slug}`}
            >
              {person.bplace_country.demonym} born{" "}
              {toTitleCase(plural(person.occupation.occupation.toLowerCase()))}
            </a>
          </h3>
          <a
            href={`${localePrefix}/explore/rankings?show=people&place=${person.bplace_country.country_code}&occupation=${person.occupation.id}`}
          >
            Go to all Rankings
          </a>
        </div>
        <PhotoCarousel
          me={person}
          people={birthCountryRankings}
          rankAccessor="bplace_country_occupation_rank_unique"
          localePrefix={localePrefix}
        />
      </div>
    </SectionLayout>
  );
}
