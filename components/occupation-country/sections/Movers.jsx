import PersonImage from "../../utils/PersonImage";
import {HPI_YEAR} from "@/app/constants";
import {DEFAULT_LOCALE} from "@/app/locales";
import {
  cap,
  formatLifespan,
  formatNumber,
  getOcStrings,
} from "@/app/occupationCountryTranslations";
import {imagePerson} from "../data";
import RankChange from "./RankChange";
import "./OccupationCountry.css";

// Only call out Wikipedia language gains big enough to mean something.
const MIN_LANGS_GAINED = 3;

function MoverList({title, people, kind, locale, localePrefix}) {
  const s = getOcStrings(locale);
  const fmt = n => formatNumber(n, locale);
  const arrow = locale === "ar" ? "←" : "→";
  return (
    <div className={`oc-highlight oc-movers-col oc-movers-col--${kind}`}>
      <h3 className="oc-highlight-title">{title}</h3>
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
                <span className="oc-highlight-years">
                  {kind === "new" || person.rankPrev == null
                    ? `#${fmt(person.rank)}`
                    : <><bdi>#{fmt(person.rankPrev)}</bdi> {arrow} <bdi>#{fmt(person.rank)}</bdi></>}
                  {person.langDelta >= MIN_LANGS_GAINED && (
                    <> · {s.langsGained({d: fmt(person.langDelta)})}</>
                  )}
                  {kind === "new" && formatLifespan(person, locale) && (
                    <> · {formatLifespan(person, locale)}</>
                  )}
                </span>
              </span>
              <RankChange person={person} locale={locale} />
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

// Who climbed, fell, or entered this list since the previous HPI edition —
// a reason for the page to change year to year beyond the top 10.
export default function Movers({data, locale = DEFAULT_LOCALE}) {
  const {movers, people} = data;
  if (!movers) return null;
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const m = {
    prevYear: HPI_YEAR - 1,
    year: HPI_YEAR,
    pool: formatNumber(Math.min(people.length, 100), locale),
    all: people.length <= 100,
  };

  const lists = [
    movers.climbers.length > 0 && {kind: "up", title: s.moversUp, people: movers.climbers},
    movers.fallers.length > 0 && {kind: "down", title: s.moversDown, people: movers.fallers},
    movers.newcomers.length > 0 && {kind: "new", title: s.moversNew(m), people: movers.newcomers},
  ].filter(Boolean);

  return (
    <section className="profile-section oc-section oc-movers" id="movers">
      <h2 className="oc-section-title">{cap(s.moversTitle(m))}</h2>
      <p className="oc-section-intro">{s.moversIntro(m)}</p>
      <div className="oc-highlights oc-movers-grid">
        {lists.map(list => (
          <MoverList
            key={list.kind}
            kind={list.kind}
            title={list.title}
            people={list.people}
            locale={locale}
            localePrefix={localePrefix}
          />
        ))}
      </div>
    </section>
  );
}
