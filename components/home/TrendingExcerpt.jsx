"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {getTranslations} from "/app/translations";
import {PUBLIC_API} from "@/app/constants";
import "./TrendingExcerpt.css";

export default function TrendingExcerpt({trendingPeople, currentLang, allBios = []}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [trendingReasons, setTrendingReasons] = useState({});
  const t = getTranslations(currentLang);

  // Get slugs of first 4 people in grid
  const firstRowSlugs = allBios.slice(0, 4).map(b => b.slug);

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
          `${PUBLIC_API}/trend_news?date=eq.${yesterday}&lang=eq.${currentLang}&slug=in.(${firstRowSlugs.join(",")})&select=slug,title,reason,llm_metadata`,
          {cache: "force-cache"}
        );
        const data = await response.json();

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

    if (firstRowSlugs.length > 0) {
      fetchTrendingReasons();
    }
  }, [currentLang, firstRowSlugs.join(",")]);

  // Merge trending people with their reasons from the current language
  const peopleWithReasons = trendingPeople
    .filter(person => firstRowSlugs.includes(person.slug))
    .map(person => ({
      ...person,
      trending_reason: trendingReasons[person.slug]?.trending_reason || person.trending_reason,
      llm_metadata: trendingReasons[person.slug]?.llm_metadata || person.llm_metadata,
      localized_name: trendingReasons[person.slug]?.localized_name || person.localized_name,
    }))
    .filter(person => person.trending_reason && person.trending_reason.trim().length > 0);

  useEffect(() => {
    if (peopleWithReasons.length === 0) return;

    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);

      // After fade out completes, change content and fade in
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % peopleWithReasons.length);
        setIsVisible(true);
      }, 500); // Match CSS transition duration
    }, 10000); // Rotate every 10 seconds

    return () => clearInterval(interval);
  }, [peopleWithReasons.length]);

  if (peopleWithReasons.length === 0) {
    return null;
  }

  const currentPerson = peopleWithReasons[currentIndex];

  // Find this person's position in the first row (first 4 people)
  const firstRowBios = allBios.slice(0, 4);
  const columnPosition = firstRowBios.findIndex(b => b.slug === currentPerson.slug);
  // If not in first row, default to position 0
  const arrowPosition = columnPosition >= 0 ? columnPosition : 0;

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

  return (
    <div className={`trending-excerpt-container ${isVisible ? "visible" : ""}`}>
      <div className="trending-excerpt-bubble" data-grid-position={arrowPosition}>
        <div className="trending-excerpt-header">
          <strong>
            <Link href={`/profile/person/${currentPerson.slug}`} className="excerpt-person-link">
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
        {peopleWithReasons.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsVisible(true);
              }, 500);
            }}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
