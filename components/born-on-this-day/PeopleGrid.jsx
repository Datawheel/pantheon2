import PersonImage from "@/components/utils/PersonImage";
import "./PeopleGrid.css";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {toTitleCase} from "../utils/vizHelpers";
import Link from "next/link";
import {DEFAULT_LOCALE} from "@/app/locales";
import {getTranslations} from "@/app/translations";

dayjs.extend(advancedFormat);

const PeopleGrid = ({bios, date, lang = "en"}) => {
  const localePrefix = lang === DEFAULT_LOCALE ? "" : `/${lang}`;
  const t = getTranslations(lang);

  // Parse date (MM-DD format) for rankings link
  const [monthStr, dayStr] = date.split("-");
  const birthMonth = parseInt(monthStr, 10);
  const birthDay = parseInt(dayStr, 10);

  return (
    <>
      <div className="birthday-people-grid">
        {bios.map(profile => (
          <a
            href={`${localePrefix}/profile/person/${profile.slug}`}
            className="birthday-person-card"
            key={profile.id}
          >
            <div className="birthday-person-card__image">
              <PersonImage
                person={profile}
                src={`/profile/people/${profile.id}.jpg`}
                alt={`Photo of ${profile.name}`}
                fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
              />
            </div>
            <div className="birthday-person-card__info">
              <h2 className="birthday-person-card__name">{profile.name}</h2>
              {profile.occupation && (
                <h3 className="birthday-person-card__occupation">
                  {toTitleCase(profile.occupation)}
                </h3>
              )}
              <p className="birthday-person-card__dates">
                {profile.birthdate && (
                  <span>
                    {t.bornOnThisDay?.born || "Born"} {dayjs(profile.birthdate).format("MMMM D, YYYY")}
                  </span>
                )}
              </p>
              {profile.hpi && (
                <p className="birthday-person-card__hpi">HPI: {profile.hpi.toFixed(2)}</p>
              )}
            </div>
          </a>
        ))}
      </div>
      <div className="view-more-link">
        <Link href={`${localePrefix}/explore/rankings?show=people&birthMonth=${birthMonth}&birthDay=${birthDay}`}>
          {t.bornOnThisDay?.viewFullRankings || "View Full Rankings for This Day"} &rarr;
        </Link>
      </div>
    </>
  );
};

export default PeopleGrid;
