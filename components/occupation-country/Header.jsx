import {plural} from "pluralize";
import PersonImage from "@/components/utils/PersonImage";
import {COLORS_DOMAIN} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "../../styles/Header.css";
import "../../styles/mouse.css";
import "./Header.css";

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

  return (
    <header
      className="hero occupation-country-hero"
      style={{"--hero-accent": accentColor}}
    >
      <div className="bg-container" aria-hidden="true">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people.slice(0, 4).map(p => (
              <PersonImage
                key={p.id}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.name || ""}
                wrap={false}
              />
            ))}
          </div>
          <div className="bg-img bg-img-b">
            {people.slice(4, 8).map(p => (
              <PersonImage
                key={p.id}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.name || ""}
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
            {t.occupationCountry.notablePeople
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
