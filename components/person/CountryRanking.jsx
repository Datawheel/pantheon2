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
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";

async function getBirthCountryRankings(
  birthCountryId,
  birthCountryRankLow,
  birthCountryRankHigh
) {
  try {
    const res = await fetch(
      `${BASE_API}/person_ranks?bplace_country=eq.${birthCountryId}&bplace_country_rank_unique=gte.${birthCountryRankLow}&bplace_country_rank_unique=lte.${birthCountryRankHigh}&order=bplace_country_rank_unique&select=bplace_country,hpi,bplace_country_rank,bplace_country_rank_unique,slug,gender,name,id,deathyear,birthyear,occupation`
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
  const t = getTranslations(lang);

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
  const me = birthCountryRankings.find(rank => rank.slug === person.slug);

  // If person not found in rankings (can happen with stale cache), return null
  if (!me) {
    return null;
  }

  const betterRankedBirthPeers = birthCountryRankings.filter(
    p => p.bplace_country_rank_unique < me.bplace_country_rank_unique
  );
  const worseRankedBirthPeers = birthCountryRankings.filter(
    p => p.bplace_country_rank_unique > me.bplace_country_rank_unique
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
            name={d => `${d.name} (${d.birthyear})`}
            url={d => `${localePrefix}/profile/person/${d.slug}/`}
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
            name={d => `${d.name} (${d.birthyear})`}
            url={d => `${localePrefix}/profile/person/${d.slug}/`}
            andWord={t.person.ranking.and}
          />
        }
        .
      </span>
    );
  }

  const countryHtml = `<a href="${localePrefix}/profile/country/${person.bplace_country.slug}">${person.bplace_country.country}</a>`;

  return (
    <SectionLayout slug={slug} title={title}>
      <div>
        <p>
          <span
            dangerouslySetInnerHTML={{
              __html: t.person.ranking.amongBornCountryRanks({
                countryHtml,
                name: person.name,
                rankHtml: `<strong>${FORMATTERS.commas(me.bplace_country_rank_unique)}</strong>`,
                totalFormatted: FORMATTERS.commas(person.bplace_country.num_born),
              }),
            }}
          />
          &nbsp;
          {betterBirthPeers}
          {worseBirthPeers}
          {/* { ranking.deathcountryPeers.length
             ? <span>&nbsp;Among people deceased in <a href={`${localePrefix}/profile/country/${person.deathcountry.slug}`}>{person.deathcountry.name}</a>, {person.name} ranks {ranking.me.deathcountry_rank_unique} out of {person.deathcountry.num_died}.&nbsp;</span>
             : null} */}
        </p>
        <div className="rank-title">
          <h3
            dangerouslySetInnerHTML={{
              __html: t.person.ranking.othersBornInCountry({countryHtml}),
            }}
          />
          <a
            href={`${localePrefix}/explore/rankings?show=people&place=${person.bplace_country.country_code}`}
          >
            {t.person.ranking.goToAllRankings}
          </a>
        </div>
        <PhotoCarousel
          me={person}
          people={birthCountryRankings}
          rankAccessor="bplace_country_rank_unique"
          showOccupation={true}
          localePrefix={localePrefix}
          lang={lang}
        />
      </div>
    </SectionLayout>
  );
}
