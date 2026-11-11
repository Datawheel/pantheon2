import Link from "next/link";
import PersonImage from "../../utils/PersonImage";
import {getTranslations} from "@/app/translations";
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
import "../../common/Section.css";
import "./TopTen.css";

const EXCERPT_LENGTH = 200;

function truncateText(text, maxLength = EXCERPT_LENGTH) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return `${trimmed.slice(0, maxLength)}…`;
  return `${trimmed.slice(0, lastSpace)}…`;
}

const Chevron = ({up}) => (
  <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <polyline points={up ? "6 15 12 9 18 15" : "6 9 12 15 18 9"}></polyline>
  </svg>
);

export default function TopTen({people, names, hasFullRanking, locale = DEFAULT_LOCALE}) {
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const languagesLabel = t.home?.languages || tEn.home.languages;

  const top10 = people.slice(0, 10);
  if (!top10.length) return null;
  const isSingle = people.length === 1;
  // Outside English the blurbs are machine translations (or absent).
  const showTranslatedNote = locale !== DEFAULT_LOCALE && s.translatedNote
    && top10.some(p => p.famousForLocalized);

  return (
    <section className={`profile-section top-10-section${isSingle ? " is-single" : ""}`} id="top-10">
      <div className="top-10-container">
        <div className="top-10-header">
          <h2 className="top-10-title">
            {cap(s.topTitle({...names, count: people.length, topCount: top10.length}))}
          </h2>
        </div>
        <p className="top-10-intro">
          {s.topIntro}
          {hasFullRanking && (
            <>
              {" "}
              <a href="#full-ranking">{s.rankingTitle({...names, count: people.length, countFormatted: formatNumber(people.length, locale)})} ↓</a>
            </>
          )}
        </p>
        {showTranslatedNote && <p className="top-10-note">{s.translatedNote}</p>}

        <ol className={`top-10-grid${isSingle ? " top-10-grid--single" : ""}`}>
          {top10.map((person, index) => {
            const personName = person.localizedName;
            // English famous_for/description, or its machine translation.
            const famousFor = person.famousForLocalized;
            const excerpt = famousFor && !isSingle ? truncateText(famousFor) : famousFor;
            const isExpandable = famousFor && excerpt !== famousFor;
            const birthplace = person.bplace_geonameid?.place;

            return (
              <li key={person.id} className="top-10-item">
                <article className="top-10-card">
                  <Link
                    href={`${localePrefix}/profile/person/${person.slug}`}
                    className="top-10-card-link"
                  >
                    <span className="top-10-card-rank">
                      #{index + 1}
                    </span>
                    <div className="top-10-card-image">
                      <PersonImage
                        person={imagePerson(person)}
                        fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                        src={`/profile/people/${person.id}.jpg`}
                        alt={personName}
                        loading={index < 4 ? undefined : "lazy"}
                      />
                    </div>
                    <div className="top-10-card-content">
                      <h3 className="top-10-card-name">{personName}</h3>
                      <p className="top-10-card-dates">
                        {formatLifespan(person, locale)}
                        {birthplace && <span className="top-10-card-place"> · {birthplace}</span>}
                      </p>
                      <div className="top-10-card-stats">
                        <span className="top-10-card-hpi" title="Historical Popularity Index">
                          HPI {formatDecimal(person.hpi, locale, 2)}
                        </span>
                        {person.l > 0 && (
                          <span className="top-10-card-languages">
                            {person.l} {languagesLabel}
                          </span>
                        )}
                        {!isSingle && <RankChange person={person} locale={locale} />}
                      </div>
                    </div>
                  </Link>
                  {famousFor && (
                    <div className="top-10-famous">
                      {!isExpandable && <p className="top-10-famous-text">{famousFor}</p>}
                      {isExpandable && (
                        <details className="top-10-famous-details">
                          <summary className="top-10-famous-summary">
                            <span className="top-10-famous-excerpt">{excerpt}</span>
                            <span className="top-10-famous-toggle more">
                              {tc.readMore || "Read more"}
                              <Chevron />
                            </span>
                            <span className="top-10-famous-toggle less">
                              {tc.showLess || "Show less"}
                              <Chevron up />
                            </span>
                          </summary>
                          <p className="top-10-famous-full">{famousFor}</p>
                        </details>
                      )}
                    </div>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
