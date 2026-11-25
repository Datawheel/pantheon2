import {HPI_YEAR} from "@/app/constants";
import {getExploreTranslations} from "@/app/exploreTranslations";
import {formatNumber, formatShare, occupationPluralFor} from "@/app/occupationCountryTranslations";
import {getTranslations} from "@/app/translations";
import {localizePath} from "@/app/utils/hreflang";
import {analysisStrings} from "./analysisTranslations";
import OccupationTable from "./OccupationTable";
import {comparisonGeography, rankOccupations} from "./data";

function multiplier(value, locale) {
  return Number.isFinite(value)
    ? `${new Intl.NumberFormat(locale, {maximumSignificantDigits: 3}).format(value)}×`
    : "—";
}

function Track({fraction, benchmark}) {
  return <div className="analysis-track" aria-hidden="true">
    <span style={{width: `${100 * fraction}%`}}/>
    {benchmark != null && <i style={{insetInlineStart: `${100 * benchmark}%`}}/>}
  </div>;
}

function OccupationRanking({sides, metric, locale, labels, empty}) {
  const t = analysisStrings[locale];
  const byRca = metric === "rca";
  const rankings = sides.map(side => rankOccupations(side.fields, metric));
  const scale = Math.max(1, ...rankings.flat().map(row => row[metric]));
  return <div className="analysis-block">
    <div className="analysis-heading">
      <h3>{byRca ? t.rca : t.common}</h3>
      {byRca && <small className="analysis-benchmark">{t.benchmark} · <bdi>{multiplier(1, locale)}</bdi></small>}
    </div>
    <div className="analysis-grid">
      {sides.map((side, index) => <div className="analysis-panel" key={side.path}>
        <h4>{side.label}</h4>
        {rankings[index].length ? <ol className="analysis-list">
          {rankings[index].map(row => <li key={row.occupation_slug}>
            <div className="analysis-row">
              <a href={localizePath(locale, `/profile/occupation/${row.occupation_slug}/country/${side.country.slug}`)}>
                {labels.get(row.occupation_slug)}
              </a>
              <span className="analysis-value">
                <strong>{byRca ? multiplier(row.rca, locale) : formatNumber(row.num_people, locale)}</strong>
                <small>{byRca
                  ? `${formatNumber(row.num_people, locale)} / ${formatNumber(row.num_people_country, locale)}`
                  : formatShare(row.num_people / row.num_people_country, locale)}</small>
              </span>
            </div>
            <Track fraction={byRca ? row.rca / scale : row.num_people / row.num_people_country}
              benchmark={byRca ? 1 / scale : null}/>
            {row.leaders?.length > 0 && <ul className="analysis-people">
              {row.leaders.map(person => <li key={person.id}>
                <a href={localizePath(locale, `/profile/person/${person.slug}`)}>{person.localizedName}</a>
              </li>)}
            </ul>}
          </li>)}
        </ol> : <p>{empty}</p>}
      </div>)}
    </div>
  </div>;
}

export function OccupationAnalysis({sides, locale}) {
  const t = analysisStrings[locale];
  const empty = getExploreTranslations(locale)("noDataAvailable");
  const labels = new Map(sides.flatMap(s => s.fields.map(row =>
    [row.occupation_slug, occupationPluralFor(row.occupation_slug, row.info?.label || row.info?.occupation, locale)])));
  const byCountry = sides.map(s => new Map(s.fields.map(row => [row.occupation_slug, row])));
  const alphabetical = [...labels].sort((a, b) => a[1].localeCompare(b[1], locale));
  return <section className="profile-section oc-section country-analysis" id="occupation-comparison" aria-labelledby="occupation-heading">
    <h2 className="oc-section-title" id="occupation-heading">{t.occupations}</h2>
    <p className="oc-section-intro">{t.intro.replace("{year}", new Intl.NumberFormat(locale, {useGrouping: false}).format(HPI_YEAR))}</p>
    <OccupationRanking sides={sides} metric="num_people" locale={locale} labels={labels} empty={empty}/>
    <OccupationRanking sides={sides} metric="rca" locale={locale} labels={labels} empty={empty}/>
    {labels.size > 0 && <details className="analysis-details">
      <summary>{t.all} ({formatNumber(labels.size, locale)})</summary>
      <OccupationTable caption={t.all} locale={locale} empty={empty}
        headings={{occupation: getTranslations(locale).nav.occupations, count: t.records, rca: "RCA"}}
        sides={sides.map((side, i) => ({key: side.path, label: side.label, missing: !byCountry[i].size}))}
        rows={alphabetical.map(([slug, label]) => {
          const cells = byCountry.map(map => {
            const row = map.get(slug);
            const count = row?.num_people ?? 0;
            return {count, rca: count ? row.rca : 0};
          });
          return {
            slug, label,
            values: cells.flatMap(({count, rca}) => [count, rca]),
            text: cells.flatMap(({count, rca}) => [formatNumber(count, locale), count ? multiplier(rca, locale) : "—"]),
            // Each non-zero count links to that occupation's list for the country.
            hrefs: cells.map(({count}, i) => count
              ? localizePath(locale, `/profile/occupation/${slug}/country/${sides[i].country.slug}`)
              : null),
          };
        })}/>
    </details>}
  </section>;
}

function PeakPlaceShare({summaries, event, sides, locale}) {
  const [first, second] = summaries.map(summary => summary[event].top[0]?.share);
  if (first == null || second == null || first === second) return null;
  const leader = sides[first > second ? 0 : 1];
  return <small className="place-peak">{analysisStrings[locale].peak} · <strong>{leader.label} ({formatShare(Math.max(first, second), locale)})</strong></small>;
}

export async function PlaceAnalysis({sides, locale}) {
  const t = analysisStrings[locale];
  const summaries = await comparisonGeography(sides, locale);
  const decimal = new Intl.NumberFormat(locale, {maximumFractionDigits: 1});
  return <section className="profile-section oc-section country-analysis" id="place-comparison" aria-labelledby="place-heading">
    <h2 className="oc-section-title" id="place-heading">{t.geography}</h2>
    <p className="oc-section-intro">{t.geoIntro}</p>
    {["births", "deaths"].map(event => <div key={event} className="analysis-block">
      <div className="analysis-heading">
        <h3>{t[event]}</h3>
        <PeakPlaceShare summaries={summaries} event={event} sides={sides} locale={locale}/>
      </div>
      <div className="analysis-grid">{summaries.map((summary, index) => {
        const dist = summary[event];
        return <div className="analysis-panel" key={sides[index].path}>
          <h4>{sides[index].label}</h4>
          {dist.total ? <>
            <dl className="place-stats">
              {[[t.effective, decimal.format(dist.effective)], [t.places, formatNumber(dist.distinct, locale)],
                [t.records, formatNumber(dist.total, locale)]].map(([label, value]) =>
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <ol className="analysis-list">{dist.top.map(p => <li key={p.id}>
              <div className="analysis-row">
                {p.slug ? <a href={localizePath(locale, `/profile/place/${p.slug}`)}>{p.name}</a> : <span>{p.name}</span>}
                <span className="analysis-value"><strong>{formatShare(p.share, locale)}</strong>
                  <small>{formatNumber(p.count, locale)} / {formatNumber(dist.total, locale)}</small></span>
              </div>
              <Track fraction={p.share}/>
            </li>)}</ol>
          </> : <p>{getExploreTranslations(locale)("noDataAvailable")}</p>}
        </div>;
      })}</div>
    </div>)}
  </section>;
}
