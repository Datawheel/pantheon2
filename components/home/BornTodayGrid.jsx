"use client";

import GridCta from "/components/home/GridCta";
import PersonImage from "/components/utils/PersonImage";
import {DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";

function getBirthYear(person) {
  // Use birthyear if available, otherwise extract from birthdate
  if (person.birthyear) return person.birthyear;
  if (person.birthdate) {
    return new Date(person.birthdate).getFullYear();
  }
  return null;
}

function getDeathYear(person) {
  // Use deathyear if available, otherwise extract from deathdate
  if (person.deathyear) return person.deathyear;
  if (person.deathdate) {
    return new Date(person.deathdate).getFullYear();
  }
  return null;
}

function isPersonAlive(person) {
  // Check alive field first, then check for deathyear/deathdate
  if (person.alive === false) return false;
  if (person.alive === true) return true;
  return !person.deathyear && !person.deathdate;
}

function getAgeText(person, t) {
  const birthYear = getBirthYear(person);
  if (!birthYear) return "";

  const currentYear = new Date().getFullYear();
  const alive = isPersonAlive(person);

  // Always calculate what age they are/would be turning today
  const age = currentYear - birthYear;

  if (alive) {
    // "Turning X today!"
    return t.home?.turningXToday?.({age}) || `Turning ${age} today!`;
  } else {
    // "Would be X today"
    return t.home?.wouldHaveBeenX?.({age}) || `Would be ${age} today`;
  }
}

const BornTodayGrid = ({
  title,
  bios = [],
  currentLang = DEFAULT_LOCALE,
}) => {
  const maxItems = 12;
  const t = getTranslations(currentLang);
  const localePrefix = currentLang === DEFAULT_LOCALE ? "" : `/${currentLang}`;

  // Get today's date for the link
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${month}-${day}`;

  if (!bios || bios.length === 0) {
    return null;
  }

  return (
    <div className="profile-grid">
      <div className="grid-title-container">
        <h3 className="grid-title">
          <span className="icon-birthday">&#127874;</span> {title}
        </h3>
      </div>
      <ul className="grid-row">
        {bios.slice(0, maxItems).map(person => (
          <li key={person.id || person.person_id} className="grid-box">
            <a href={`${localePrefix}/profile/person/${person.slug}`}>
              <div className="grid-box-bg-container">
                <PersonImage
                  src={`/profile/people/${person.id || person.person_id}.jpg`}
                  alt={`Photo of ${person.name}`}
                  fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                />
              </div>
              <div className="grid-box-title-container">
                {person.name}
                <div className="grid-box-title-subtext">
                  {getAgeText(person, t)}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <GridCta
        href={`${localePrefix}/profile/born-on-this-day/${todayDate}`}
        label={t.home?.seeAllBirthdays || "See all birthdays"}
      />
    </div>
  );
};

export default BornTodayGrid;
