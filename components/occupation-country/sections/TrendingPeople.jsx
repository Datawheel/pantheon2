import Link from "next/link";
import {plural} from "pluralize";
import PersonImage from "../../utils/PersonImage";
import {FORMATTERS} from "../../utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {DEFAULT_LOCALE, getLocalizedLanguageName} from "@/app/locales";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {getTranslations} from "@/app/translations";
import {toTitleCase} from "../../utils/vizHelpers";
import TrendingReasonToggle from "./TrendingReasonToggle";
import "./TrendingPeople.css";

async function safeFetchJson(url, options = {}, fallback = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return fallback;
    const text = await res.text();
    if (text.startsWith("<")) return fallback;
    return JSON.parse(text);
  } catch (e) {
    return fallback;
  }
}

const ONE_WEEK_DAYS = 7;

function getWeekStartDate() {
  const start = new Date();
  start.setDate(start.getDate() - ONE_WEEK_DAYS);
  return start.toISOString().split("T")[0];
}

function isBetterTrend(candidate, current) {
  const candidateRank = candidate.rank_pantheon ?? Number.POSITIVE_INFINITY;
  const currentRank = current.rank_pantheon ?? Number.POSITIVE_INFINITY;
  if (candidateRank !== currentRank) return candidateRank < currentRank;

  const candidateViews = candidate.views ?? -1;
  const currentViews = current.views ?? -1;
  if (candidateViews !== currentViews) return candidateViews > currentViews;

  const candidateDate = candidate.date || "";
  const currentDate = current.date || "";
  return candidateDate > currentDate;
}

function formatTrendDate(dateStr, locale) {
  if (!dateStr) return null;
  const dateObj = new Date(`${dateStr}T12:00:00Z`);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(dateObj);
}

function formatLanguageRanks(langRanks, locale) {
  if (!langRanks || langRanks.length === 0) return null;
  const parts = langRanks.map(({code, rank}) => {
    const name = getLocalizedLanguageName(code, locale);
    if (rank !== undefined && rank !== null && Number.isFinite(rank)) {
      return `${name} (#${rank})`;
    }
    return name;
  });
  try {
    return new Intl.ListFormat(locale, {style: "long", type: "conjunction"}).format(parts);
  } catch (e) {
    return parts.join(", ");
  }
}

function buildTrendReason({trend, languageRanks, translations}, locale) {
  const langList = formatLanguageRanks(languageRanks, locale);
  const dateLabel = formatTrendDate(trend.date, locale);
  const parts = [];
  const viewsLabel = translations.viewsLabel || "views";
  const onDate = translations.onDate
    ? translations.onDate({date: dateLabel})
    : dateLabel
      ? `on ${dateLabel}`
      : null;

  if (trend.views) {
    parts.push(`${trend.views.toLocaleString(locale)} ${viewsLabel}`);
  }
  if (onDate) {
    parts.push(onDate);
  }

  const detail = parts.length ? ` (${parts.join(", ")})` : "";
  const trendingInPrefix = translations.trendingInPrefix || "Trending in";

  if (langList) {
    return `${trendingInPrefix} ${langList} Wikipedia${detail}.`;
  }
  if (parts.length) {
    return `${translations.trendingThisWeekShort || "Trending this week"}${detail}.`;
  }
  return translations.trendingThisWeekDefault || "Trending this week on Wikipedia.";
}

async function fetchTrendRows({occupationId, countryValue, weekStart}) {
  const trendUrl = `${BASE_API}/trend?bplace_country=eq.${encodePostgrestValue(
    countryValue
  )}&occupation=eq.${encodePostgrestValue(
    occupationId
  )}&date=gt.${weekStart}&select=slug,name,pid,rank_pantheon,views,lang,date&limit=1000`;
  return await safeFetchJson(trendUrl, {next: {revalidate: REVALIDATE_PERIODS.SHORT}}, []);
}

