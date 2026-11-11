import PersonImage from "../../utils/PersonImage";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  cap,
  formatDecimal,
  formatLifespan,
  formatNumber,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import {imagePerson} from "../data";
import RankChange from "./RankChange";
import "./OccupationCountry.css";

const LIMIT = 100;

// Server-rendered ranking #11–#100, so every listed person is a crawlable
// link (the old page only linked the top 10 plus a few per decade).
export default function FullRanking({people, names, rankingsHref, locale = DEFAULT_LOCALE}) {
  if (people.length <= 10) return null;
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const rows = people.slice(10, LIMIT);
  const maxHpi = people[0]?.hpi || 1;
  const params = {...names, count: people.length, countFormatted: formatNumber(people.length, locale)};

  return (
    <section className="profile-section oc-section oc-ranking-section" id="full-ranking">
      <h2 className="oc-section-title">{cap(s.rankingTitle(params))}</h2>
      <p className="oc-section-intro">{s.rankingIntro(params)}</p>

      <div className="oc-ranking-head" aria-hidden="true">
        <span>{s.colRank}</span>
        <span>{s.colName}</span>
        <span className="oc-col-place">{s.colBirthplace}</span>
        <span className="oc-col-hpi">{s.colHpi}</span>
      </div>
      <ol className="oc-ranking" start={11}>
        {rows.map(person => (
          <li key={person.id} className="oc-ranking-row">
            <span className="oc-ranking-rank">{person.rank}</span>
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
                <span className="oc-ranking-years">
                  {formatLifespan(person, locale)}
                  <RankChange person={person} locale={locale} />
                </span>
              </span>
            </a>
            <span className="oc-ranking-place oc-col-place">
              {person.bplace_geonameid?.slug ? (
                <a href={`${localePrefix}/profile/place/${person.bplace_geonameid.slug}`}>
                  {person.bplace_geonameid.place}
                </a>
              ) : (
                person.bplace_geonameid?.place || ""
              )}
            </span>
            <span className="oc-ranking-hpi oc-col-hpi">
              <span
                className="oc-ranking-bar"
                style={{"--w": `${Math.max(4, ((person.hpi || 0) / maxHpi) * 100)}%`}}
                aria-hidden="true"
              />
              <span className="oc-ranking-hpi-value">{formatDecimal(person.hpi, locale)}</span>
            </span>
          </li>
        ))}
      </ol>
      {people.length > LIMIT && (
        <p className="oc-section-more">
          <a className="oc-button" href={rankingsHref}>{s.seeFullRanking} →</a>
        </p>
      )}
    </section>
  );
}
