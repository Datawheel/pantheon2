import React from "react";
import Spinner from "components/Spinner";
import "pages/HomeGrid.css";

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
              <div className="grid-box-bg-container">
                <div className="grid-box-bg-img-mask">
                  <div className={`grid-box-bg-img ${profile.gender}`} style={{backgroundImage: `url(/images/profile/people/${profile.pid}.jpg)`}}></div>
                </div>
              </div>
              <h3>{profile.name}</h3>
            </a>
          </li>
        )}
      </ul>
      : <div className="loading-trends"><Spinner /></div>}
  </div>
;

export default HomeGrid;
