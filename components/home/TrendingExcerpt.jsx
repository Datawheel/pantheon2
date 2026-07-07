"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import {getTranslations} from "@/app/translations";
import {DEFAULT_LOCALE} from "@/app/locales";
import "./TrendingExcerpt.css";

const ROW_COLORS = [
  "var(--colorAqua)",
  "var(--colorSports)",
  "var(--colorArts)",
  "var(--colorExploration)",
];

export default function TrendingExcerpt({
  trendingPeople,
  currentLang,
  allBios = [],
  onActivePersonChange,
}) {
  const localePrefix = currentLang === DEFAULT_LOCALE ? "" : `/${currentLang}`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [cycleVersion, setCycleVersion] = useState(0);
  const manualTransitionTimeout = useRef(null);
  const t = getTranslations(currentLang);

  // Keep the carousel in the same rank order as the complete visible grid.
  const displayedBios = allBios.slice(0, 16);

  // Reasons are fetched and localized by the homepage server component. Merge
  // that payload into grid order without a duplicate cross-origin browser call.
  const providedReasons = new Map(
    trendingPeople.map(person => [person.slug, person]),
  );
  const peopleWithReasons = displayedBios
    .map(person => {
      const provided = providedReasons.get(person.slug) || {};
      return {
        ...person,
        ...provided,
        trending_reason:
          provided.trending_reason || person.trending_reason,
        llm_metadata:
          provided.llm_metadata || person.llm_metadata,
        localized_name:
          provided.localized_name || person.localized_name,
      };
    })
    .filter(person => person.trending_reason && person.trending_reason.trim().length > 0);

  useEffect(() => () => clearTimeout(manualTransitionTimeout.current), []);

  useEffect(() => {
    if (peopleWithReasons.length === 0) return;

    let transitionTimeout;
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // After fade out completes, change content and fade in
      transitionTimeout = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % peopleWithReasons.length);
        setIsVisible(true);
      }, 500); // Match CSS transition duration
    }, 10000); // Rotate every 10 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(transitionTimeout);
    };
  }, [peopleWithReasons.length, cycleVersion]);

  const safeCurrentIndex = peopleWithReasons.length > 0
    ? currentIndex % peopleWithReasons.length
    : 0;
  const currentPerson = peopleWithReasons[safeCurrentIndex] || null;
  const currentPersonSlug = currentPerson?.slug || null;

  // Move the excerpt directly below the active profile's row and point its
  // arrow toward that profile's column. The row changes while faded out.
  const gridPosition = currentPerson
    ? displayedBios.findIndex(b => b.slug === currentPerson.slug)
    : -1;
  const arrowPosition = gridPosition >= 0 ? gridPosition % 4 : 0;
  const activeProfileRow = gridPosition >= 0 ? Math.floor(gridPosition / 4) : 0;
  const excerptGridRow = activeProfileRow + 2;
  const activeRowColor = ROW_COLORS[activeProfileRow % ROW_COLORS.length];

  useEffect(() => {
    onActivePersonChange?.(currentPersonSlug
      ? {slug: currentPersonSlug, color: activeRowColor}
      : null);
  }, [activeRowColor, currentPersonSlug, onActivePersonChange]);

  if (!currentPerson) {
    return null;
  }

  // Truncate reason to ~150 characters for excerpt
  const truncateExcerpt = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;

    // Find the last space before maxLength to avoid cutting words
    const truncated = text.substr(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return lastSpace > 0 ? truncated.substr(0, lastSpace) + "..." : truncated + "...";
  };

  const excerpt = truncateExcerpt(currentPerson.trending_reason);

  // Get today's date for news link
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const selectStory = index => {
    clearTimeout(manualTransitionTimeout.current);
    setCycleVersion(version => version + 1);
    setIsVisible(false);
    manualTransitionTimeout.current = setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 500);
  };

  return (
    <li className="grid-excerpt-item" style={{gridRow: excerptGridRow}}>
      <div className={`trending-excerpt-container ${isVisible ? "visible" : ""}`}>
        <div
          className="trending-excerpt-bubble"
          data-grid-position={arrowPosition}
          style={{"--excerpt-color": activeRowColor}}
        >
          <div className="trending-excerpt-header">
            <strong>
              <Link href={`${localePrefix}/profile/person/${currentPerson.slug}`} className="excerpt-person-link">
                {currentPerson.localized_name || currentPerson.title || currentPerson.name}
              </Link>
            </strong>
            {" "}{t.home.isTrending}
          </div>
          <p className="trending-excerpt-text">{excerpt}</p>
          <Link
            href={`/${currentLang}/news?date=${today}#${currentPerson.slug}`}
            className="trending-excerpt-link"
          >
            {t.home.readFullStory} →
          </Link>
        </div>
        <div className="trending-excerpt-pagination">
          {peopleWithReasons.map((person, index) => {
            const personGridPosition = displayedBios.findIndex(
              bio => bio.slug === person.slug,
            );
            const personRow = personGridPosition >= 0
              ? Math.floor(personGridPosition / 4)
              : 0;
            return (
              <button
                key={person.slug}
                className={`pagination-dot ${index === safeCurrentIndex ? "active" : ""}`}
                style={{"--pagination-color": ROW_COLORS[personRow % ROW_COLORS.length]}}
                onClick={() => selectStory(index)}
                aria-label={`Go to ${person.localized_name || person.title || person.name}'s story (${index + 1} of ${peopleWithReasons.length})`}
              />
            );
          })}
        </div>
      </div>
    </li>
  );
}
