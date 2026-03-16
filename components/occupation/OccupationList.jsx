"use client";

import {useState, useMemo} from "react";
import Link from "next/link";

export default function OccupationList({occupations, localePrefix, locale, labels}) {
  const [sortBy, setSortBy] = useState("people");

  const sorted = useMemo(() => {
    if (sortBy === "alpha") {
      return [...occupations].sort((a, b) =>
        a.localName.localeCompare(b.localName, locale),
      );
    }
    return [...occupations].sort((a, b) => (b.num_born || 0) - (a.num_born || 0));
  }, [occupations, sortBy, locale]);

  return (
    <>
      <div className="so-list-header">
        <h2 className="so-section-title">{labels.occupationList}</h2>
        <div className="so-sort-controls">
          <button
            className={`so-sort-btn ${sortBy === "alpha" ? "so-sort-btn-active" : ""}`}
            onClick={() => setSortBy("alpha")}
          >
            {labels.sortAlpha}
          </button>
          <button
            className={`so-sort-btn ${sortBy === "people" ? "so-sort-btn-active" : ""}`}
            onClick={() => setSortBy("people")}
          >
            {labels.sortPeople}
          </button>
        </div>
      </div>
      <div className="so-grid">
        {sorted.map(occ => (
          <Link
            key={occ.occupation_slug}
            href={`${localePrefix}/profile/occupation/${occ.occupation_slug}`}
            className="so-card"
          >
            <div
              className="so-card-image"
              style={{
                backgroundImage: `url(https://static.pantheon.world/profile/occupation/${occ.occupation_slug}.jpg)`,
              }}
            />
            <div className="so-card-body">
              <span className="so-card-name">{occ.localName}</span>
              <span className="so-card-count">
                {(occ.num_born || 0).toLocaleString(locale)} {labels.people}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
