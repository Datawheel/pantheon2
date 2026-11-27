"use client";

import {useState} from "react";
import {micromark} from "micromark";
import Link from "next/link";
import {getTranslations} from "@/app/translations";
import "./WhyTrending.css";

// Model display names
const MODEL_NAMES = {
  grok: "Grok",
  gemini: "Gemini",
  claude: "Claude",
  openai: "OpenAI",
  unknown: "AI",
};

export default function WhyTrending({
  person,
  trendingData,
  currentLang = "en",
}) {
  const t = getTranslations(currentLang);
  const modelResponses = trendingData?.modelResponses || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get the current model response
  const currentResponse = modelResponses[currentIndex] || {
    reason: trendingData?.trendingReason,
    llmMetadata: trendingData?.llmMetadata,
    provider: "unknown",
  };

  const reason = currentResponse.reason;
  const citations = currentResponse.llmMetadata?.citations || [];
  const hasMultipleModels = modelResponses.length > 1;

  // Convert markdown to HTML using micromark
  let reasonHtml = "";
  if (reason) {
    reasonHtml = micromark(reason);
    // Format citations as superscripts
    const regex = /(\[\d+\])+/g;
    reasonHtml = reasonHtml.replace(regex, match => {
      const numbers = match.match(/\d+/g);
      return `<sup>${numbers.join(",")}</sup>`;
    });
  }

  // Get today's date for the news link
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")}`;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? modelResponses.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === modelResponses.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="why-trending-container">
      <h2>{t.trending.isTrendingToday.replace("{name}", person.name)}</h2>
      {reason ? (
        <div className="reason-container">
          <div className="reason-header">
            <h3>{t.trending.whyTrending.replace("{name}", person.name)}</h3>
          </div>
          <div className="reason-text" dangerouslySetInnerHTML={{__html: reasonHtml}} />
          {citations.length > 0 && (
            <div className="citations-container">
              <h4>{t.trending.references}</h4>
              <ol>
                {citations.map((citation, index) => (
                  <li key={index}>
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
            <div className="model-nav">
              <button
                className="model-nav-arrow"
                onClick={handlePrev}
                aria-label="Previous model"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <div className="model-dots">
                {modelResponses.map((response, index) => (
                  <button
                    key={index}
                    className={`model-dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`View ${MODEL_NAMES[response.provider] || response.provider} response`}
                    title={MODEL_NAMES[response.provider] || response.provider}
                  />
                ))}
              </div>
              <button
                className="model-nav-arrow"
                onClick={handleNext}
                aria-label="Next model"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <span className="model-name">
                {MODEL_NAMES[currentResponse.provider] || currentResponse.provider}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="no-reason-container">
          <p>
            {person.name} is trending today across multiple Wikipedia language
            editions. Check back later for a detailed summary.
          </p>
        </div>
      )}
      <Link
        href={`/${currentLang}/news?date=${today}`}
        className="view-news-button"
      >
        {t.trending.viewMoreTrending} →
      </Link>
    </div>
  );
}
