"use client";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {plural} from "pluralize";
import {micromark} from "micromark";
import {toTitleCase} from "/components/utils/vizHelpers";

function TrendingReasonSnippet({reason, reasonSummary}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reason && !reasonSummary) return null;

  // Use the pre-generated summary if available, otherwise fall back to first paragraph
  const snippetText = reasonSummary || (reason ? reason.split("\n\n")[0] : "");
  const hasFullReason = reason && reason.length > (reasonSummary?.length || 0);

  // Convert to HTML - summary is plain text, so minimal formatting needed
  const snippetHtml = reasonSummary ? `<p>${reasonSummary}</p>` : micromark(snippetText);
  const fullHtml = reason ? micromark(reason) : "";

  return (
    <div className="trending-reason">
      {isExpanded ? (
        <div className="trending-reason-full">
          <div dangerouslySetInnerHTML={{__html: fullHtml}} />
          <button
            className="trending-reason-toggle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            Show less
            <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 15 12 9 18 15"></polyline>
            </svg>
          </button>
        </div>
      ) : (
        <div className="trending-reason-snippet">
          <div dangerouslySetInnerHTML={{__html: snippetHtml}} />
          {hasFullReason && (
            <button
              className="trending-reason-toggle"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              Read more
              <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrendingSection({trendingCombos, locale, title}) {
  return (
    <section className="trending-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="trending-icon">🔥</span>
          {title}
        </h2>
        <div className="trending-grid">
          {trendingCombos.map((combo, index) => (
            <div key={`${combo.occupationSlug}-${combo.countrySlug}`} className="trending-card">
              <Link
                href={`/${locale}/profile/occupation/${combo.occupationSlug}/country/${combo.countrySlug}`}
                className="trending-card-link"
              >
                <div className="trending-card-header">
                  <span className="trending-rank">#{index + 1}</span>
                  <Image
                    src={`/images/icons/country/${combo.countrySlug}.svg`}
                    alt={combo.country}
                    width={28}
                    height={28}
                    className="trending-flag"
                  />
                  <span className="trending-text">
                    {combo.demonym}{" "}
                    {locale === "en" ? toTitleCase(plural(combo.occupation)) : combo.occupation}
                  </span>
                </div>
                <div className="trending-stats">
                  <span className="trending-count">{combo.numPeople?.toLocaleString(locale)} people</span>
                  {combo.trendScore && (
                    <span className="trending-score" title="Trend Score">
                      ↑ {Math.round(combo.trendScore)}
                    </span>
                  )}
                </div>
              </Link>
              <TrendingReasonSnippet reason={combo.reason} reasonSummary={combo.reasonSummary} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
