import PersonImage from "../../utils/PersonImage";
import {DEFAULT_LOCALE} from "@/app/locales";
import {cap, formatLifespan, getOcStrings} from "@/app/occupationCountryTranslations";
import {imagePerson, isLiving} from "../data";
import "./OccupationCountry.css";

const PER_LIST = 5;

function PersonList({title, people, locale, localePrefix}) {
  return (
    <div className="oc-highlight">
      <h2 className="oc-highlight-title">{title}</h2>
      <ol className="oc-highlight-list">
        {people.map(person => (
          <li key={person.id}>
            <a href={`${localePrefix}/profile/person/${person.slug}`} className="oc-highlight-person">
              <PersonImage
                person={imagePerson(person)}
                src={`/profile/people/${person.id}.jpg`}
                alt=""
                loading="lazy"
                className="oc-highlight-avatar"
                wrap={false}
              />
              <span className="oc-highlight-name">
                <span>{person.localizedName}</span>
                <span className="oc-highlight-years">{formatLifespan(person, locale)}</span>
              </span>
              <span className="oc-highlight-rank">#{person.rank}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

// "Most famous female / living {group}" — common search intents that the
// main ranking answers only implicitly. Shown when the group is mixed
// enough for the sub-list to add information.
export default function Highlights({data, names, locale = DEFAULT_LOCALE}) {
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const {people, stats} = data;

  const women = people.filter(p => p.gender === "F");
  const living = people.filter(isLiving);
  const showWomen = women.length >= 3 && stats.count - women.length >= 3;
  const showLiving = living.length >= 3 && stats.count - living.length >= 3;
  if (!showWomen && !showLiving) return null;

  return (
    <section className="profile-section oc-section oc-highlights">
      {showWomen && (
        <PersonList
          title={cap(s.womenTitle(names))}
          people={women.slice(0, PER_LIST)}
          locale={locale}
          localePrefix={localePrefix}
        />
      )}
      {showLiving && (
        <PersonList
          title={cap(s.livingTitle(names))}
          people={living.slice(0, PER_LIST)}
          locale={locale}
          localePrefix={localePrefix}
        />
      )}
    </section>
  );
}
