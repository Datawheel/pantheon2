import PersonImage from "/components/utils/PersonImage";
import "./PeopleGrid.css";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {toTitleCase} from "../utils/vizHelpers";
import Link from "next/link";

dayjs.extend(advancedFormat);

const PeopleGrid = ({bios}) => (
  <>
    <div className="people-grid">
      {bios.map(profile => (
        <a
          href={`/profile/person/${profile.slug}`}
          className="person-card"
          key={profile.pid || profile.id}
        >
          <div className="person-card__image">
            <PersonImage
              src={`/profile/people/${profile.pid || profile.id}.jpg`}
              alt={`Photo of ${profile.name}`}
              fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
            />
          </div>
          <div className="person-card__info">
            <h2 className="person-card__name">{profile.name}</h2>
            <h3 className="person-card__occupation">
              {profile.bplace_country?.demonym
                ? `${profile.bplace_country?.demonym} ${toTitleCase(
                    profile.occupation?.occupation
                  )}`
                : `${toTitleCase(profile.occupation?.occupation)}`}
            </h3>
            <p className="person-card__dates">
              <span>
                {dayjs(profile.birthdate).format("MMM D, YYYY")} -{" "}
                {dayjs(profile.deathdate).format("MMM D, YYYY")}
              </span>
            </p>
            <p className="person-card__age">
              Age {parseInt(profile.deathyear) - parseInt(profile.birthyear)}
            </p>
            <p className="person-card__hpi">HPI: {profile.hpi.toFixed(2)}</p>
          </div>
        </a>
      ))}
    </div>
    <div className="view-more-link">
      <Link href="/explore/rankings?show=people&years=2024,2024&yearType=deathyear">
        View Full List of 2024 Deaths Ranked by HPI →
      </Link>
    </div>
  </>
);

export default PeopleGrid;
