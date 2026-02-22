import "../common/Section.css";
import "./OccupationBreakdown.css";
import {toTitleCase} from "../utils/vizHelpers";
import {plural} from "pluralize";
import PersonImage from "/components/utils/PersonImage";
import {DEFAULT_LOCALE} from "/app/locales";

export default function OccupationBreakdown({date, displayDate, people, lang = "en"}) {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;

  // Group people by occupation (now a string)
  const occupationGroups = people.reduce((acc, person) => {
    if (person.occupation) {
      const key = person.occupation.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          occupation: person.occupation,
          people: [],
        };
      }
      acc[key].people.push(person);
    }
    return acc;
  }, {});

  // Sort groups by count, then sort people within each group by HPI
  const sortedGroups = Object.values(occupationGroups)
    .map(group => ({
      ...group,
      people: group.people.sort((a, b) => (b.hpi || 0) - (a.hpi || 0)),
    }))
    .sort((a, b) => b.people.length - a.people.length);

  return (
    <section className="profile-section occupation-breakdown">
      <h2>Birthdays by Occupation</h2>
      <div className="section-body">
        <p>
          See how the famous people born on {displayDate} are distributed across
          different fields and occupations. Click on any person to learn more
          about their life and achievements.
        </p>
      </div>

      <div className="occupation-groups">
        {sortedGroups.map(({occupation, people: groupPeople}) => (
          <div key={occupation} className="occupation-group">
            <h3 className="occupation-group__title">
              <span>{toTitleCase(plural(occupation))}</span>
              <span className="occupation-group__count">({groupPeople.length})</span>
            </h3>
            <div className="occupation-group__people">
              {groupPeople.slice(0, 10).map(person => (
                <a
                  key={person.id}
                  href={`${localePrefix}/profile/person/${person.slug}`}
                  className="occupation-person"
                  title={person.name}
                >
                  <PersonImage
                    src={`/profile/people/${person.id}.jpg`}
                    alt={person.name}
                    fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                  />
                  <span className="occupation-person__name">{person.name}</span>
                </a>
              ))}
              {groupPeople.length > 10 && (
                <span className="occupation-group__more">
                  +{groupPeople.length - 10} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
