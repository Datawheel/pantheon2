import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {
  formatNumber,
  formatShare,
  formatYear,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import "../common/Intro.css";
import "./sections/OccupationCountry.css";

export default function Intro({data, names, locale = DEFAULT_LOCALE}) {
  const s = getOcStrings(locale);
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const {occupation, country, stats} = data;

  const params = {
    ...names,
    count: stats.count,
    countFormatted: formatNumber(stats.count, locale),
    rank: stats.rank,
    totalCountries: formatNumber(stats.totalCountries, locale),
    share: stats.share != null ? formatShare(stats.share, locale) : "",
    occTotal: formatNumber(stats.occTotal, locale),
  };

  // summary() is "{lead sentence}{rank sentence}". One-person pages swap
  // the lead for "X is the only Y in Pantheon" instead of "ranks 1 Y".
  const lead = s.summary({...params, rank: null});
  const summary = stats.count === 1 && data.people[0]
    ? s.summarySingle({...params, top: data.people[0].localizedName}) + s.summary(params).slice(lead.length)
    : s.summary(params);

  const facts = [
    {value: params.countFormatted, label: s.statCount(params)},
    stats.rank && {value: `#${stats.rank}`, label: s.statRank(params)},
    stats.share != null && {value: params.share, label: s.statShare},
    stats.rca >= 1.5 && stats.count >= 3 && {
      value: `${new Intl.NumberFormat(locale, {maximumFractionDigits: 1}).format(stats.rca)}×`,
      label: s.statRca,
      hint: s.statRcaHint,
    },
    stats.count >= 3 && {value: formatNumber(stats.women, locale), label: s.statWomen},
    stats.count >= 3 && {value: formatNumber(stats.living, locale), label: s.statLiving},
    stats.count >= 2 && stats.minYear !== stats.maxYear && {
      value: `${formatYear(stats.minYear, locale)}–${formatYear(stats.maxYear, locale)}`,
      label: s.statBorn,
    },
  ].filter(Boolean);

  const allPeopleFromCountry =
    t.occupationCountry?.allPeopleFromCountry || tEn.occupationCountry.allPeopleFromCountry;
  const countryTotal = country.num_born || 0;

  return (
    <section className="intro-section oc-intro">
      <div className="intro-content">
        <div className="intro-text">
          <div className="intro-icon" aria-hidden="true">
            <img src="/images/ui/profile-w.svg" alt="" />
          </div>
          <p className="oc-summary">{summary}</p>
          <dl className="oc-stats">
            {facts.map(fact => (
              <div className="oc-stat" key={fact.label} title={fact.hint}>
                <dt className="oc-stat-label">{fact.label}</dt>
                <dd className="oc-stat-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="oc-intro-links">
            <a className="deep-link" href={`${localePrefix}/profile/occupation/${occupation.occupation_slug}`}>
              {s.allOccWorldwide(names)}
            </a>
            {countryTotal > 0 && (
              <a className="deep-link" href={`${localePrefix}/profile/country/${country.slug}`}>
                {allPeopleFromCountry({
                  totalFormatted: formatNumber(countryTotal, locale),
                  country: names.country,
                  fromCountry: names.fromCountry,
                })}
              </a>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
