import React from "react";
import PersonImage from "/components/utils/PersonImage";

const formatDelta = (n) => {
  if (n === 0) return "-";
  return n > 0 ? `▲ ${Math.abs(n)}` : `▼ ${Math.abs(n)}`;
};

const deltaClassName = (n) => {
  if (n === null) return "new";
  return n >= 0 ? "up" : "down";
};

const HomeGrid = ({ bios, showDates }) => (
  <ul className="grid-row">
    {bios.map((profile) => (
      <li className="grid-box" key={profile.pid || profile.id}>
        <a href={`/profile/person/${profile.slug}`}>
          {/* <div className="backup-title">{profile.name}</div> */}
          <div className="grid-box-bg-container">
            <PersonImage
              src={`/images/profile/people/${profile.pid || profile.id}.jpg`}
              alt={`Photo of ${profile.name}`}
              fallbackSrc="/images/icons/icon-person.svg"
            />
            {/* <div className="grid-box-bg-img-mask"> */}
            {/* <div className={`grid-box-bg-img ${profile.gender}`} style={{backgroundImage: `url(/images/profile/people/${profile.pid || profile.id}.jpg)`}}></div> */}
            {/* </div> */}
          </div>
          <div className="grid-box-title-container">
            {profile.name}
            {showDates ? (
              <div className="grid-box-title-dates">
                {profile.birthyear} - {profile.deathyear}
              </div>
            ) : null}
          </div>

          {/* <h3>{profile.name}</h3> */}
          {/* {profile.rank_delta !== undefined
            ? <div className={`rank_delta ${deltaClassName(profile.rank_delta)}`}>{profile.rank_delta !== null ? formatDelta(profile.rank_delta) : "NEW"}</div>
            : null} */}
        </a>
      </li>
    ))}
  </ul>
);
export default HomeGrid;
