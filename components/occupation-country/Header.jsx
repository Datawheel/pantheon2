import {plural} from "pluralize";
import PersonImage from "@/components/utils/PersonImage";
import {COLORS_DOMAIN} from "../utils/consts";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({occupation, country, people, locale = DEFAULT_LOCALE}) {
  const t = getTranslations(locale);

  // For English, use plural form; for other languages, use the occupation as-is
  const occupationDisplay = locale === "en"
    ? plural(occupation.occupation)
    : occupation.occupation;

  // Use from_country from database if available (e.g., "da Dinamarca"), otherwise use generic translation
  const countryPart = country.fromCountry
    ? country.fromCountry
    : `${t.occupationCountry.from} ${country.country}`;

  return (
    <header className="hero">
      <div className="bg-container">
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
            {people.slice(5, 9).map(p => (
              <PersonImage
                key={p.id}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.name || ""}
                wrap={false}
              />
            ))}
          </div>
          <div
            style={{backgroundColor: COLORS_DOMAIN[occupation.domain_slug]}}
            className="bg-img-mask-after"
          ></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">{t.occupationCountry.theMostFamous}</h2>
        <h1 className="profile-name">
          {occupationDisplay} {countryPart}
        </h1>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
