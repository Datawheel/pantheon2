import PersonImage from "../../utils/PersonImage";
import {HeroMosaic} from "../Header";
import {imagePerson} from "../data";
import {COLORS_DOMAIN} from "../../utils/consts";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {
  cap,
  formatDecimal,
  formatLifespan,
  formatNumber,
  formatYear,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import {getVsStrings} from "@/app/occupationCountryVsTranslations";
import "../../common/Section.css";
import "../../common/Footer.css";
import "../sections/OccupationCountry.css";
import "./Vs.css";

const prefixFor = locale => (locale === DEFAULT_LOCALE ? "" : `/${locale}`);
const ocPath = (occupation, country) =>
  `/profile/occupation/${occupation.occupation_slug}/country/${country.slug}`;

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function VsHeader({model, breadcrumbs, locale = DEFAULT_LOCALE}) {
  const vs = getVsStrings(locale);
  const {occupation, dataA, dataB, countryA, countryB, namesA, namesB, pair, v} = model;
  const localePrefix = prefixFor(locale);
  const a = dataA.people;
  const b = dataB.people;
  // Left half one country, right half the other.
  const mosaic = Math.min(a.length, b.length) >= 4
    ? [a[0], a[1], b[0], b[1], a[2], a[3], b[2], b[3]]
    : [a[0], a[1], b[0], b[1]];
  const sep = locale === "ja" || locale === "zh" ? "：" : ": ";

  return (
    <header
      className="hero occupation-country-hero vs-hero"
      style={{"--hero-accent": COLORS_DOMAIN[occupation.domain_slug] || "#BB3B57"}}
    >
      <HeroMosaic people={mosaic} />
      {breadcrumbs}
      <div className="info">
        {/* Reads "Argentina vs Brazil: Most Famous Soccer Players"; the
            kicker is shown above the pair. */}
        <h1 className="oc-title kicker-after">
          <span className="profile-name">{pair}</span>
          <span className="u-visually-hidden">{sep}</span>
          <span className="profile-type">{vs.kicker(v)}</span>
        </h1>
        <div className="vs-hero-sides">
          <a className="vs-hero-side vs-hero-side--a" href={`${localePrefix}${ocPath(occupation, countryA)}`}>
            <span className="vs-hero-count">{v.nA}</span>
            <span className="vs-hero-country">{namesA.country}</span>
          </a>
          <span className="vs-hero-vs" aria-hidden="true">{vs.vs}</span>
          <a className="vs-hero-side vs-hero-side--b" href={`${localePrefix}${ocPath(occupation, countryB)}`}>
            <span className="vs-hero-count">{v.nB}</span>
            <span className="vs-hero-country">{namesB.country}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* By the numbers                                                             */
/* -------------------------------------------------------------------------- */

function SideLegend({model}) {
  return (
    <div className="vs-legend" aria-hidden="true">
      <span className="vs-legend-item vs-legend-item--a">{model.namesA.country}</span>
      <span className="vs-legend-item vs-legend-item--b">{model.namesB.country}</span>
    </div>
  );
}

function ScoreCell({row, side, locale, localePrefix}) {
  const vs = getVsStrings(locale);
  const cell = row[side];
  const isWinner = row.winner === side;
  return (
    <dd className={`vs-score-cell vs-score-cell--${side}${isWinner ? " is-winner" : ""}`}>
      <span className="vs-score-value">
        {cell.text}
        {isWinner && <span className="u-visually-hidden"> ({vs.leads})</span>}
      </span>
      {cell.person && (
        <a className="vs-score-person" href={`${localePrefix}/profile/person/${cell.person.slug}`}>
          {cell.person.localizedName}
        </a>
      )}
      {row.bar && (
        <span className="vs-score-bar" aria-hidden="true">
          <span style={{"--w": `${side === "a" ? row.widthA : row.widthB}%`}} />
        </span>
      )}
    </dd>
  );
}

export function VsScoreboard({model, locale = DEFAULT_LOCALE}) {
  const vs = getVsStrings(locale);
  const localePrefix = prefixFor(locale);
  return (
    <section className="profile-section oc-section vs-section vs-score" id="numbers">
      <h2 className="oc-section-title">{vs.scoreTitle}</h2>
      <p className="oc-section-intro">{vs.summary(model.v)}</p>
      <div className="vs-score-head" aria-hidden="true">
        <span className="vs-score-head-a">{model.namesA.country}</span>
        <span />
        <span className="vs-score-head-b">{model.namesB.country}</span>
      </div>
      <dl className="vs-score-table">
        {model.rows.map(row => (
          <div className="vs-score-row" key={row.key}>
            <dt className="vs-score-label" title={row.hint}>{row.label}</dt>
            <ScoreCell row={row} side="a" locale={locale} localePrefix={localePrefix} />
            <ScoreCell row={row} side="b" locale={locale} localePrefix={localePrefix} />
          </div>
        ))}
      </dl>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Top 10 head to head                                                        */
/* -------------------------------------------------------------------------- */

function MatchPerson({person, side, isWinner, locale, localePrefix}) {
  if (!person) return <span className={`vs-match-person vs-match-person--${side} is-empty`}>—</span>;
  return (
    <a
      className={`vs-match-person vs-match-person--${side}${isWinner ? " is-winner" : ""}`}
      href={`${localePrefix}/profile/person/${person.slug}`}
    >
      <PersonImage
        person={imagePerson(person)}
        src={`/profile/people/${person.id}.jpg`}
        alt=""
        loading="lazy"
        className="vs-match-avatar"
        wrap={false}
      />
      <span className="vs-match-text">
        <span className="vs-match-name">{person.localizedName}</span>
        <span className="vs-match-meta">
          {formatLifespan(person, locale)}
          {formatLifespan(person, locale) ? " · " : ""}
          HPI {formatDecimal(person.hpi, locale)}
        </span>
      </span>
    </a>
  );
}

export function VsMatchups({model, locale = DEFAULT_LOCALE}) {
  const vs = getVsStrings(locale);
  const localePrefix = prefixFor(locale);
  const contested = model.matchups.filter(m => m.a && m.b).length;
  return (
    <section className="profile-section oc-section vs-section vs-matchups-section" id="head-to-head">
      <h2 className="oc-section-title">{vs.matchupsTitle}</h2>
      <p className="oc-section-intro">{vs.matchupsIntro}</p>
      {contested > 0 && <p className="vs-tally">{vs.matchupsTally(model.tallyParams)}</p>}
      <SideLegend model={model} />
      <ol className="vs-matchups">
        {model.matchups.map(m => (
          <li key={m.rank} className="vs-matchup">
            <MatchPerson person={m.a} side="a" isWinner={m.winner === "a"} locale={locale} localePrefix={localePrefix} />
            <span className="vs-matchup-rank">{formatNumber(m.rank, locale)}</span>
            <MatchPerson person={m.b} side="b" isWinner={m.winner === "b"} locale={locale} localePrefix={localePrefix} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Combined top 20                                                            */
/* -------------------------------------------------------------------------- */

export function VsCombined({model, locale = DEFAULT_LOCALE}) {
  const {combined, namesA, namesB, v} = model;
  if (combined.length < 4) return null;
  const vs = getVsStrings(locale);
  const localePrefix = prefixFor(locale);
  const maxHpi = combined[0]?.person.hpi || 1;
  const ka = combined.filter(row => row.side === "a").length;

  return (
    <section className="profile-section oc-section vs-section vs-combined-section" id="combined">
      <h2 className="oc-section-title">{cap(vs.combinedTitle(v))}</h2>
      <p className="oc-section-intro">{vs.combinedIntro(v)}</p>
      <div className="vs-split" aria-hidden="true">
        {ka > 0 && (
          <span className="vs-split-a" style={{flexGrow: ka}}>
            {namesA.country} {formatNumber(ka, locale)}
          </span>
        )}
        {combined.length - ka > 0 && (
          <span className="vs-split-b" style={{flexGrow: combined.length - ka}}>
            {namesB.country} {formatNumber(combined.length - ka, locale)}
          </span>
        )}
      </div>
      <ol className="oc-ranking vs-combined">
        {combined.map(({person, side}, i) => (
          <li key={person.id} className={`oc-ranking-row vs-combined-row vs-combined-row--${side}`}>
            <span className="oc-ranking-rank vs-combined-rank">{formatNumber(i + 1, locale)}</span>
            <a className="oc-ranking-person" href={`${localePrefix}/profile/person/${person.slug}`}>
              <PersonImage
                person={imagePerson(person)}
                src={`/profile/people/${person.id}.jpg`}
                alt=""
                loading="lazy"
                className="oc-ranking-avatar"
                wrap={false}
              />
              <span className="oc-ranking-name">
                <span className="oc-ranking-name-text">{person.localizedName}</span>
                <span className="oc-ranking-years">{formatLifespan(person, locale)}</span>
              </span>
            </a>
            <span className="vs-combined-country">
              {side === "a" ? namesA.country : namesB.country}
            </span>
            <span className="oc-ranking-hpi">
              <span
                className="oc-ranking-bar vs-combined-bar"
                style={{"--w": `${Math.max(4, ((person.hpi || 0) / maxHpi) * 100)}%`}}
                aria-hidden="true"
              />
              <span className="oc-ranking-hpi-value">{formatDecimal(person.hpi, locale)}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Birth eras, mirrored                                                       */
/* -------------------------------------------------------------------------- */

// One side of an era row: bar, count, and that era's most famous person.
function EraSide({people, side, max, locale, localePrefix}) {
  return (
    <span className={`vs-era-side vs-era-side--${side}`}>
      <span className="vs-era-bar" style={{"--w": `${(people.length / max) * 100}%`}} />
      <span className="vs-era-count">{people.length ? formatNumber(people.length, locale) : ""}</span>
      {people[0] && (
        <a className="vs-era-top" href={`${localePrefix}/profile/person/${people[0].slug}`}>
          {people[0].localizedName}
        </a>
      )}
    </span>
  );
}

export function VsEras({model, locale = DEFAULT_LOCALE}) {
  const {eras} = model;
  if (eras.rows.length < 2) return null;
  const vs = getVsStrings(locale);
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const localePrefix = prefixFor(locale);
  const isCentury = eras.unit === "century";
  const max = Math.max(1, ...eras.rows.map(row => Math.max(row.a.length, row.b.length)));
  const label = ({start, end}) => (isCentury || start < 0
    ? `${formatYear(start, locale)}–${formatYear(end, locale)}`
    : tc.decadeLabel ? tc.decadeLabel({decade: start}) : `${start}s`);

  return (
    <section className="profile-section oc-section vs-section vs-eras-section" id="eras">
      <h2 className="oc-section-title">{isCentury ? vs.centuriesTitle : vs.decadesTitle}</h2>
      <p className="oc-section-intro">{vs.erasIntro}</p>
      <SideLegend model={model} />
      <ol className="vs-eras">
        {eras.rows.map(row => (
          <li key={row.start} className="vs-era-row">
            <EraSide people={row.a} side="a" max={max} locale={locale} localePrefix={localePrefix} />
            <span className="vs-era-label">{label(row)}</span>
            <EraSide people={row.b} side="b" max={max} locale={locale} localePrefix={localePrefix} />
          </li>
        ))}
      </ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Related links                                                              */
/* -------------------------------------------------------------------------- */

function LinkColumn({title, links, localePrefix}) {
  if (!links.length) return null;
  return (
    <nav className="oc-related-col" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {links.map(link => (
          <li key={link.key}>
            <a href={`${localePrefix}${link.href}`}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function VsRelated({model, locale = DEFAULT_LOCALE}) {
  const vs = getVsStrings(locale);
  const s = getOcStrings(locale);
  const localePrefix = prefixFor(locale);
  const {occupation, countryA, countryB, namesA, namesB, v} = model;

  const fullLists = [
    {key: "a", href: ocPath(occupation, countryA), label: cap(namesA.groupTitle)},
    {key: "b", href: ocPath(occupation, countryB), label: cap(namesB.groupTitle)},
    {key: "all", href: `/profile/occupation/${occupation.occupation_slug}`, label: cap(s.allOccWorldwide(namesA))},
  ];

  return (
    <footer className="profile-footer oc-related vs-related">
      <div className="footer-container">
        <h2 className="footer-title">{vs.fullListsTitle}</h2>
        <ul className="vs-related-lists">
          {fullLists.map(link => (
            <li key={link.key}>
              <a href={`${localePrefix}${link.href}`}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className="oc-related-columns vs-related-columns">
          <LinkColumn
            title={vs.moreTitle({X: namesA.country, XThe: namesA.countryThe})}
            links={model.rivalsA}
            localePrefix={localePrefix}
          />
          <LinkColumn
            title={vs.moreTitle({X: namesB.country, XThe: namesB.countryThe})}
            links={model.rivalsB}
            localePrefix={localePrefix}
          />
          <LinkColumn
            title={vs.sameRivalryTitle(v)}
            links={model.sameRivalry}
            localePrefix={localePrefix}
          />
        </div>
      </div>
    </footer>
  );
}
