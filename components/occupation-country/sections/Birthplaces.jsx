import PersonImage from "../../utils/PersonImage";
import {DEFAULT_LOCALE} from "@/app/locales";
import {cap, formatNumber, getOcStrings} from "@/app/occupationCountryTranslations";
import {imagePerson} from "../data";
import "./OccupationCountry.css";

const TOP = 8;
const FACES = 3;

// Top birthplaces inside the country, each linking to its place profile.
export default function Birthplaces({data, names, locale = DEFAULT_LOCALE}) {
  const {birthplaces, stats} = data;
  // Only towns that produced more than one person: a grid of 1s says
  // nothing, so small or scattered groups skip the section entirely.
  const rows = birthplaces.filter(place => place.count >= 2).slice(0, TOP);
  if (stats.count < 5 || rows.length < 2) return null;

  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const max = rows[0].count;

  return (
    <section className="profile-section oc-section oc-birthplaces">
      <h2 className="oc-section-title">{cap(s.birthplacesTitle(names))}</h2>
      <p className="oc-section-intro">{s.birthplacesIntro(names)}</p>
      <ol className="oc-places">
        {rows.map(place => (
          <li key={place.id} className="oc-place">
            <div className="oc-place-head">
              {place.slug ? (
                <a className="oc-place-name" href={`${localePrefix}/profile/place/${place.slug}`}>{place.place}</a>
              ) : (
                <span className="oc-place-name">{place.place}</span>
              )}
              <span className="oc-place-count">{formatNumber(place.count, locale)}</span>
            </div>
            <span className="oc-place-track" aria-hidden="true">
              <span className="oc-place-fill" style={{"--w": `${(place.count / max) * 100}%`}} />
            </span>
            <ul className="oc-place-people">
              {place.people.slice(0, FACES).map(person => (
                <li key={person.id}>
                  <a href={`${localePrefix}/profile/person/${person.slug}`}>
                    <PersonImage
                      person={imagePerson(person)}
                      src={`/profile/people/${person.id}.jpg`}
                      alt=""
                      loading="lazy"
                      className="oc-place-avatar"
                      wrap={false}
                    />
                    <span>{person.localizedName}</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
