import SectionLayout from "../common/SectionLayout";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "./Insights.css";

const MAX_INSIGHTS = 3;

const escapeHtml = s =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const anchor = (href, label) => `<a href="${href}">${escapeHtml(label)}</a>`;

// Exact age when full dates exist, otherwise the year difference.
function ageAtDeath(person) {
  if (person.birthdate && person.deathdate) {
    const born = new Date(person.birthdate);
    const died = new Date(person.deathdate);
    if (!Number.isNaN(born.getTime()) && !Number.isNaN(died.getTime())) {
      let age = died.getUTCFullYear() - born.getUTCFullYear();
      const monthDiff = died.getUTCMonth() - born.getUTCMonth();
      if (monthDiff < 0 || (monthDiff === 0 && died.getUTCDate() < born.getUTCDate())) {
        age -= 1;
      }
      return age;
    }
  }
  if (person.birthyear && person.deathyear) {
    return person.deathyear - person.birthyear;
  }
  return null;
}

function joinList(items, lang) {
  try {
    return new Intl.ListFormat(lang, {style: "long", type: "conjunction"}).format(items);
  } catch {
    return items.join(", ");
  }
}

function topPercent(rank, total) {
  if (!rank || !total || rank > total) return null;
  return Math.max(1, Math.ceil((rank / total) * 100));
}

function rankStrength(rank, total) {
  if (!rank || !total || rank > total) return 0;
  return Math.log10(total / rank);
}

function rankStat(rank, total) {
  const formattedTotal = total < 10000
    ? FORMATTERS.commas(total)
    : FORMATTERS.bigNum(total);
  return `#${FORMATTERS.commas(rank)} / ${formattedTotal}`;
}

function movementStat(value) {
  return value < 10000 ? FORMATTERS.commas(value) : FORMATTERS.bigNum(value);
}

