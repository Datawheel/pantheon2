import PersonImage from "@/components/utils/PersonImage";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";
import {formatYear, getOcStrings} from "@/app/occupationCountryTranslations";
import {imagePerson} from "../data";
import "../../born-on-this-day/OccupationBreakdown.css";
import "../../common/Section.css";
import "./BirthDecades.css";

const VISIBLE = 10;
// Beyond this many per group, link to the rankings explorer instead of
// rendering everyone (US actors born in the 1960s alone are ~900 people;
// every rendered chip is repeated in the RSC payload).
const EXPANDED_MAX = 30;

function PersonChip({person, localePrefix}) {
  return (
    <a
      href={`${localePrefix}/profile/person/${person.slug}`}
      className="occupation-person"
      title={person.localizedName}
    >
      <PersonImage
        person={imagePerson(person)}
        src={`/profile/people/${person.id}.jpg`}
        alt=""
        loading="lazy"
        fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
      />
      <span className="occupation-person__name">{person.localizedName}</span>
    </a>
  );
}

// Server component: the old client version shipped every person row (with
// descriptions) in the RSC payload — 6.3MB of HTML for US actors.
export default function BirthDecades({data, rankingsHref, locale = DEFAULT_LOCALE}) {
  const {eras, stats} = data;
  if (stats.count <= 10 || eras.groups.length < 2) return null;

  const t = getTranslations(locale);
  const tEn = getTranslations(DEFAULT_LOCALE);
  const tc = {...tEn.occupationCountry, ...t.occupationCountry};
  const s = getOcStrings(locale);
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const isCentury = eras.unit === "century";

  const labelFor = ({start, end}) => {
    if (isCentury || start < 0) return `${formatYear(start, locale)}–${formatYear(end, locale)}`;
    return tc.decadeLabel ? tc.decadeLabel({decade: start}) : `${start}s`;
  };

  return (
    <section className="profile-section occupation-breakdown occupation-decades">
      <h2>{isCentury ? s.centuriesTitle : s.decadesTitle}</h2>
      <div className="section-body">
        <p>{s.erasIntro}</p>
      </div>

      <div className="occupation-groups">
        {eras.groups.map(group => {
          const visible = group.people.slice(0, VISIBLE);
          const hidden = group.people.slice(VISIBLE, EXPANDED_MAX);
          const overflow = group.people.length - VISIBLE - hidden.length;
          const yearsHref = rankingsHref.replace(/years=[^&]*/, `years=${group.start},${group.end}`);

          return (
            <div
              key={group.start}
              className={`occupation-group${group.people.length <= 3 ? " is-small" : ""}`}
            >
              <h3 className="occupation-group__title">
                <span>{labelFor(group)}</span>
                <span className="occupation-group__count">({group.people.length})</span>
              </h3>
              <div className="occupation-group__people">
                {visible.map(person => (
                  <PersonChip key={person.id} person={person} localePrefix={localePrefix} />
                ))}
              </div>
              {hidden.length > 0 && (
                <details className="occupation-group__details">
                  <summary className="occupation-group__more">
                    <span className="when-closed">{s.more({count: group.people.length - VISIBLE})}</span>
                    <span className="when-open">{tc.showLess || "Show less"}</span>
                  </summary>
                  <div className="occupation-group__people">
                    {hidden.map(person => (
                      <PersonChip key={person.id} person={person} localePrefix={localePrefix} />
                    ))}
                  </div>
                  {overflow > 0 && (
                    <a className="occupation-group__all" href={yearsHref}>
                      {s.seeAll} →
                    </a>
                  )}
                </details>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
