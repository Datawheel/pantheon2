import "../../styles/Header.css";
import "../../styles/mouse.css";
import {plural} from "pluralize";

export default function Header({
  year,
  people,
  occupation = null,
  country = null,
}) {
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
                <img
                  key={p.id}
                  src={`https://static.pantheon.world/profile/people/${p.id}.jpg`}
                />
              ))}
          </div>
          <div className="bg-img bg-img-b">
            {sortedPeople
              .filter(p => p.gender === "F")
              .slice(0, 4)
              .map(p => (
                <img
                  key={p.id}
                  src={`https://static.pantheon.world/profile/people/${p.id}.jpg`}
                />
              ))}
          </div>
          <div className="bg-img-mask-after"></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">
          {occupation
            ? `${plural(occupation.occupation)} that died in `
            : country
            ? `${country.demonym} people that Died in `
            : "Celebrity Deaths in"}
        </h2>
        <h1 className="profile-name">{year}</h1>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
