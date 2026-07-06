"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import {getTranslations} from "@/app/translations";
import {PUBLIC_API} from "@/app/constants";
import {DEFAULT_LOCALE} from "@/app/locales";
import {encodePostgrestQuotedList} from "@/app/utils/postgrest";
import "./TrendingExcerpt.css";

export default function TrendingExcerpt({trendingPeople, currentLang, allBios = []}) {
  const localePrefix = currentLang === DEFAULT_LOCALE ? "" : `/${currentLang}`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [trendingReasons, setTrendingReasons] = useState({});
  const [cycleVersion, setCycleVersion] = useState(0);
  const manualTransitionTimeout = useRef(null);
  const t = getTranslations(currentLang);

  // Keep the carousel in the same rank order as the complete visible grid.
  const displayedBios = allBios.slice(0, 16);
  const displayedSlugs = displayedBios.map(b => b.slug).filter(Boolean);
  const displayedSlugsKey = encodePostgrestQuotedList(displayedSlugs);

  // Fetch trending reasons for the current language
  useEffect(() => {
    async function fetchTrendingReasons() {
      // Calculate yesterday's date (same logic as server)
      const now = new Date();
      const easternNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Godthab"}));
      easternNow.setDate(easternNow.getDate() - 1);
      const yesterday = `${easternNow.getFullYear()}-${String(easternNow.getMonth() + 1).padStart(2, "0")}-${String(easternNow.getDate()).padStart(2, "0")}`;

      try {
        const response = await fetch(
          `${PUBLIC_API}/trend_news?date=eq.${yesterday}&lang=eq.${currentLang}&slug=in.(${displayedSlugsKey})&select=slug,title,reason,llm_metadata`,
          {cache: "force-cache"}
        );
        if (!response.ok) {
          throw new Error(`Trending reasons request failed: HTTP ${response.status}`);
        }
        const json = await response.json();
        const data = Array.isArray(json) ? json : [];

        // Build a map of slug -> reason data
        const reasonsMap = data.reduce((acc, item) => {
          acc[item.slug] = {
            trending_reason: item.reason || "",
            llm_metadata: item.llm_metadata,
            localized_name: item.title || "",
          };
          return acc;
        }, {});

        setTrendingReasons(reasonsMap);
      } catch (error) {
        console.error("Error fetching trending reasons:", error);
        setTrendingReasons({});
      }
    }

    if (displayedSlugsKey) {
      fetchTrendingReasons();
    }
  }, [currentLang, displayedSlugsKey]);

  // Merge server-provided reasons and the client refresh into grid order. Only
  // profiles with an actual reason become carousel stories.
  const providedReasons = new Map(
    trendingPeople.map(person => [person.slug, person]),
  );
  const peopleWithReasons = displayedBios
    .map(person => {
      const provided = providedReasons.get(person.slug) || {};
      const refreshed = trendingReasons[person.slug] || {};
      return {
        ...person,
        ...provided,
        trending_reason:
          refreshed.trending_reason || provided.trending_reason || person.trending_reason,
        llm_metadata:
          refreshed.llm_metadata || provided.llm_metadata || person.llm_metadata,
        localized_name:
          refreshed.localized_name || provided.localized_name || person.localized_name,
      };
    })
    .filter(person => person.trending_reason && person.trending_reason.trim().length > 0);

  useEffect(() => {
    setCurrentIndex(index => index < peopleWithReasons.length ? index : 0);
  }, [peopleWithReasons.length]);

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

  if (peopleWithReasons.length === 0) {
    return null;
  }

  const safeCurrentIndex = currentIndex % peopleWithReasons.length;
  const currentPerson = peopleWithReasons[safeCurrentIndex];

  // Move the excerpt directly below the active profile's row and point its
  // arrow toward that profile's column. The row changes while faded out.
  const gridPosition = displayedBios.findIndex(b => b.slug === currentPerson.slug);
  const arrowPosition = gridPosition >= 0 ? gridPosition % 4 : 0;
  const excerptGridRow = gridPosition >= 0 ? Math.floor(gridPosition / 4) + 2 : 2;

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
        <div className="trending-excerpt-bubble" data-grid-position={arrowPosition}>
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
          {peopleWithReasons.map((person, index) => (
            <button
              key={person.slug}
              className={`pagination-dot ${index === safeCurrentIndex ? "active" : ""}`}
              onClick={() => selectStory(index)}
              aria-label={`Go to ${person.localized_name || person.title || person.name}'s story (${index + 1} of ${peopleWithReasons.length})`}
            />
          ))}
        </div>
      </div>
    </li>
  );
}
