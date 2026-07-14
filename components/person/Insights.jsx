import SectionLayout from "../common/SectionLayout";
import {COLORS_DOMAIN, FORMATTERS} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "./Insights.css";

const MAX_INSIGHTS = 4;

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

// Builds a scored list of data-driven callouts from person_ranks columns and
// the pre-fetched comparison data (peer counts, occupation pageview stats,
// birthday twins) and keeps the top 4. Exported separately so the page can
// decide whether to render the section.
export function buildInsights({
  person,
  personRanks,
  birthdayTwins = [],
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
  const strings = t.person?.insights || getTranslations("en").person.insights;
  if (!person || !personRanks || personRanks.l == null || !strings) return [];

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

  const candidates = [];

  if (occRank === 1 && totalFormatted) {
    candidates.push({
      key: "topOccupation",
      score: 100,
      stat: "#1",
      text: strings.topOccupation({
        name,
        occupationPlural: linkedOccupationPlural,
        totalFormatted,
      }),
    });
  } else if (occRank && occRank <= 10 && total >= 100) {
    candidates.push({
      key: "topOccupationRank",
      score: 70,
      stat: `#${occRank}`,
      text: strings.topOccupationRank({
        name,
        rank: FORMATTERS.commas(occRank),
        occupationPlural: linkedOccupationPlural,
        totalFormatted,
        topPercent: Math.max(1, Math.ceil((occRank / total) * 100)),
      }),
    });
  }

  // Most-viewed in the occupation over the past year: recency-based #1,
  // complements the all-time HPI ranks. Skipped when the all-time #1 card
  // already fires to avoid two near-identical claims.
  const maxViews = occupationPageviews?.pageviews_max;
  const avgViews = occupationPageviews?.pageviews_avg;
  const enoughPeers = occupationPageviews?.num_people >= 20;
  if (occRank !== 1 && enoughPeers && totalViews > 0 && maxViews && totalViews >= maxViews) {
    candidates.push({
      key: "mostViewed",
      score: 92,
      stat: FORMATTERS.bigNum(totalViews),
      text: strings.mostViewed({
        name,
        views: FORMATTERS.bigNum(totalViews),
        occupationPlural: linkedOccupationPlural,
      }),
    });
  } else if (enoughPeers && totalViews > 0 && avgViews > 0) {
    const multiple = Math.round(totalViews / avgViews);
    if (multiple >= 10) {
      candidates.push({
        key: "viewsMultiple",
        score: 52,
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
    candidates.push({
      key: "topCountry",
      score: 88,
      stat: "#1",
      text: strings.topCountry({
        name,
        country,
        totalFormatted: FORMATTERS.commas(countryTotal),
      }),
    });
  } else if (
    cityRank === 1 &&
    personRanks.bplace_name &&
    // Being the most memorable of 1 is a tautology, not an insight
    person.bplace_geonameid?.num_born >= 2 &&
    country
  ) {
    // Country #1 already implies city #1, so only surface the city callout
    // when the person tops their hometown but not their country.
    const city = person.bplace_geonameid.slug
      ? anchor(
          `${localePrefix}/profile/place/${person.bplace_geonameid.slug}`,
          personRanks.bplace_name,
        )
      : escapeHtml(personRanks.bplace_name);
    // For people born before modern nation-states (or with unknown birth
    // year), hedge with "in what is now modern-day {country}".
    const cityTemplate =
      person.birthyear && person.birthyear >= 1800
        ? strings.topCity
        : strings.topCityHistorical;
    // Name the next-most-memorable people born in the same city, linked to
    // their profiles. Empty string when we have no peers so the template omits
    // the "ahead of …" clause entirely.
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
    candidates.push({
      key: "topCity",
      score: 85,
      stat: "#1",
      text: cityTemplate({
        name,
        city,
        country,
        count: FORMATTERS.commas(person.bplace_geonameid.num_born),
        peers,
      }),
    });
  }

  if (
    occRank !== 1 &&
    countryRank !== 1 &&
    countryOccRank === 1 &&
    country &&
    countryOccupationCount
  ) {
    candidates.push({
      key: "topCountryOccupation",
      score: 80,
      stat: "#1",
      text: strings.topCountryOccupation({
        name,
        occupationPlural: linkedOccupationPlural,
        country,
        count: FORMATTERS.commas(countryOccupationCount),
      }),
    });
  }

  // Tiny cohorts (ancient birth years) make "most memorable of N" unimpressive
  const birthyearRank = personRanks.birthyear_rank_unique;
  if (birthyearRank === 1 && person.birthyear && birthyearCount >= 10) {
    candidates.push({
      key: "topBirthyear",
      score: 75,
      stat: "#1",
      text: strings.topBirthyear({
        name,
        year: FORMATTERS.year(person.birthyear),
        count: FORMATTERS.commas(birthyearCount),
      }),
    });
  }

  // Among the handful of earliest-born members of the occupation.
  if (earliestBornCount && earliestBornCount <= 10 && total >= 100) {
    candidates.push({
      key: "earliestBorn",
      score: 72,
      stat: `${earliestBornCount}`,
      text: strings.earliestBorn({
        name,
        count: earliestBornCount,
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  const age = ageAtDeath(person);
  if (age != null && age >= 20 && age <= 45 && occRank && occRank <= 300) {
    candidates.push({
      key: "shortLife",
      score: 68,
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
  if (person.deathyear && globalRank && currentYear - person.deathyear >= 200) {
    const centuries = Math.floor((currentYear - person.deathyear) / 100);
    candidates.push({
      key: "enduringFame",
      score: 65,
      stat: `#${FORMATTERS.commas(globalRank)}`,
      text: strings.enduringFame({
        name,
        centuries,
        rank: FORMATTERS.commas(globalRank),
      }),
    });
  }

  const womenCount = person.occupation?.num_born_women;
  if (
    person.gender === "F" &&
    womenCount >= 1 &&
    total >= 100 &&
    womenCount / total <= 0.25
  ) {
    candidates.push({
      key: "womenPioneer",
      score: 62,
      stat: FORMATTERS.commas(womenCount),
      text: strings.womenPioneer({
        name,
        womenCount: FORMATTERS.commas(womenCount),
        totalFormatted,
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  // Only worth calling out when the edition count actually stands out among
  // occupation peers; percentile comes from getLangEditionContext in the page.
  if (personRanks.l >= 30 && langContext?.percentBelow >= 75) {
    candidates.push({
      key: "globalLangs",
      score: 60,
      stat: `${personRanks.l}`,
      text: strings.globalLangs({
        name,
        count: personRanks.l,
        percent: langContext.percentBelow,
        occupationPlural: linkedOccupationPlural,
      }),
    });
  }

  if (birthdayTwins.length && person.birthdate) {
    const [, m, d] = person.birthdate.split("-");
    if (Number(m) && Number(d)) {
      const dateObj = new Date(Date.UTC(2000, Number(m) - 1, Number(d)));
      const dateFmt = opts =>
        new Intl.DateTimeFormat(lang, {...opts, timeZone: "UTC"}).format(dateObj);
      const twinNames = joinList(
        birthdayTwins.map(twin =>
          twin.slug
            ? anchor(`${localePrefix}/profile/person/${twin.slug}`, twin.name)
            : escapeHtml(twin.name),
        ),
        lang,
      );
      candidates.push({
        key: "birthdayTwin",
        score: 55,
        stat: dateFmt({month: "short", day: "numeric"}),
        text: strings.birthdayTwin({
          name,
          date: dateFmt({month: "long", day: "numeric"}),
          twinNames,
        }),
      });
    }
  }

  const newLangs = personRanks.l_prev ? personRanks.l - personRanks.l_prev : 0;
  if (newLangs >= 5) {
    candidates.push({
      key: "newLangs",
      score: 50,
      stat: `+${newLangs}`,
      text: strings.newLangs({name, count: newLangs}),
    });
  }

  // non_en_page_views is an absolute yearly count, not a share
  const nonEnViews = personRanks.non_en_page_views;
  if (nonEnViews >= 1000000) {
    candidates.push({
      key: "nonEnglish",
      score: 45,
      stat: FORMATTERS.bigNum(nonEnViews),
      text: strings.nonEnglish({name, count: FORMATTERS.bigNum(nonEnViews)}),
    });
  }

  if (!candidates.length && personRanks.hpi != null) {
    candidates.push({
      key: "fallback",
      score: 10,
      stat: `${personRanks.l}`,
      text: strings.fallback({
        name,
        count: personRanks.l,
        hpi: FORMATTERS.decimal(personRanks.hpi),
      }),
    });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, MAX_INSIGHTS);
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
