"use client";

import {useState} from "react";

const EXCERPT_LENGTH = 140;

function truncateText(text, maxLength = EXCERPT_LENGTH) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace <= 0) return `${trimmed.slice(0, maxLength)}...`;
  return `${trimmed.slice(0, lastSpace)}...`;
}

export default function TrendingReasonToggle({
  reason,
  readMoreLabel = "Read more",
  showLessLabel = "Show less",
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reason) return null;

  const excerpt = truncateText(reason);
  const hasFullReason = excerpt !== reason;

  if (!hasFullReason) {
    return (
      <div className="trending-reason">
        <p>{reason}</p>
      </div>
    );
  }

  return (
    <div className="trending-reason">
      {isExpanded ? (
        <div className="trending-reason-full">
          <p>{reason}</p>
          <button
            type="button"
            className="trending-reason-toggle"
            aria-expanded="true"
            onClick={() => setIsExpanded(false)}
          >
            {showLessLabel}
            <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 15 12 9 18 15"></polyline>
            </svg>
          </button>
        </div>
      ) : (
        <div className="trending-reason-snippet">
          <p>{excerpt}</p>
          <button
            type="button"
            className="trending-reason-toggle"
            aria-expanded="false"
            onClick={() => setIsExpanded(true)}
          >
            {readMoreLabel}
            <svg className="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
