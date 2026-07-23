import "../../styles/Header.css";
import "../../styles/mouse.css";
import PersonImage from "@/components/utils/PersonImage";
import {
  formatDeathsYear,
  getDeathsTranslations,
} from "@/app/deathsTranslations";

export default function Header({
  year,
  people,
  occupation = null,
  country = null,
  lang = "en",
}) {
  const t = getDeathsTranslations(lang);
  const formattedYear = formatDeathsYear(year, lang);
  const sortedPeople = [...people].sort((a, b) => {
    if (!a.hpi && !b.hpi) return 0;
    if (!a.hpi) return 1;
    if (!b.hpi) return -1;
    return b.hpi - a.hpi;
  });

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {sortedPeople
              .filter(p => p.gender === "M")
              .slice(0, 4)
              .map(p => (
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
            {sortedPeople
              .filter(p => p.gender === "F")
              .slice(0, 4)
              .map(p => (
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
      <div className="info">
        <h2 className="profile-type">
          {occupation
            ? t("headerOccupation", {occupation: occupation.occupation})
            : country
            ? t("headerCountry", {country: country.country})
            : t("header")}
        </h2>
        <h1 className="profile-name">{formattedYear}</h1>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
