"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {micromark} from "micromark";
import {Tooltip} from "@blueprintjs/core";
import {SUPPORTED_LOCALES, getLocalizedLanguageName, DEFAULT_LOCALE} from "/app/locales";
import {getTranslations} from "/app/translations";
import PersonImage from "/components/utils/PersonImage";
import "./TrendingNews.css";

dayjs.extend(advancedFormat);

// Model display names
const MODEL_NAMES = {
  grok: "Grok",
  gemini: "Gemini",
  claude: "Claude",
  openai: "OpenAI",
  unknown: "AI",
};

export default function TrendingNews({languageSections, currentLang, currentDate, currentModel}) {
  const router = useRouter();
  const t = getTranslations(currentLang);
  // Track per-card model overrides: { [slug]: "grok" | "gemini" | etc }
  const [cardModelOverrides, setCardModelOverrides] = useState({});
  // Track which cards are expanded on mobile
  const [expandedCards, setExpandedCards] = useState({});
  const localePrefix = currentLang === DEFAULT_LOCALE ? "" : `/${currentLang}`;

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

  // Get the active model response for a person
  const getActiveModelResponse = person => {
    const responses = person.modelResponses || [];
    if (responses.length === 0) return null;

    // Check for per-card override first, then fall back to master selection
    const activeModel = cardModelOverrides[person.slug] || currentModel;
    const response = responses.find(r => r.provider === activeModel);
    // Fall back to first response if selected model not found
    return response || responses[0];
  };

  // Get trending reason from API data
  const getPeopleSummary = person => {
    const response = getActiveModelResponse(person);
    return micromark(response?.reason || "");
  };

  // Get languages that have people assigned, sorted with current lang first
  const languagesWithPeople = Object.keys(languageSections).sort((a, b) => {
    if (a === currentLang) return -1;
    if (b === currentLang) return 1;
    return a.localeCompare(b);
  });

  const toggleCardExpand = slug => {
    setExpandedCards(prev => ({...prev, [slug]: !prev[slug]}));
  };

  const renderPersonCard = (person, index) => {
    // Sort language ranks for display (current lang first, then by rank)
    const langRankEntries = Object.entries(person.languageRanks || {}).sort((a, b) => {
      if (a[0] === currentLang) return -1;
      if (b[0] === currentLang) return 1;
      return a[1] - b[1];
    });

    const responses = person.modelResponses || [];
    const activeResponse = getActiveModelResponse(person);
    const activeModel = cardModelOverrides[person.slug] || currentModel;
    const hasMultipleModels = responses.length > 1;
    const isExpanded = expandedCards[person.slug];
    const currentLangRank = person.languageRanks?.[currentLang];

    const handleCardModelChange = provider => {
      setCardModelOverrides(prev => ({
        ...prev,
        [person.slug]: provider,
      }));
    };

    return (
      <div key={person.id || person.slug} className={`trending-news-card ${isExpanded ? "expanded" : ""}`}>
        {/* Mobile compact row */}
        <div className="mobile-card-row" onClick={() => toggleCardExpand(person.slug)}>
          <div className="mobile-card-thumb">
            <a href={`${localePrefix}/profile/person/${person.slug}`} onClick={e => e.stopPropagation()}>
              <PersonImage
                src={`/profile/people/${person.pid || person.id}.jpg`}
                alt={`Photo of ${person.localized_name || person.name}`}
                fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
              />
            </a>
            {currentLangRank && (
              <span className="mobile-rank">#{currentLangRank}</span>
            )}
          </div>
          <div className="mobile-card-text">
            <h3 className="mobile-card-name">
              <a href={`${localePrefix}/profile/person/${person.slug}`} onClick={e => e.stopPropagation()}>
                {person.localized_name || person.name}
              </a>
            </h3>
            <span className="mobile-card-occupation">
              {person.localized_occupation || person.occupation || "Unknown"}
            </span>
            {!isExpanded && (
              <p className="mobile-card-preview" dangerouslySetInnerHTML={{__html: getPeopleSummary(person)}} />
            )}
          </div>
          <span className={`mobile-expand-icon ${isExpanded ? "open" : ""}`}>&#9662;</span>
        </div>

        {/* Mobile expanded detail */}
        {isExpanded && (
          <div className="mobile-card-detail">
            <p
              className="trending-news-summary"
              dangerouslySetInnerHTML={{__html: getPeopleSummary(person)}}
            />
            {langRankEntries.length > 0 && (
              <div className="mobile-rank-list">
                {langRankEntries.map(([langCode, rank]) => (
                  <span key={langCode} className={`mobile-rank-tag ${langCode === currentLang ? "current-lang" : ""}`}>
                    {langCode.toUpperCase()} #{rank}
                  </span>
                ))}
              </div>
            )}
            {activeResponse?.llm_metadata?.citations && activeResponse.llm_metadata.citations.length > 0 && (
              <div className="citations-container">
                <h4>{t.news.references}</h4>
                <ol>
                  {activeResponse.llm_metadata.citations.map((citation, idx) => (
                    <li key={idx}>
                      <a href={citation} target="_blank" rel="noopener noreferrer">
                        {citation}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {hasMultipleModels && (
              <div className="card-model-switcher">
                {responses.map(response => (
                  <button
                    key={response.provider}
                    className={`card-model-btn ${activeModel === response.provider ? "active" : ""}`}
                    onClick={e => { e.stopPropagation(); handleCardModelChange(response.provider); }}
                    title={MODEL_NAMES[response.provider] || response.provider}
                  >
                    {MODEL_NAMES[response.provider] || response.provider}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop full card (hidden on mobile) */}
        <div className="desktop-card-content">
          <div className="trending-news-image-container">
            <a href={`${localePrefix}/profile/person/${person.slug}`}>
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
              <a href={`${localePrefix}/profile/person/${person.slug}`}>
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
            {activeResponse?.llm_metadata?.citations && activeResponse.llm_metadata.citations.length > 0 && (
              <div className="citations-container">
                <h4>{t.news.references}</h4>
                <ol>
                  {activeResponse.llm_metadata.citations.map((citation, idx) => (
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
            {hasMultipleModels && (
              <div className="card-model-switcher">
                {responses.map(response => (
                  <button
                    key={response.provider}
                    className={`card-model-btn ${activeModel === response.provider ? "active" : ""}`}
                    onClick={() => handleCardModelChange(response.provider)}
                    title={MODEL_NAMES[response.provider] || response.provider}
                  >
                    {MODEL_NAMES[response.provider] || response.provider}
                  </button>
                ))}
              </div>
            )}
          </div>
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

        <div className="header-controls">
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

        <div className="day-navigation">
          <a
            className="day-nav-btn"
            href={`/${currentLang}/news?date=${dayjs(currentDate).subtract(1, "day").format("YYYY-MM-DD")}&model=${currentModel}`}
          >
            &larr; {t.news.previousDay}
          </a>
          {dateValue < dayjs().format("YYYY-MM-DD") && (
            <a
              className="day-nav-btn"
              href={`/${currentLang}/news?date=${dayjs(currentDate).add(1, "day").format("YYYY-MM-DD")}&model=${currentModel}`}
            >
              {t.news.nextDay} &rarr;
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
