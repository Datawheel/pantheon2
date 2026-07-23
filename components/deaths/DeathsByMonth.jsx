import PersonImage from "@/components/utils/PersonImage";
import "../common/Section.css";
import AnchorList from "../utils/AnchorList";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  formatDeathsDate,
  formatDeathsMonthYear,
  formatDeathsNumber,
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";
import "./DeathsByMonth.css";

dayjs.extend(utc);

export default function DeathsByMonth({year, people, lang = "en"}) {
  const t = getDeathsTranslations(lang);
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const formattedYear = formatDeathsYear(year, lang);
  // Group by death month
  const groupedByMonth = people.reduce((acc, person) => {
    if (person.deathdate) {
      const deathDate = dayjs.utc(person.deathdate);
      // Only include people who died in the specified year
      if (deathDate.year() === parseInt(year)) {
        const month = deathDate.month() + 1; // dayjs months are 0-based
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(person);
        acc[month].sort(
          (a, b) =>
            dayjs.utc(a.deathdate).valueOf() - dayjs.utc(b.deathdate).valueOf()
        );
      }
    }
    return acc;
  }, {});

  return (
    <section className="profile-section deaths-by-month">
      <h2>{t("byMonthTitle", {year: formattedYear})}</h2>
      <div className="section-body"></div>

      {Array.from({length: 12}, (_, index) => index).map(index => {
        const month = index + 1;
        const peopleInMonth = groupedByMonth[month] || [];
        const monthYear = formatDeathsMonthYear(year, index, lang);
        if (peopleInMonth.length === 0) {
          return null;
        }
        return (
          <div key={month} className="month-section">
            <h3>{monthYear}</h3>
            <div className="section-body">
              <p>
                {t("monthIntro", {monthYear})}{" "}
                {t("monthMostFamous")}{" "}
                <AnchorList
                  items={[...peopleInMonth]
                    .sort((a, b) => {
                      if (!a.hpi && !b.hpi) return 0;
                      if (!a.hpi) return 1;
                      if (!b.hpi) return -1;
                      return b.hpi - a.hpi;
                    })
                    .slice(0, 3)}
                  name={d => `${d.name} (HPI: ${formatDeathsNumber(
                    d?.hpi || 0,
                    lang,
                    {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    },
                  )})`}
                  url={d => `${localePrefix}/profile/person/${d.slug}/`}
                  lang={lang}
                  noAnd
                />
                .
              </p>
            </div>
            {peopleInMonth.length > 0 ? (
              <div className="people-grid">
                {peopleInMonth.map(person => (
                  <a
                    href={`${localePrefix}/profile/person/${person.slug}`}
                    key={person.id}
                    className="person-card"
                  >
                    <div className="image-column">
                      <PersonImage
                        person={person}
                        src={`/profile/people/${person.pid || person.id}.jpg`}
                        alt={t("photoAlt", {name: person.name})}
                        fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                      />
                    </div>
                    <div className="text-column">
                      <h4>{person.name}</h4>
                      <p className="person-card__occupation">
                        {formatDeathsDate(person.deathdate, lang)}
                      </p>
                      <p className="person-card__occupation">
                        {person.occupation?.occupation
                          && person.bplace_country?.country
                          ? t("personFrom", {
                              occupation: person.occupation.occupation,
                              country: person.bplace_country.country,
                            })
                          : person.occupation?.occupation
                            ? t("occupationOnly", {
                                occupation: person.occupation.occupation,
                              })
                            : t("unknownOccupation")}
                      </p>
                      <p className="person-card__hpi">
                        HPI: {formatDeathsNumber(person.hpi || 0, lang, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p>{t("noDeathsMonth")}</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
