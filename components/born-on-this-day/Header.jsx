import "../../styles/Header.css";
import "../../styles/mouse.css";
import PersonImage from "@/components/utils/PersonImage";
import {getTranslations} from "@/app/translations";

export default function Header({date, displayDate, people, lang = "en"}) {
  const t = getTranslations(lang);

  // Sort by HPI to get most famous people for header images
  const sortedPeople = [...people].sort((a, b) => {
    if (!a.hpi && !b.hpi) return 0;
    if (!a.hpi) return 1;
    if (!b.hpi) return -1;
    return b.hpi - a.hpi;
  });

  // Get top 8 people for header images (split into two rows)
  const topImages = sortedPeople.slice(0, 8);
  const topRow = topImages.slice(0, 4);
  const bottomRow = topImages.slice(4, 8);

  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {topRow.map(p => (
              <PersonImage
                key={p.id}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.name}
                wrap={false}
              />
            ))}
          </div>
          <div className="bg-img bg-img-b">
            {bottomRow.map(p => (
              <PersonImage
                key={p.id}
                person={p}
                src={`/profile/people/${p.id}.jpg`}
                alt={p.name}
                wrap={false}
              />
            ))}
          </div>
          <div className="bg-img-mask-after"></div>
        </div>
      </div>
      <div className="info">
        <p className="top-desc">{t.bornOnThisDay?.famousBirthdays || "Famous Birthdays"}</p>
        <h2 className="profile-type">{t.bornOnThisDay?.bornOnThisDay || "Born on This Day"}</h2>
        <h1 className="profile-name">{displayDate}</h1>
        <p className="date-subtitle">
          {t.bornOnThisDay?.famousPeopleBornOnThisDay?.({count: people.length}) ||
            `${people.length} famous ${people.length === 1 ? "person" : "people"} born on this day`}
        </p>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
