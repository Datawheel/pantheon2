import PersonImage from "@/components/utils/PersonImage";
import {COLORS_DOMAIN} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getOcStrings} from "@/app/occupationCountryTranslations";
import {imagePerson} from "./data";
import "../../styles/Header.css";
import "../../styles/mouse.css";
import "./Header.css";

// The mosaic is a 60-track grid so rows of 1-6 portraits divide evenly.
const MOSAIC_TRACKS = 60;
const MOSAIC_MAX = 8;

// Portraits per row for a given number of people. A single person is shown
// twice (the second copy mirrored, like the person profile hero).
const MOSAIC_ROWS = {
  desktop: {1: [2], 2: [2], 3: [3], 4: [4], 5: [5], 6: [3, 3], 7: [4, 3], 8: [4, 4]},
  mobile: {1: [2], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3], 7: [4, 3], 8: [4, 4]},
};

// Expands [4, 3] to [4, 4, 4, 4, 3, 3, 3]: the row size each portrait sits in
const expandRows = rows => rows.flatMap(size => Array(size).fill(size));

/**
 * Portrait mosaic behind the hero panel. `people` is shown in order; a
 * single person is shown twice, the copy mirrored.
 */
export function HeroMosaic({people}) {
  const mosaicCount = Math.min(people.length, MOSAIC_MAX);
  const isMirrored = mosaicCount === 1;
  const mosaicPeople = isMirrored ? [people[0], people[0]] : people.slice(0, mosaicCount);
  const desktopRowSizes = expandRows(MOSAIC_ROWS.desktop[mosaicCount] || []);
  const mobileRowSizes = expandRows(MOSAIC_ROWS.mobile[mosaicCount] || []);

  return (
    <div className="bg-container" aria-hidden="true">
      <div className="bg-img-mask profession">
        <div className="bg-mosaic">
          {mosaicPeople.map((p, i) => (
            <PersonImage
              key={`${p.id}-${i}`}
              person={imagePerson(p)}
              src={`/profile/people/${p.id}.jpg`}
              alt=""
              className={i === 1 && isMirrored ? "is-mirrored" : undefined}
              fetchPriority={i < 4 ? "high" : undefined}
              style={{
                "--span": MOSAIC_TRACKS / desktopRowSizes[i],
                "--span-mobile": MOSAIC_TRACKS / mobileRowSizes[i],
              }}
              wrap={false}
            />
          ))}
        </div>
        <div className="bg-img-mask-after"></div>
      </div>
    </div>
  );
}

export default function Header({
  occupation,
  country,
  people,
  names,
  breadcrumbs,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslations(locale);
  const s = getOcStrings(locale);
  const accentColor = COLORS_DOMAIN[occupation.domain_slug] || "#BB3B57";
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const count = people.length;

  // "41 YouTubers out of 23,232 people from the United States", with the
  // country total linking to the unfiltered country profile.
  const countryTotal = country.num_born || 0;
  const countOfTotal =
    countryTotal > count && t.occupationCountry.countOfCountryTotal
      ? t.occupationCountry
          .countOfCountryTotal({
            count,
            countFormatted: count.toLocaleString(locale),
            occupation: names.occSingular,
            occupationPlural: names.occPlural,
            total: countryTotal,
            totalFormatted: countryTotal.toLocaleString(locale),
            country: names.country,
            fromCountry: names.fromCountry,
          })
          .match(/^(.*)<a>(.*)<\/a>(.*)$/)
      : null;

  // No word space between kicker and heading in Japanese/Chinese.
  const sep = locale === "ja" || locale === "zh" ? "" : " ";
  const kicker = (
    <span className="profile-type">{count === 1 ? s.kickerSingle : s.kicker}</span>
  );

  return (
    <header
      className="hero occupation-country-hero"
      style={{"--hero-accent": accentColor}}
    >
      <HeroMosaic people={people} />
      {breadcrumbs}
      <div className="info">
        {/* The kicker sits inside the h1 so the heading reads as a full
            phrase ("The Most Famous YouTubers from the United States").
            Languages that put the superlative last (Arabic) keep it last in
            the DOM; CSS still shows it on top. */}
        <h1 className={`oc-title${s.kickerAfter ? " kicker-after" : ""}`}>
          {!s.kickerAfter && kicker}
          {!s.kickerAfter && sep}
          <span className="profile-name">{names.heading}</span>
          {s.kickerAfter && sep}
          {s.kickerAfter && kicker}
        </h1>
        {count > 0 && (
          <p className="profile-count">
            {countOfTotal ? (
              <>
                {countOfTotal[1]}
                <a href={`${localePrefix}/profile/country/${country.slug}`}>
                  {countOfTotal[2]}
                </a>
                {countOfTotal[3]}
              </>
            ) : t.occupationCountry.notablePeople
              ? t.occupationCountry.notablePeople({
                  count,
                  countFormatted: count.toLocaleString(locale),
                })
              : `${count.toLocaleString(locale)} notable people`}
          </p>
        )}
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
