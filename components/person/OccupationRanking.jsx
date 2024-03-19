import { plural } from "pluralize";
import Link from "next/link";
import {
  FORMATTERS,
  NUM_RANKINGS,
  NUM_RANKINGS_PRE,
  NUM_RANKINGS_POST,
} from "../utils/consts";
import AnchorList from "../utils/AnchorList";
import PhotoCarousel from "../utils/PhotoCarousel";
import { toTitleCase } from "../utils/vizHelpers";
import SectionLayout from "../common/SectionLayout";

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

export default async function OccupationRanking({
  person,
  personRanks,
  slug,
  title,
}) {
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
  const me = occupationRankings.find((rank) => rank.slug === person.slug);
  const betterRankedPeers = occupationRankings.filter(
    (p) => p.occupation_rank_unique < me.occupation_rank_unique
  );
  const worseRankedPeers = occupationRankings.filter(
    (p) => p.occupation_rank_unique > me.occupation_rank_unique
  );

  let betterPeers = null,
    worsePeers = null;

  if (betterRankedPeers.length) {
    betterPeers = (
      <span>
        Before{" "}
        {person.gender ? (person.gender === "M" ? "him" : "her") : "them"} are{" "}
        <AnchorList
          items={betterRankedPeers}
          name={(d) =>
            d.birthcountry
              ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
              : d.name
          }
          url={(d) => `/profile/person/${d.slug}/`}
        />
        .{" "}
      </span>
    );
  }
  if (worseRankedPeers.length) {
    worsePeers = (
      <span>
        After {person.gender ? (person.gender === "M" ? "him" : "her") : "them"}{" "}
        are{" "}
        <AnchorList
          items={worseRankedPeers}
          name={(d) =>
            d.birthcountry
              ? `${d.name} (${d.birthcountry.country_code.toUpperCase()})`
              : d.name
          }
          url={(d) => `/profile/person/${d.slug}/`}
        />
        .
      </span>
    );
  }

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          Among {plural(person.occupation.occupation.toLowerCase())},{" "}
          {person.name} ranks{" "}
          <strong>{FORMATTERS.commas(me.occupation_rank)}</strong> out of{" "}
          {FORMATTERS.commas(person.occupation.num_born)}.&nbsp;
          {betterPeers}
          {worsePeers}
        </p>
        <div className="rank-title">
          <h3>
            Most Popular {toTitleCase(plural(person.occupation.occupation))} in
            Wikipedia
          </h3>
          <Link
            href={`/explore/rankings?show=people&occupation=${person.occupation.id}`}
          >
            Go to all Rankings
          </Link>
        </div>
        <PhotoCarousel
          me={person}
          people={occupationRankings}
          rankAccessor="occupation_rank_unique"
        />
      </div>
    </SectionLayout>
  );
}
