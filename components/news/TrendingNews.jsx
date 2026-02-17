"use client";

import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {micromark} from "micromark";
import {Tooltip} from "@blueprintjs/core";
import {SUPPORTED_LOCALES, getLocalizedLanguageName} from "/app/locales";
import {getTranslations} from "/app/translations";
import PersonImage from "/components/utils/PersonImage";
import "./TrendingNews.css";

dayjs.extend(advancedFormat);

export default function TrendingNews({languageSections, currentLang, currentDate, currentModel}) {
  const router = useRouter();
  const t = getTranslations(currentLang);

  const handleModelChange = model => {
    router.push(`/${currentLang}/news?date=${dateValue}&model=${model}`);
  };

  // Format date in the current language using Intl.DateTimeFormat
  const dateObj = new Date(currentDate + "T12:00:00Z");
  const formattedDate = new Intl.DateTimeFormat(currentLang, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);

  const dateValue = dayjs(currentDate).format("YYYY-MM-DD");

  const handleLanguageChange = lang => {
    router.push(`/${lang}/news?date=${dateValue}&model=${currentModel}`);
  };

  const handleDateChange = e => {
    const newDate = e.target.value;
    router.push(`/${currentLang}/news?date=${newDate}&model=${currentModel}`);
  };

  // Get trending reason from API data
  const getPeopleSummary = person => {
    return micromark(person.trending_reason || "");
  };

  // Get languages that have people assigned, sorted with current lang first
  const languagesWithPeople = Object.keys(languageSections).sort((a, b) => {
    if (a === currentLang) return -1;
    if (b === currentLang) return 1;
    return a.localeCompare(b);
  });

  const renderPersonCard = (person, index) => {
    // Sort language ranks for display (current lang first, then by rank)
    const langRankEntries = Object.entries(person.languageRanks || {}).sort((a, b) => {
      if (a[0] === currentLang) return -1;
      if (b[0] === currentLang) return 1;
      return a[1] - b[1];
    });

    return (
      <div key={person.id || person.slug} className="trending-news-card">
        <div className="trending-news-image-container">
          <a href={`/profile/person/${person.slug}`}>
            <PersonImage
              src={`/profile/people/${person.pid || person.id}.jpg`}
              alt={`Photo of ${person.localized_name || person.name}`}
              fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
            />
          </a>
          {langRankEntries.length > 0 && (
            <div className="language-rank-badges">
              {langRankEntries.map(([langCode, rank]) => (
                <Tooltip
                  key={langCode}
                  content={`Rank #${rank} in ${getLocalizedLanguageName(langCode, currentLang)}`}
                >
                  <div
                    className={`lang-rank-badge ${langCode === currentLang ? 'current-lang' : ''}`}
                  >
                    <span className="lang-code">{langCode.toUpperCase()}</span>
                    <span className="lang-rank">{rank}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          )}
        </div>

      <div className="trending-news-info">
        <h3 className="trending-news-person-name">
          <a href={`/profile/person/${person.slug}`}>
            {person.localized_name || person.name}
          </a>
        </h3>
        <p className="trending-news-occupation">
          {person.localized_occupation || person.occupation || "Unknown"}
        </p>
        <p
          className="trending-news-summary"
          dangerouslySetInnerHTML={{__html: getPeopleSummary(person)}}
        />
        {person.llm_metadata?.citations && person.llm_metadata.citations.length > 0 && (
          <div className="citations-container">
            <h4>{t.news.references}</h4>
            <ol>
              {person.llm_metadata.citations.map((citation, idx) => (
                <li key={idx}>
                  <a
                    href={citation}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {citation}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
  };

  return (
    <div className="trending-news-page">
      <div className="trending-news-header">
        <h1 className="trending-news-title">{t.news.pageTitle}</h1>
        <p className="trending-news-subtitle">
          {t.news.pageSubtitle}
        </p>
        <p className="trending-news-date">{formattedDate}</p>

        <div className="language-selector">
          {SUPPORTED_LOCALES.map(locale => (
            <button
              key={locale}
              className={`lang-tab ${currentLang === locale ? "active" : ""}`}
              onClick={() => handleLanguageChange(locale)}
            >
              {locale.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="date-selector">
          <label htmlFor="date-picker">{t.news.selectDate}</label>
          <input
            id="date-picker"
            type="date"
            value={dateValue}
            onChange={handleDateChange}
            min="2026-01-05"
            max={dayjs().format("YYYY-MM-DD")}
          />
        </div>

        <div className="model-selector">
          <label>{t.news?.selectModel || "AI Model"}:</label>
          <div className="model-toggle">
            <button
              className={`model-btn ${currentModel === "grok" ? "active" : ""}`}
              onClick={() => handleModelChange("grok")}
            >
              Grok
            </button>
            <button
              className={`model-btn ${currentModel === "gemini" ? "active" : ""}`}
              onClick={() => handleModelChange("gemini")}
            >
              Gemini
            </button>
          </div>
        </div>
      </div>

      <div className="trending-news-content">
        {languagesWithPeople.length === 0 ? (
          <div className="no-data">
            <p>{t.news.noData}</p>
          </div>
        ) : (
          languagesWithPeople.map(lang => (
            <div key={lang} className="trending-language-section">
              <h2 className="trending-section-title">
                {t.news.trendingIn} {getLocalizedLanguageName(lang, currentLang)}
              </h2>

              <div className="trending-news-grid">
                {languageSections[lang]
                  .sort((a, b) => {
                    const rankA = a.languageRanks?.[lang] || 999;
                    const rankB = b.languageRanks?.[lang] || 999;
                    return rankA - rankB;
                  })
                  .map((person, index) => renderPersonCard(person, index))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
