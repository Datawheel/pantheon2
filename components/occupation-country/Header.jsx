import {plural} from "pluralize";
import PersonImage from "@/components/utils/PersonImage";
import {COLORS_DOMAIN} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
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

export default function Header({
  occupation,
  country,
  people,
  breadcrumbs,
  locale = DEFAULT_LOCALE,
}) {
  const t = getTranslations(locale);
  const accentColor = COLORS_DOMAIN[occupation.domain_slug] || "#BB3B57";

  // For English, use plural form; for other languages, use the occupation as-is
  const occupationDisplay = locale === "en"
    ? plural(occupation.occupation)
    : occupation.occupation;

  // Use from_country from database if available (e.g., "da Dinamarca"), otherwise use generic translation
  const countryPart = country.fromCountry
    ? country.fromCountry
    : `${t.occupationCountry.from} ${country.country}`;

  // "1 celebrity out of 516 people from Slovakia", with the country total
  // linking to the unfiltered country profile. Falls back to the plain count
  // when the country total is missing or no larger than this page's count.
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const countryTotal = country.num_born || 0;
  const countOfTotal =
    countryTotal > people.length && t.occupationCountry.countOfCountryTotal
      ? t.occupationCountry
          .countOfCountryTotal({
            count: people.length,
            countFormatted: people.length.toLocaleString(locale),
            occupation: occupation.occupation.toLowerCase(),
            occupationPlural: occupationDisplay.toLowerCase(),
            total: countryTotal,
            totalFormatted: countryTotal.toLocaleString(locale),
            country: country.country,
            fromCountry: countryPart,
          })
          .match(/^(.*)<a>(.*)<\/a>(.*)$/)
      : null;

  const mosaicCount = Math.min(people.length, MOSAIC_MAX);
  const isMirrored = mosaicCount === 1;
  const mosaicPeople = isMirrored
    ? [people[0], people[0]]
    : people.slice(0, mosaicCount);
  const desktopRowSizes = expandRows(MOSAIC_ROWS.desktop[mosaicCount] || []);
  const mobileRowSizes = expandRows(MOSAIC_ROWS.mobile[mosaicCount] || []);

  return (
    <header
      className="hero occupation-country-hero"
      style={{"--hero-accent": accentColor}}
    >
      <div className="bg-container" aria-hidden="true">
        <div className="bg-img-mask profession">
          <div className="bg-mosaic">
            {mosaicPeople.map((p, i) => (
              <PersonImage
                key={`${p.id}-${i}`}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.localizedName || p.name || ""}
                className={i === 1 && isMirrored ? "is-mirrored" : undefined}
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
      {breadcrumbs}
      <div className="info">
        <p className="profile-type">{t.occupationCountry.theMostFamous}</p>
        <h1 className="profile-name">
          {occupationDisplay} {countryPart}
        </h1>
        {people.length > 0 && (
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
                  count: people.length,
                  countFormatted: people.length.toLocaleString(locale),
                })
              : `${people.length.toLocaleString(locale)} notable people`}
          </p>
        )}
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
