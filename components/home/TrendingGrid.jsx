"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Grid from "/components/home/Grid";
import Spinner from "/components/Spinner";
import Select from "/components/common/Select";
import {SUPPORTED_LOCALES, LOCALE_NAMES, DEFAULT_LOCALE} from "/app/locales";

const LangSelector = ({handleLanguageChange, trendingLangEdition}) => (
  <Select
    label=""
    className="home-select"
    fontSize="sm"
    onChange={handleLanguageChange}
    value={trendingLangEdition}
  >
    {SUPPORTED_LOCALES.map(locale => (
      <option key={locale} value={locale}>
        {LOCALE_NAMES[locale]}
      </option>
    ))}
  </Select>
);

export default function TrendingGrid({
  title,
  allowLangChange,
  initialTrendingAll,
  defaultLang,
  occupation,
  showTrendIndicator = true,
  showDates = false,
  showNewsButton = false,
}) {
  const router = useRouter();
  const [trendingAll, setTrendingAll] = useState(initialTrendingAll);
  const [trendingLangEdition, setTrendingLangEdition] = useState(defaultLang);
  const [loading, setLoading] = useState(false);

  const fetchTrendingData = async lang => {
    setLoading(true);
    try {
      const trendingUrl = occupation
        ? `/api/wikiTrends?lang=${lang}&occupation=${occupation}&limit=16`
        : `/api/wikiTrends?lang=${lang}&limit=16`;
      const res = await fetch(trendingUrl, {
        cache: "force-cache", // Use browser cache if available
      });
      const data = await res.json();
      setTrendingAll(data);
    } catch (error) {
      console.error("Error fetching trending data:", error);
    }
    setLoading(false);
  };

  // Handle language change - navigate to new locale URL
  const handleLanguageChange = e => {
    const selectedLang = e.target.value;
    // Immediately update dropdown for responsive feel
    setTrendingLangEdition(selectedLang);
    setLoading(true);
    // Navigate to the new locale URL
    router.push(`/${selectedLang}`);
  };

  // Get today's date for the news link
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <div className="profile-grid">
      <div className="grid-title-container">
        <h3 className="grid-title">{title}</h3>
        {allowLangChange ? (
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
        ) : null}
      </div>
      {!loading ? (
        <Grid
          bios={
            allowLangChange
              ? trendingAll.sort((a, b) => a.rank - b.rank).slice(0, 16)
              : trendingAll.slice(0, 16)
          }
          showTrendIndicator={showTrendIndicator}
          showDates={showDates}
        />
      ) : (
        <div className="loading-trends">
          <Spinner />
        </div>
      )}
      {showNewsButton && (
        <div className="trending-news-button-container">
          <Link href={`/${trendingLangEdition}/news?date=${today}`} className="trending-news-link">
            Find out why these people are trending
          </Link>
        </div>
      )}
    </div>
  );
}
