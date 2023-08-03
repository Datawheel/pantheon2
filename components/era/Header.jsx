import "../../styles/Header.css";
import "../../styles/mouse.css";
import { FORMATTERS } from "../utils/consts";

export default function Header({ era }) {
  return (
    <header className="hero">
      <div className="bg-container">
        <div className="bg-img-mask era">
          <div
            className="bg-img"
            style={{
              backgroundImage: `url(/images/profile/era/${era.id}.jpg)`,
            }}
          ></div>
        </div>
      </div>
      <div className="info">
        <h2 className="profile-type">Time Period</h2>
        <h1 className="profile-name">{era.name}</h1>
        <h2 className="date-subtitle">
          {FORMATTERS.year(era.start_year)} - {FORMATTERS.year(era.end_year)}
        </h2>
      </div>
      <div className="mouse">
        <span className="mouse-scroll"></span>
      </div>
    </header>
  );
}
