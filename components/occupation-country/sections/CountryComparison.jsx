import {DEFAULT_LOCALE} from "@/app/locales";
import {
  cap,
  formatNumber,
  formatShare,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import {formatPair, getVsStrings} from "@/app/occupationCountryVsTranslations";
import {pickRivals, rowSlug, vsPath} from "../vs";
import "./OccupationCountry.css";

const TOP = 10;

// Where this country stands among all countries for the occupation. Every
// row links to that country's page for the same occupation, so the
// section doubles as crawlable cross-links between sibling pages.
export default function CountryComparison({data, names, locale = DEFAULT_LOCALE}) {
  const {occupation, country, standings, stats} = data;
  if (standings.length < 2 || !stats.rank) return null;

  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const max = standings[0].num_people || 1;
  const currentIndex = stats.rank - 1;

  const rows = standings.slice(0, TOP).map((row, i) => ({row, rank: i + 1}));
  let gapAfter = null;
  if (currentIndex >= TOP) {
    gapAfter = TOP;
    const from = Math.max(TOP, currentIndex - 1);
    const to = Math.min(standings.length, currentIndex + 2);
    for (let i = from; i < to; i++) rows.push({row: standings[i], rank: i + 1});
  }

  const params = {
    ...names,
    count: stats.count,
    countFormatted: formatNumber(stats.count, locale),
    rank: stats.rank,
    totalCountries: formatNumber(stats.totalCountries, locale),
    share: stats.share != null ? formatShare(stats.share, locale) : "",
    occTotal: formatNumber(stats.occTotal, locale),
  };

  const vs = getVsStrings(locale);
  const rivals = pickRivals(standings, country.id);
  const rowName = row => row.country_data?.[`${locale}_country`] || row.country_data?.country || row.country;

  return (
    <section className="profile-section oc-section oc-countries" id="countries">
      <h2 className="oc-section-title">{cap(s.countriesTitle(names))}</h2>
      <p className="oc-section-intro">{s.countriesIntro(params)}</p>
      <ol className="oc-bars">
        {rows.map(({row, rank}) => {
          const isCurrent = row.country === country.id;
          const label = row.country_data?.[`${locale}_country`] || row.country_data?.country || row.country;
          const slug = row.country_data?.slug || row.country_slug;
          return (
            <li
              key={row.country}
              className={`oc-bar${isCurrent ? " is-current" : ""}${gapAfter && rank === gapAfter ? " has-gap" : ""}`}
              value={rank}
            >
              <span className="oc-bar-rank">{rank}</span>
              {isCurrent ? (
                <span className="oc-bar-label" aria-current="page">{label}</span>
              ) : (
                <a className="oc-bar-label" href={`${localePrefix}/profile/occupation/${occupation.occupation_slug}/country/${slug}`}>
                  {label}
                </a>
              )}
              <span className="oc-bar-track" aria-hidden="true">
                <span className="oc-bar-fill" style={{"--w": `${Math.max(1.5, (row.num_people / max) * 100)}%`}} />
              </span>
              <span className="oc-bar-value">{formatNumber(row.num_people, locale)}</span>
            </li>
          );
        })}
      </ol>
      {rivals.length > 0 && (
        <nav className="oc-compare" aria-label={vs.compareTitle}>
          <h3 className="oc-compare-title">{vs.compareTitle}</h3>
          <ul className="oc-compare-list">
            {rivals.map(row => (
              <li key={row.country}>
                <a href={`${localePrefix}${vsPath(occupation.occupation_slug, country.slug, rowSlug(row))}`}>
                  {formatPair(names.country, rowName(row), locale)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
