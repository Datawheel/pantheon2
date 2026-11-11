import {HPI_YEAR} from "@/app/constants";
import {DEFAULT_LOCALE} from "@/app/locales";
import {formatNumber, getOcStrings} from "@/app/occupationCountryTranslations";

// Chart-style badge for a person's move since the last edition: ▲3, ▼12,
// or "New". `person` comes from loadOccupationCountry (rankDelta, isNew).
export default function RankChange({person, locale = DEFAULT_LOCALE, className = ""}) {
  const s = getOcStrings(locale);
  const m = {prevYear: HPI_YEAR - 1, year: HPI_YEAR};

  if (person.isNew) {
    return (
      <span className={`oc-move oc-move--new ${className}`} title={s.moveNewLong(m)}>
        {s.moveNew}
      </span>
    );
  }

  const delta = person.rankDelta;
  if (!delta) return null;
  const d = formatNumber(Math.abs(delta), locale);
  const label = delta > 0
    ? s.moveUp({...m, delta, d})
    : s.moveDown({...m, delta: -delta, d});

  return (
    <span className={`oc-move oc-move--${delta > 0 ? "up" : "down"} ${className}`} title={label}>
      <span aria-hidden="true">{delta > 0 ? "▲" : "▼"}{d}</span>
      <span className="u-visually-hidden">{label}</span>
    </span>
  );
}