async function getTrendingPeopleForOccupationCountry({
  occupationId,
  countryName,
  countrySlug,
  locale,
  translations,
  limit = 10,
}) {
  const weekStart = getWeekStartDate();

  let trendRows = [];
  if (countryName) {
    trendRows = await fetchTrendRows({occupationId, countryValue: countryName, weekStart});
  }
  if (!trendRows.length && countrySlug && countrySlug !== countryName) {
    trendRows = await fetchTrendRows({occupationId, countryValue: countrySlug, weekStart});
  }

  if (!trendRows.length) return [];

  const groupedBySlug = new Map();
  trendRows.forEach(row => {
    if (!row.slug) return;
    const existing = groupedBySlug.get(row.slug) || {
      best: row,
      langRanks: {},
    };

    if (isBetterTrend(row, existing.best)) {
      existing.best = row;
    }

    if (row.lang) {
      const existingRank = existing.langRanks[row.lang];
      const rowRank = row.rank_pantheon ?? Number.POSITIVE_INFINITY;
      if (existingRank === undefined || rowRank < existingRank) {
        existing.langRanks[row.lang] = rowRank;
      }
    }

    groupedBySlug.set(row.slug, existing);
  });

  const deduped = Array.from(groupedBySlug.entries())
    .map(([slug, entry]) => {
      const languageRanks = Object.entries(entry.langRanks)
        .sort((a, b) => {
          const rankDiff = (a[1] ?? Number.POSITIVE_INFINITY) - (b[1] ?? Number.POSITIVE_INFINITY);
          if (rankDiff !== 0) return rankDiff;
          return a[0].localeCompare(b[0]);
        })
        .map(([code, rank]) => ({
          code,
          rank: Number.isFinite(rank) ? rank : null,
        }));
      return {
        ...entry.best,
        slug,
        languageRanks,
      };
    })
    .sort((a, b) => {
      const rankDiff =
        (a.rank_pantheon ?? Number.POSITIVE_INFINITY) -
        (b.rank_pantheon ?? Number.POSITIVE_INFINITY);
      if (rankDiff !== 0) return rankDiff;

      const viewsDiff = (b.views ?? -1) - (a.views ?? -1);
      if (viewsDiff !== 0) return viewsDiff;

      return (b.date || "").localeCompare(a.date || "");
    })
    .slice(0, limit);

  const trendingSlugs = deduped.map(t => `"${t.slug}"`).join(",");
  const fullDataUrl = `${BASE_API}/person?slug=in.(${trendingSlugs})&select=id,name,slug,birthyear,deathyear,occupation(occupation)`;
  const fullData = await safeFetchJson(fullDataUrl, {next: {revalidate: REVALIDATE_PERIODS.SHORT}}, []);
  const fullDataBySlug = new Map(fullData.map(person => [person.slug, person]));

  return deduped.map(trend => {
    const person = fullDataBySlug.get(trend.slug) || {};
    const personId = person.id || trend.pid;
    return {
      ...trend,
      ...person,
      id: personId,
      trendReason: buildTrendReason(
        {trend, languageRanks: trend.languageRanks, translations},
        locale
      ),
    };
  });
}

export default async function TrendingPeople({
  occupation,
  country,
  countryName,
  countrySlug,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const trendingInPrefix = t.news?.trendingIn || tEn.news?.trendingIn;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const occupationPlural = locale === "en"
    ? toTitleCase(plural(occupation.occupation))
    : occupation.occupation;
  const rawFromCountry = country.fromCountry;
  // If fromCountry exists, it's a prepositional form (e.g., "do Japão", "from Japan", "d'Espagne")
  // that should come after the occupation name, not before
  const hasFromPrefix = !!rawFromCountry;
  const locationLabel =
    rawFromCountry || (country.country ? `from ${country.country}` : "");
  const titleLine = tc.trendingTitle
    ? tc.trendingTitle({locationLabel, occupationPlural, hasFromPrefix})
    : locationLabel
      ? hasFromPrefix
        ? `Trending ${occupationPlural} ${locationLabel} This Week`
        : `Trending ${locationLabel} ${occupationPlural} This Week`
      : `Trending ${occupationPlural} This Week`;
  const introLine = tc.trendingIntro
    ? tc.trendingIntro({locationLabel, occupationPlural, hasFromPrefix})
    : locationLabel
      ? hasFromPrefix
        ? `The top 10 ${occupationPlural} ${locationLabel} trending on Wikipedia`
        : `The top 10 ${locationLabel} ${occupationPlural} trending on Wikipedia`
      : `The top 10 ${occupationPlural} trending on Wikipedia`;

  const trendingPeople = await getTrendingPeopleForOccupationCountry({
    occupationId: occupation.id,
    countryName,
    countrySlug,
    locale,
    translations: {
      viewsLabel: tc.viewsLabel,
      onDate: tc.onDate,
      trendingInPrefix,
      trendingThisWeekShort: tc.trendingThisWeekShort,
      trendingThisWeekDefault: tc.trendingThisWeekDefault,
    },
    limit: 10,
  });

  // If no trending people found, don't render the section
  if (!trendingPeople.length) {
    return null;
  }

  return (
    <section className="trending-people-section">
      <div className="trending-people-container">
        <div className="trending-people-header">
          <span className="trending-people-icon">🔥</span>
          <h2 className="trending-people-title">{titleLine}</h2>
        </div>
        <p className="trending-people-intro">
          {tc.trendingIntroSuffix
            ? `${introLine} ${tc.trendingIntroSuffix}`
            : `${introLine} in the past 7 days, with a quick note on what drove the spike.`}
        </p>

        <ol className="trending-people-grid">
          {trendingPeople.map((person, index) => (
            <li key={person.slug} className="trending-person-item">
              <div className="trending-person-card">
                <Link
                  href={`${localePrefix}/profile/person/${person.slug}`}
                  className="trending-person-link"
                >
                  <div className="trending-person-rank">
                    <span className="trend-rank-global">#{index + 1}</span>
                  </div>
                  <div className="trending-person-image">
                    <PersonImage
                      fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                      src={`/profile/people/${person.id}.jpg`}
                      alt={`Photo of ${person.name}`}
                    />
                  </div>
                  <div className="trending-person-content">
                    <h3 className="trending-person-name">{person.name}</h3>
                    <p className="trending-person-dates">
                      {person.birthyear && (
                        person.deathyear
                          ? `${FORMATTERS.year(person.birthyear)} - ${FORMATTERS.year(person.deathyear)}`
                          : `b. ${FORMATTERS.year(person.birthyear)}`
                      )}
                    </p>
                  </div>
                </Link>
                <TrendingReasonToggle
                  reason={person.trendReason}
                  readMoreLabel={tc.readMore}
                  showLessLabel={tc.showLess}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
