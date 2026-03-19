"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Grid from "/components/home/Grid";
import GridCta from "/components/home/GridCta";
import Spinner from "/components/Spinner";
import Select from "/components/common/Select";
import {SUPPORTED_LOCALES, getLocalizedLanguageName, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";

const LangSelector = ({handleLanguageChange, trendingLangEdition, currentLang}) => (
  <Select
    label=""
    className="home-select"
    fontSize="sm"
    onChange={handleLanguageChange}
    value={trendingLangEdition}
  >
    {SUPPORTED_LOCALES.map(locale => (
      <option key={locale} value={locale}>
        {getLocalizedLanguageName(locale, currentLang)}
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
  showTrendingExcerpt = false,
  trendingWithReasons = [],
  ctaHref,
  ctaLabel,
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
      if (!res.ok) {
        console.error(`Error fetching trending data: HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      const text = await res.text();
      if (text.startsWith("<")) {
        console.error("Error fetching trending data: Got HTML instead of JSON");
        setLoading(false);
        return;
      }
      const data = JSON.parse(text);
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

  const t = getTranslations(trendingLangEdition);
  const localePrefix = trendingLangEdition === DEFAULT_LOCALE ? "" : `/${trendingLangEdition}`;

  return (
    <div className="profile-grid">
      <div className="grid-title-container">
        <h3 className="grid-title">{title}</h3>
        {allowLangChange ? (
          <p className="grid-subtitle">
            <span className="grid-select-label">
              {t.home.topProfilesBy}{" "}
            </span>
            <LangSelector
              handleLanguageChange={handleLanguageChange}
              trendingLangEdition={trendingLangEdition}
              currentLang={trendingLangEdition}
            />
            <span className="grid-select-label"> {t.home.wikipediaEdition}</span>
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
          localePrefix={localePrefix}
          trendingExcerpt={
            trendingWithReasons.length > 0 && showTrendingExcerpt
              ? {
                  trendingPeople: trendingWithReasons,
                  currentLang: trendingLangEdition,
                }
              : null
          }
        />
      ) : (
        <div className="loading-trends">
          <Spinner />
        </div>
      )}
      <GridCta href={ctaHref} label={ctaLabel} />
    </div>
  );
}
