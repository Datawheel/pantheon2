import {Fragment} from "react";
import PersonImage from "@/components/utils/PersonImage";
import TrendingExcerpt from "@/components/home/TrendingExcerpt";

const TrendIndicator = ({rankDelta}) => {
  let type = null;
  if (rankDelta === null || rankDelta === undefined) {
    type = "new";
  } else if (rankDelta > 0) {
    type = "up";
  } else if (rankDelta < 0) {
    type = "down";
  } else {
    return null;
  }

  const deltaValue = type === "new" ? null : Math.abs(rankDelta);
  const label =
    type === "new"
      ? "Newly trending"
      : type === "up"
      ? `Trending up ${deltaValue}`
      : `Trending down ${deltaValue}`;

  return (
    <span className={`trend-indicator ${type}`} role="img" aria-label={label}>
      {type === "up" ? (
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 2 L10 10 H2 Z" />
        </svg>
      ) : null}
      {type === "down" ? (
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 2 H10 L6 10 Z" />
        </svg>
      ) : null}
      {type === "new" ? (
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 1.2 L7.6 4.6 L11.2 4.9 L8.4 7.2 L9.2 10.8 L6 8.9 L2.8 10.8 L3.6 7.2 L0.8 4.9 L4.4 4.6 Z" />
        </svg>
      ) : null}
      {deltaValue !== null ? (
        <span className="trend-indicator-text">{deltaValue}</span>
      ) : null}
    </span>
  );
};

const Grid = ({bios, showDates, showTrendIndicator = true, trendingExcerpt = null, localePrefix = ""}) => {
  return (
    <ul className="grid-row">
      {bios.map((profile, index) => (
        <Fragment key={profile.pid || profile.id}>
          <li className="grid-box">
            <a href={`${localePrefix}/profile/person/${profile.slug}`}>
              <div className="grid-box-bg-container">
                {showTrendIndicator ? (
                  <TrendIndicator rankDelta={profile.rank_delta} />
                ) : null}
                <PersonImage
                  person={profile}
                  src={`/profile/people/${profile.pid || profile.id}.jpg`}
                  alt={`Photo of ${profile.title || profile.name}`}
                  fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                />
              </div>
              <div className="grid-box-title-container">
                {profile.title || profile.name}
                {showDates ? (
                  <div className="grid-box-title-dates">
                    {profile.birthyear} - {profile.deathyear}
                  </div>
                ) : null}
              </div>
            </a>
          </li>
          {/* Mount once; the excerpt positions its grid row from the active story. */}
          {index === 3 && trendingExcerpt && (
            <TrendingExcerpt
              trendingPeople={trendingExcerpt.trendingPeople}
              currentLang={trendingExcerpt.currentLang}
              allBios={bios}
            />
          )}
        </Fragment>
      ))}
    </ul>
  );
};

export default Grid;