// Selects one insight per editorial dimension instead of filling the section
// with overlapping ranks. The result answers three different questions when
// the data supports them: where does this person stand out, what changed, and
// how unusually broad is their present-day audience?
export function buildInsights({
  person,
  personRanks,
  langContext,
  birthyearCount,
  countryOccupationCount,
  earliestBornCount,
  cityPeers = [],
  occupationPageviews,
  totalViews = 0,
  occupationPlural,
  lang = "en",
}) {
  const t = getTranslations(lang);
  // Fall back to English strings so a locale missing these keys degrades
  // gracefully instead of crashing the page.
  const strings = {
    ...getTranslations("en").person.insights,
    ...t.person?.insights,
  };
  if (!person || !personRanks) return [];

  // Sentences render via dangerouslySetInnerHTML (same convention as the
  // Intro ranking sentence) so params can carry pre-built profile links.
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const name = escapeHtml(person.name);
  const country = person.bplace_country?.country
    ? person.bplace_country.slug
      ? anchor(
          `${localePrefix}/profile/country/${person.bplace_country.slug}`,
          person.bplace_country.country,
        )
      : escapeHtml(person.bplace_country.country)
    : null;
  const linkedOccupationPlural = person.occupation?.occupation_slug
    ? anchor(
        `${localePrefix}/profile/occupation/${person.occupation.occupation_slug}`,
        occupationPlural,
      )
    : escapeHtml(occupationPlural);
  const total = person.occupation?.num_born;
  const totalFormatted = total ? FORMATTERS.commas(total) : null;

  const occRank = personRanks.occupation_rank_unique || personRanks.occupation_rank;
  const countryRank = personRanks.bplace_country_rank_unique || personRanks.bplace_country_rank;
  const countryOccRank =
    personRanks.bplace_country_occupation_rank_unique ||
    personRanks.bplace_country_occupation_rank;
  const cityRank = personRanks.bplace_name_rank_unique;
  const globalRank = personRanks.rank_unique || personRanks.rank;

  const distinctionCandidates = [];
  const addRankCandidate = ({key, rank, cohortTotal, text, minCohort = 10}) => {
    const percent = topPercent(rank, cohortTotal);
    if (
      !percent ||
      cohortTotal < minCohort ||
      (rank !== 1 && percent > 10)
    ) return;
    distinctionCandidates.push({
      key,
      kind: "distinction",
      score: 78 + Math.min(20, rankStrength(rank, cohortTotal) * 6),
      stat: rankStat(rank, cohortTotal),
      text,
    });
  };

  if (occRank === 1 && totalFormatted) {
    addRankCandidate({
      key: "topOccupation",
      rank: occRank,
      cohortTotal: total,
      minCohort: 30,
      text: strings.topOccupation({
        name,
        occupationPlural: linkedOccupationPlural,
        totalFormatted,
      }),
    });
  } else if (occRank && total) {
    const percent = topPercent(occRank, total);
    addRankCandidate({
      key: "topOccupationRank",
      rank: occRank,
      cohortTotal: total,
      minCohort: 30,
      text: strings.topOccupationRank({
        name,
        rank: FORMATTERS.commas(occRank),
        occupationPlural: linkedOccupationPlural,
        totalFormatted,
        topPercent: percent,
      }),
    });
  }

  // Most-viewed in the occupation over the past year: recency-based #1,
  // complements the all-time HPI ranks. Skipped when the all-time #1 card
  // already fires to avoid two near-identical claims.
  const maxViews = occupationPageviews?.pageviews_max;
  const avgViews = occupationPageviews?.pageviews_avg;
  const enoughPeers = occupationPageviews?.num_people >= 20;
  const reachCandidates = [];
  if (enoughPeers && totalViews > 0 && maxViews && totalViews >= maxViews) {
    reachCandidates.push({
      key: "mostViewed",
      kind: "reach",
      score: 92,
      stat: FORMATTERS.bigNum(totalViews),
      text: strings.mostViewed({
        name,
        views: FORMATTERS.bigNum(totalViews),
        occupationPlural: linkedOccupationPlural,
      }),
    });
  } else if (enoughPeers && totalViews > 0 && avgViews > 0) {
    const rawMultiple = totalViews / avgViews;
    const multiple = rawMultiple >= 10
      ? Math.round(rawMultiple)
      : Math.round(rawMultiple * 10) / 10;
    if (rawMultiple >= 2.5) {
      reachCandidates.push({
        key: "viewsMultiple",
        kind: "reach",
        score: 76 + Math.min(12, multiple),
        stat: `${FORMATTERS.commas(multiple)}×`,
        text: strings.viewsMultiple({
          name,
          views: FORMATTERS.bigNum(totalViews),
          multiple: FORMATTERS.commas(multiple),
          occupationPlural: linkedOccupationPlural,
        }),
      });
    }
  }

  const countryTotal = person.bplace_country?.num_born;
  if (countryRank === 1 && country && countryTotal) {
    addRankCandidate({
      key: "topCountry",
      rank: countryRank,
      cohortTotal: countryTotal,
      minCohort: 30,
      text: strings.topCountry({
        name,
        country,
        totalFormatted: FORMATTERS.commas(countryTotal),
      }),
    });
  } else if (countryRank && country && countryTotal) {
    const percent = topPercent(countryRank, countryTotal);
    addRankCandidate({
      key: "countryRank",
      rank: countryRank,
      cohortTotal: countryTotal,
      minCohort: 30,
      text: strings.countryRank({
        name,
        rank: FORMATTERS.commas(countryRank),
        country,
        totalFormatted: FORMATTERS.commas(countryTotal),
        topPercent: percent,
      }),
    });
  }

  const cityTotal = person.bplace_geonameid?.num_born;
  if (cityRank && personRanks.bplace_name && cityTotal >= 10 && country) {
    const city = person.bplace_geonameid.slug
      ? anchor(
          `${localePrefix}/profile/place/${person.bplace_geonameid.slug}`,
          personRanks.bplace_name,
        )
      : escapeHtml(personRanks.bplace_name);
    if (cityRank === 1) {
      const cityTemplate =
        person.birthyear && person.birthyear >= 1800
          ? strings.topCity
          : strings.topCityHistorical;
      const peers = cityPeers.length
        ? joinList(
            cityPeers.map(peer =>
              peer.slug
                ? anchor(`${localePrefix}/profile/person/${peer.slug}`, peer.name)
                : escapeHtml(peer.name),
            ),
            lang,
          )
        : "";
      addRankCandidate({
        key: "topCity",
        rank: cityRank,
        cohortTotal: cityTotal,
        text: cityTemplate({
          name,
          city,
          country,
          count: FORMATTERS.commas(cityTotal),
          peers,
        }),
      });
    } else {
      const percent = topPercent(cityRank, cityTotal);
      addRankCandidate({
        key: "cityRank",
        rank: cityRank,
        cohortTotal: cityTotal,
        text: strings.cityRank({
          name,
          rank: FORMATTERS.commas(cityRank),
          city,
          country,
          count: FORMATTERS.commas(cityTotal),
          topPercent: percent,
        }),
      });
    }
  }

  if (countryOccRank && country && countryOccupationCount >= 10) {
    if (countryOccRank === 1) {
      addRankCandidate({
        key: "topCountryOccupation",
        rank: countryOccRank,
        cohortTotal: countryOccupationCount,
        text: strings.topCountryOccupation({
          name,
          occupationPlural: linkedOccupationPlural,
          country,
          count: FORMATTERS.commas(countryOccupationCount),
        }),
      });
    } else {
      const percent = topPercent(countryOccRank, countryOccupationCount);
      addRankCandidate({
        key: "countryOccupationRank",
        rank: countryOccRank,
        cohortTotal: countryOccupationCount,
        text: strings.countryOccupationRank({
          name,
          rank: FORMATTERS.commas(countryOccRank),
          occupationPlural: linkedOccupationPlural,
          country,
          count: FORMATTERS.commas(countryOccupationCount),
          topPercent: percent,
        }),
      });
    }
  }

  // Tiny cohorts (ancient birth years) make "most memorable of N" unimpressive
  const birthyearRank = personRanks.birthyear_rank_unique;
  if (birthyearRank === 1 && person.birthyear && birthyearCount >= 10) {
    addRankCandidate({
      key: "topBirthyear",
      rank: birthyearRank,
      cohortTotal: birthyearCount,
      text: strings.topBirthyear({
        name,
        year: FORMATTERS.year(person.birthyear),
        count: FORMATTERS.commas(birthyearCount),
      }),
    });
  }

  const legacyCandidates = [];
  // Among the handful of earliest-born members of the occupation.
  if (earliestBornCount && earliestBornCount <= 10 && total >= 100) {
    legacyCandidates.push({
      key: "earliestBorn",
      kind: "legacy",
      score: 82,
      stat: `${earliestBornCount}`,
      text: strings.earliestBorn({
        name,
        count: earliestBornCount,
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  const age = ageAtDeath(person);
  const occupationPercent = topPercent(occRank, total);
  if (
    age != null &&
    age >= 20 &&
    age <= 45 &&
    occupationPercent &&
    occupationPercent <= 2
  ) {
    legacyCandidates.push({
      key: "shortLife",
      kind: "legacy",
      score: 80,
      stat: `${age}`,
      text: strings.shortLife({
        name,
        age,
        rank: FORMATTERS.commas(occRank),
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  const currentYear = new Date().getFullYear();
  if (
    person.deathyear &&
    globalRank &&
    globalRank <= 500 &&
    currentYear - person.deathyear >= 200
  ) {
    const years = currentYear - person.deathyear;
    legacyCandidates.push({
      key: "enduringFame",
      kind: "legacy",
      score: 78 + Math.max(0, 5 - Math.floor(years / 100)),
      stat: `#${FORMATTERS.commas(globalRank)}`,
      text: strings.enduringFame({
        name,
        years: FORMATTERS.commas(years),
        rank: FORMATTERS.commas(globalRank),
      }),
    });
  }

  // Wikipedia edition count is only an insight when it clears a demanding
  // peer percentile; raw counts alone tend to reward large occupations.
  if (personRanks.l >= 20 && langContext?.percentBelow >= 90) {
    reachCandidates.push({
      key: "globalLangs",
      kind: "reach",
      score: 80 + Math.min(10, langContext.percentBelow - 90),
      stat: `${personRanks.l}`,
      text: strings.globalLangs({
        name,
        count: personRanks.l,
        percent: langContext.percentBelow,
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  const momentumCandidates = [];
  const rankGain = Number(personRanks.rank_delta) || 0;
  const previousRank = Number(personRanks.rank_prev) || 0;
  const relativeGain = previousRank ? rankGain / previousRank : 0;
  if (
    globalRank &&
    previousRank &&
    rankGain >= 25 &&
    (relativeGain >= 0.15 || (rankGain >= 10000 && relativeGain >= 0.05))
  ) {
    momentumCandidates.push({
      key: "rankMomentum",
      kind: "momentum",
      score: 84 + Math.min(10, relativeGain * 10),
      stat: `+${movementStat(rankGain)}`,
      text: strings.rankMomentum({
        name,
        places: FORMATTERS.commas(rankGain),
        previousRank: FORMATTERS.commas(previousRank),
        currentRank: FORMATTERS.commas(globalRank),
      }),
    });
  }

  const newLangs = personRanks.l_prev ? personRanks.l - personRanks.l_prev : 0;
  if (newLangs >= 5) {
    momentumCandidates.push({
      key: "newLangs",
      kind: "momentum",
      score: 72 + Math.min(8, newLangs / 2),
      stat: `+${newLangs}`,
      text: strings.newLangs({name, count: newLangs}),
    });
  }

  const bestByScore = candidates =>
    candidates.sort((a, b) => b.score - a.score)[0];
  const bestDistinction = bestByScore(distinctionCandidates);
  const selected = [
    bestDistinction,
    bestByScore(momentumCandidates),
    bestByScore(reachCandidates),
    bestByScore(legacyCandidates),
  ].filter(Boolean);

  if (!selected.length && personRanks.hpi != null && personRanks.l != null) {
    selected.push({
      key: "fallback",
      kind: "reach",
      score: 10,
      stat: `${personRanks.l}`,
      text: strings.fallback({
        name,
        count: personRanks.l,
        hpi: FORMATTERS.decimal(personRanks.hpi),
      }),
    });
  }

  return selected.sort((a, b) => b.score - a.score).slice(0, MAX_INSIGHTS);
}

export default function Insights({person, insights = [], slug, title}) {
  if (!insights.length) return null;
  const accentColor = COLORS_DOMAIN[person.occupation?.domain_slug];
  return (
    <SectionLayout slug={slug} title={title}>
      <div className="insights-grid">
        {insights.map(insight => (
          <div
            className="insight-card"
            key={insight.key}
            data-kind={insight.kind}
            style={accentColor ? {borderTopColor: accentColor} : undefined}
          >
            <h4
              className="insight-stat"
              style={accentColor ? {color: accentColor} : undefined}
            >
              {insight.stat}
            </h4>
            <p
              className="insight-text"
              dangerouslySetInnerHTML={{__html: insight.text}}
            />
          </div>
        ))}
      </div>
    </SectionLayout>
  );
}
