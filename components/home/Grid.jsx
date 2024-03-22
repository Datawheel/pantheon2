import React from "react";
import PersonImage from "/components/utils/PersonImage";

const HomeGrid = ({bios, showDates}) => (
  <ul className="grid-row">
    {bios.map(profile => (
      <li className="grid-box" key={profile.pid || profile.id}>
        <a href={`/profile/person/${profile.slug}`}>
          <div className="grid-box-bg-container">
            <PersonImage
              src={`/images/profile/people/${profile.pid || profile.id}.jpg`}
              alt={`Photo of ${profile.name}`}
              fallbackSrc="/images/icons/icon-person.svg"
            />
          </div>
          <div className="grid-box-title-container">
            {profile.name}
            {showDates ? (
              <div className="grid-box-title-dates">
                {profile.birthyear} - {profile.deathyear}
              </div>
            ) : null}
          </div>
        </a>
      </li>
    ))}
  </ul>
);

export default HomeGrid;
