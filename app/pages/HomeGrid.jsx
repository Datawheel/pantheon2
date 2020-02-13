import React from "react";
import Spinner from "components/Spinner";
import "pages/HomeGrid.css";

const formatDelta = n => {
  if (n === 0) return "-";
  return n > 0 ? `▲ ${Math.abs(n)}` : `▼ ${Math.abs(n)}`;
};

const deltaClassName = n => {
  if (n === null) return "new";
  return n >= 0 ? "up" : "down";
};

const HomeGrid = ({bios, loading, trendingLangEdition, changeTrendingLang}) =>

  <div className="profile-grid">
    <h3 className="grid-title">Trending Profiles Today</h3>
    <p className="grid-subtitle">
      Top profiles by pageviews for the&nbsp;
      <select onChange={changeTrendingLang} value={trendingLangEdition}>
        <option value="ar">Arabic</option>
        <option value="zh">Chinese</option>
        <option value="nl">Dutch</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="es">Spanish</option>
      </select>
      &nbsp;wikipedia edition
    </p>
    {!loading
      ? <ul className="grid-row">
        {bios.sort((a, b) => a.rank - b.rank).map(profile =>
          <li className="grid-box" key={profile.pid}>
            <a href={`/profile/person/${profile.slug}`}>
              {/* <div className="backup-title">{profile.name}</div> */}
              <div className="grid-box-bg-container">
                <div className="grid-box-bg-img-mask">
                  <div className={`grid-box-bg-img ${profile.gender}`} style={{backgroundImage: `url(/images/profile/people/${profile.pid}.jpg)`}}></div>
                </div>
              </div>
              <div className="grid-box-title-container">
                {profile.name}
              </div>

              {/* <h3>{profile.name}</h3> */}
              {profile.rank_delta !== undefined
                ? <div className={`rank_delta ${deltaClassName(profile.rank_delta)}`}>{profile.rank_delta !== null ? formatDelta(profile.rank_delta) : "NEW"}</div>
                : null}
            </a>
          </li>
        )}
      </ul>
      : <div className="loading-trends"><Spinner /></div>}
  </div>
;

export default HomeGrid;
