import PersonImage from "/components/utils/PersonImage";
import {toTitleCase} from "/components/utils/vizHelpers";
import "../common/Section.css";
import AnchorList from "../utils/AnchorList";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "./DeathsByMonth.css";

dayjs.extend(utc);

// Iterate over each month in order (January = 1, December = 12)
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default async function DeathsByMonth({year, people}) {
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
      <h2>Deaths by Month in {year}</h2>
      <div className="section-body"></div>

      {months.map((monthName, index) => {
        const month = index + 1;
        const peopleInMonth = groupedByMonth[month] || [];
        if (peopleInMonth.length === 0) {
          return null;
        }
        return (
          <div key={monthName} className="month-section">
            <h3>
              {monthName} {year}
            </h3>
            <div className="section-body">
              <p>
                The following is a chronological list of the most famous people
                to have died in {monthName} of {year}. Sorted by popularity, the
                most famous people to pass away in {monthName} were{" "}
                <AnchorList
                  items={[...peopleInMonth]
                    .sort((a, b) => {
                      if (!a.hpi && !b.hpi) return 0;
                      if (!a.hpi) return 1;
                      if (!b.hpi) return -1;
                      return b.hpi - a.hpi;
                    })
                    .slice(0, 3)}
                  name={d => `${d.name} (HPI: ${d?.hpi?.toFixed(2)})`}
                  url={d => `/profile/person/${d.slug}/`}
                />
                .
              </p>
            </div>
            {peopleInMonth.length > 0 ? (
              <div className="people-grid">
                {peopleInMonth.map(person => (
                  <a
                    href={`/profile/person/${person.slug}`}
                    key={person.id}
                    className="person-card"
                  >
                    <div className="image-column">
                      <PersonImage
                        src={`/profile/people/${person.pid || person.id}.jpg`}
                        alt={`Photo of ${person.name}`}
                        fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                      />
                    </div>
                    <div className="text-column">
                      <h4>{person.name}</h4>
                      {/* <p className="person-card__dates">
                        {dayjs(person.birthdate).format("MMM D, YYYY")} -{" "}
                        {dayjs(person.deathdate).format("MMM D, YYYY")}
                      </p> */}
                      <p className="person-card__occupation">
                        {dayjs(person.deathdate).format("MMM D, YYYY")}
                      </p>
                      <p className="person-card__occupation">
                        {person.bplace_country?.demonym
                          ? `${person.bplace_country?.demonym} ${toTitleCase(
                              person.occupation?.occupation
                            )}`
                          : `${toTitleCase(person.occupation?.occupation)}`}
                      </p>
                      <p className="person-card__hpi">
                        HPI: {person.hpi?.toFixed(2)}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p>No deaths recorded this month</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
