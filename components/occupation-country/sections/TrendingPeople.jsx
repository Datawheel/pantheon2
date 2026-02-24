import Link from "next/link";
import {plural} from "pluralize";
import PersonImage from "../../utils/PersonImage";
import {FORMATTERS} from "../../utils/consts";
import {BASE_API, REVALIDATE_PERIODS} from "/app/constants";
import {DEFAULT_LOCALE, getLocalizedLanguageName} from "/app/locales";
import {toTitleCase} from "../../utils/vizHelpers";
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

function buildTrendReason(trend, locale) {
  const langName = trend.lang
    ? getLocalizedLanguageName(trend.lang, locale)
    : null;
  const dateLabel = formatTrendDate(trend.date, locale);
  const parts = [];

  if (trend.rank_pantheon) {
    parts.push(`rank #${trend.rank_pantheon}`);
  }
  if (trend.views) {
    parts.push(`${trend.views.toLocaleString(locale)} views`);
  }

  const detail = parts.length ? ` (${parts.join(", ")})` : "";

  if (langName && dateLabel) {
    return `Trending on ${dateLabel} in ${langName} Wikipedia${detail}.`;
  }
  if (langName) {
    return `Trending in ${langName} Wikipedia${detail}.`;
  }
  if (dateLabel) {
    return `Trending on ${dateLabel}${detail}.`;
  }
  if (parts.length) {
    return `Trending this week${detail}.`;
  }
  return "Trending this week on Wikipedia.";
}

async function fetchTrendRows({occupationId, countryValue, weekStart}) {
  const trendUrl = `${BASE_API}/trend?bplace_country=eq.${encodeURIComponent(
    countryValue
  )}&occupation=eq.${encodeURIComponent(
    occupationId
  )}&date=gt.${weekStart}&select=slug,name,pid,rank_pantheon,views,lang,date&limit=1000`;
  return await safeFetchJson(trendUrl, {next: {revalidate: REVALIDATE_PERIODS.SHORT}}, []);
}

async function getTrendingPeopleForOccupationCountry({
  occupationId,
  countryName,
  countrySlug,
  locale,
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

  const bestBySlug = new Map();
  trendRows.forEach(row => {
    if (!row.slug) return;
    const existing = bestBySlug.get(row.slug);
    if (!existing || isBetterTrend(row, existing)) {
      bestBySlug.set(row.slug, row);
    }
  });

  const deduped = Array.from(bestBySlug.values())
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
      trendReason: buildTrendReason(trend, locale),
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
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const occupationPlural = locale === "en"
    ? toTitleCase(plural(occupation.occupation))
    : occupation.occupation;
  const rawFromCountry = country.fromCountry;
  const hasFromPrefix =
    rawFromCountry && rawFromCountry.toLowerCase().startsWith("from ");
  const locationLabel =
    rawFromCountry || (country.country ? `from ${country.country}` : "");
  const titleLine = locationLabel
    ? hasFromPrefix
      ? `Trending ${occupationPlural} ${locationLabel} This Week`
      : `Trending ${locationLabel} ${occupationPlural} This Week`
    : `Trending ${occupationPlural} This Week`;
  const introLine = locationLabel
    ? hasFromPrefix
      ? `The top 10 ${occupationPlural} ${locationLabel} trending on Wikipedia`
      : `The top 10 ${locationLabel} ${occupationPlural} trending on Wikipedia`
    : `The top 10 ${occupationPlural} trending on Wikipedia`;

  const trendingPeople = await getTrendingPeopleForOccupationCountry({
    occupationId: occupation.id,
    countryName,
    countrySlug,
    locale,
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
          {introLine} in the past 7 days, with a quick note on what drove the spike.
        </p>

        <ol className="trending-people-grid">
          {trendingPeople.map((person, index) => (
            <li key={person.slug} className="trending-person-item">
              <Link
                href={`${localePrefix}/profile/person/${person.slug}`}
                className="trending-person-card"
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
                  {person.trendReason && (
                    <p className="trending-person-reason">{person.trendReason}</p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
