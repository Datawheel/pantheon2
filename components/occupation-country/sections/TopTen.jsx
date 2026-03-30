import {plural} from "pluralize";
import Link from "next/link";
import PersonImage from "../../utils/PersonImage";
import {toTitleCase} from "../../utils/vizHelpers";
import {FORMATTERS} from "../../utils/consts";
import {getTranslations} from "/app/translations";
import {DEFAULT_LOCALE} from "/app/locales";
import "../../common/Section.css";
import "./TopTen.css";

const EXCERPT_LENGTH = 140;

function truncateText(text, maxLength = EXCERPT_LENGTH) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return `${trimmed.slice(0, maxLength)}...`;
  return `${trimmed.slice(0, lastSpace)}...`;
}

export default function TopTen({country, occupation, people, locale = DEFAULT_LOCALE}) {
  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  // For English, use plural form with toTitleCase; for other languages, use the occupation as-is
  const occupationPlural = locale === "en"
    ? toTitleCase(plural(occupation.occupation))
    : occupation.occupation;

  const count = Math.min(people.length, 10);
  const top10 = people.slice(0, 10);

  return (
    <section className="profile-section top-10-section">
      <div className="top-10-container">
        <div className="top-10-header">
          <h2 className="top-10-title">
            {t.occupationCountry.top} {count} {country.nationalityAdj || country.demonym} {occupationPlural}
          </h2>
        </div>
        <p className="top-10-intro">
          {t.occupationCountry.topTenIntro({
            count,
            demonym: country.demonym,
            occupationPlural,
          })}
          {people.length >= 10 && (
            <>
              {" "}
              {t.occupationCountry.visitRankings}{" "}
              <a href={`${localePrefix}/explore/rankings?show=people&place=${country.country_code}&occupation=${occupation.occupation}`}>
                {locale === "en"
                  ? `${country.demonym} ${occupationPlural}`
                  : `${occupationPlural} ${country.demonym}`}
              </a>.
            </>
          )}
        </p>

        <ol className="top-10-grid">
          {top10.map((person, index) => {
            const famousFor = locale === "en" ? (person.famous_for || person.description) : null;
            const excerpt = famousFor ? truncateText(famousFor) : null;
            const isExpandable = famousFor && excerpt && excerpt !== famousFor;

            return (
              <li key={person.id} className="top-10-item">
                <div className="top-10-card">
                  <Link
                    href={`${localePrefix}/profile/person/${person.slug}`}
                    className="top-10-card-link"
                  >
                    <span className="top-10-card-rank">#{index + 1}</span>
                    <div className="top-10-card-image">
                      <PersonImage
                        fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                        src={`/profile/people/${person.id}.jpg`}
                        alt={`Photo of ${person.name}`}
                      />
                    </div>
                    <div className="top-10-card-content">
                      <h3 className="top-10-card-name">{person.name}</h3>
                      <p className="top-10-card-dates">
                        {person.deathyear
                          ? `${FORMATTERS.year(person.birthyear)} - ${FORMATTERS.year(person.deathyear)}`
                          : `b. ${FORMATTERS.year(person.birthyear)}`}
                      </p>
                      <div className="top-10-card-stats">
                        <span className="top-10-card-hpi" title="Historical Popularity Index">
                          HPI {FORMATTERS.decimal(person.hpi)}
                        </span>
                        <span className="top-10-card-languages" title="Wikipedia languages">
                          {person.l} langs
                        </span>
                      </div>
                    </div>
                  </Link>
                  {famousFor && (
                    <div className="top-10-famous">
                      {!isExpandable && (
                        <p className="top-10-famous-text">{famousFor}</p>
                      )}
                      {isExpandable && (
                        <details className="top-10-famous-details">
                          <summary className="top-10-famous-summary">
                            <span className="top-10-famous-excerpt">{excerpt}</span>
                            <span className="top-10-famous-toggle more">
                              {tc.readMore || "Read more"}
                              <svg
                                className="chevron-icon"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            </span>
                            <span className="top-10-famous-toggle less">
                              {tc.showLess || "Show less"}
                              <svg
                                className="chevron-icon"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <polyline points="6 15 12 9 18 15"></polyline>
                              </svg>
                            </span>
                          </summary>
                          <p className="top-10-famous-full">{famousFor}</p>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </li>
          );
        })}
        </ol>
      </div>
    </section>
  );
}
