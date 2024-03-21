import {plural} from "pluralize";
import {COLORS_DOMAIN} from "../utils/consts";
import "../../styles/Header.css";
import "../../styles/mouse.css";

export default function Header({occupation, country, people}) {
  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask profession">
          <div className="bg-img bg-img-t">
            {people.slice(0, 4).map(p => (
              <img key={p.id} src={`/images/profile/people/${p.id}.jpg`} />
            ))}
          </div>
          <div className="bg-img bg-img-b">
            {people.slice(5, 9).map(p => (
              <img key={p.id} src={`/images/profile/people/${p.id}.jpg`} />
            ))}
          </div>
          <div
            style={{backgroundColor: COLORS_DOMAIN[occupation.domain_slug]}}
            className="bg-img-mask-after"
          ></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">The Most Famous</h2>
        <h1 className="profile-name">
          {plural(occupation.occupation)} from {country.country}
        </h1>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
