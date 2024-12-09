import {COLORS_DOMAIN} from "../utils/consts";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({year, people}) {
  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people
              .sort((a, b) => b.hpi - a.hpi)
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
            {people
              .sort((a, b) => b.hpi - a.hpi)
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
        <h2 className="profile-type">Celebrity Deaths in</h2>
        <h1 className="profile-name">{year}</h1>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
