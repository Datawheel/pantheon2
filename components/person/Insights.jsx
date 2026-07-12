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

// Builds a scored list of data-driven callouts from person_ranks columns
// (occupation/country/city/birthyear #1s, language-edition reach, non-English
// pageview share, longevity of fame, birthday twins) and keeps the top 3.
// Exported separately so the page can decide whether to render the section.
export function buildInsights({person, personRanks, birthdayTwin, langContext, occupationPlural, lang = "en"}) {
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

  if (countryRank === 1 && country) {
    candidates.push({
      key: "topCountry",
      score: 88,
      stat: "#1",
      text: strings.topCountry({name, country}),
    });
  } else if (cityRank === 1 && personRanks.bplace_name) {
    // Country #1 already implies city #1, so only surface the city callout
    // when the person tops their hometown but not their country.
    const city = person.bplace_geonameid?.slug
      ? anchor(
          `${localePrefix}/profile/place/${person.bplace_geonameid.slug}`,
          personRanks.bplace_name,
        )
      : escapeHtml(personRanks.bplace_name);
    candidates.push({
      key: "topCity",
      score: 85,
      stat: "#1",
      text: strings.topCity({name, city}),
    });
  }

  if (occRank !== 1 && countryRank !== 1 && countryOccRank === 1 && country) {
    candidates.push({
      key: "topCountryOccupation",
      score: 80,
      stat: "#1",
      text: strings.topCountryOccupation({
        name,
        occupationPlural: linkedOccupationPlural,
        country,
      }),
    });
  }

  const birthyearRank = personRanks.birthyear_rank_unique;
  if (birthyearRank === 1 && person.birthyear) {
    candidates.push({
      key: "topBirthyear",
      score: 75,
      stat: "#1",
      text: strings.topBirthyear({name, year: FORMATTERS.year(person.birthyear)}),
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

  if (birthdayTwin && person.birthdate) {
    const [, m, d] = person.birthdate.split("-");
    if (Number(m) && Number(d)) {
      const dateObj = new Date(Date.UTC(2000, Number(m) - 1, Number(d)));
      const dateFmt = opts =>
        new Intl.DateTimeFormat(lang, {...opts, timeZone: "UTC"}).format(dateObj);
      candidates.push({
        key: "birthdayTwin",
        score: 55,
        stat: dateFmt({month: "short", day: "numeric"}),
        text: strings.birthdayTwin({
          name,
          date: dateFmt({month: "long", day: "numeric"}),
          twinName: birthdayTwin.slug
            ? anchor(
                `${localePrefix}/profile/person/${birthdayTwin.slug}`,
                birthdayTwin.name,
              )
            : escapeHtml(birthdayTwin.name),
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
