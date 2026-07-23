import PersonImage from "@/components/utils/PersonImage";
import "./PeopleGrid.css";
import Link from "next/link";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  formatDeathsDate,
  formatDeathsNumber,
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";

function getAgeAtDeath(profile) {
  const birthDate = new Date(profile.birthdate);
  const deathDate = new Date(profile.deathdate);

  if (
    !Number.isNaN(birthDate.getTime())
    && !Number.isNaN(deathDate.getTime())
  ) {
    let age = deathDate.getUTCFullYear() - birthDate.getUTCFullYear();
    const birthdayHadPassed =
      deathDate.getUTCMonth() > birthDate.getUTCMonth()
      || (
        deathDate.getUTCMonth() === birthDate.getUTCMonth()
        && deathDate.getUTCDate() >= birthDate.getUTCDate()
      );
    if (!birthdayHadPassed) age -= 1;
    return age;
  }

  return parseInt(profile.deathyear) - parseInt(profile.birthyear);
}

const PeopleGrid = ({bios, occupation, year, lang = "en"}) => {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const t = getDeathsTranslations(lang);
  const formattedYear = formatDeathsYear(year, lang);
  return (
  <>
    <div className="people-grid">
      {bios.map(profile => (
        <a
          href={`${localePrefix}/profile/person/${profile.slug}`}
          className="person-card"
          key={profile.pid || profile.id}
        >
          <div className="person-card__image">
            <PersonImage
              person={profile}
              src={`/profile/people/${profile.pid || profile.id}.jpg`}
              alt={t("photoAlt", {name: profile.name})}
              fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
            />
          </div>
          <div className="person-card__info">
            <h2 className="person-card__name">{profile.name}</h2>
            <h3 className="person-card__occupation">
              {profile.occupation?.occupation && profile.bplace_country?.country
                ? t("personFrom", {
                    occupation: profile.occupation.occupation,
                    country: profile.bplace_country.country,
                  })
                : profile.occupation?.occupation
                  ? t("occupationOnly", {
                      occupation: profile.occupation.occupation,
                    })
                  : t("unknownOccupation")}
            </h3>
            <p className="person-card__dates">
              <span>
                {formatDeathsDate(profile.birthdate, lang)} –{" "}
                {formatDeathsDate(profile.deathdate, lang)}
              </span>
            </p>
            <p className="person-card__age">
              {t("age", {
                age: formatDeathsNumber(
                  getAgeAtDeath(profile),
                  lang,
                ),
              })}
            </p>
            {profile.hpi && (
              <p className="person-card__hpi">
                HPI: {formatDeathsNumber(profile.hpi, lang, {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
    <div className="view-more-link">
      {occupation ? (
        <Link
          href={`${localePrefix}/explore/rankings?show=people&years=${year},${year}&yearType=deathyear`}
        >
          {t("viewFullOccupationList", {
            occupation: occupation.occupation,
            year: formattedYear,
          })}
        </Link>
      ) : (
        <Link
          href={`${localePrefix}/explore/rankings?show=people&years=${year},${year}&yearType=deathyear`}
        >
          {t("viewFullList", {year: formattedYear})}
        </Link>
      )}
    </div>
  </>
);

};

export default PeopleGrid;
