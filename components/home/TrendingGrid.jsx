"use client";

import {useState} from "react";
import HomeGrid from "/components/home/Grid";
import Spinner from "/components/Spinner";
import Select from "/components/common/Select";

const LangSelector = ({handleLanguageChange, trendingLangEdition}) => (
  <Select
    label=""
    className="home-select"
    fontSize="sm"
    onChange={handleLanguageChange}
    value={trendingLangEdition}
  >
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
  </Select>
);

export default function TrendingGrid({initialTrendingAll, defaultLang}) {
  const [trendingAll, setTrendingAll] = useState(initialTrendingAll);
  const [trendingLangEdition, setTrendingLangEdition] = useState(defaultLang);
  const [loading, setLoading] = useState(false);

  const fetchTrendingData = async lang => {
    setLoading(true);
    try {
      const res = await fetch(`/api/wikiTrends?lang=${lang}&limit=12`, {
        cache: "force-cache", // Use browser cache if available
      });
      const data = await res.json();
      setTrendingAll(data);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
    setLoading(false);
  };

  // Handle language change dynamically
  const handleLanguageChange = e => {
    const selectedLang = e.target.value;
    setTrendingLangEdition(selectedLang);
    fetchTrendingData(selectedLang);
  };

  return (
    <div className="profile-grid">
      <div className="grid-title-container">
        <h3 className="grid-title">Trending Profiles Today</h3>
        <p className="grid-subtitle">
          <span className="grid-select-label">
            Top profiles by pageviews for the{" "}
          </span>
          <LangSelector
            handleLanguageChange={handleLanguageChange}
            trendingLangEdition={trendingLangEdition}
          />
          <span className="grid-select-label"> wikipedia edition</span>
        </p>
      </div>
      {!loading ? (
        <HomeGrid
          bios={trendingAll.sort((a, b) => a.rank - b.rank).slice(0, 16)}
        />
      ) : (
        <div className="loading-trends">
          <Spinner />
        </div>
      )}
    </div>
  );
}
