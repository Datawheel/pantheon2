"use client";

import {useState, useMemo} from "react";
import Link from "next/link";

export default function CountryList({countries, localePrefix, locale, labels}) {
  const [sortBy, setSortBy] = useState("alpha");

  const sorted = useMemo(() => {
    if (sortBy === "people") {
      return [...countries].sort((a, b) => (b.num_born || 0) - (a.num_born || 0));
    }
    return [...countries].sort((a, b) =>
      a.localName.localeCompare(b.localName, locale),
    );
  }, [countries, sortBy, locale]);

  return (
    <>
      <div className="sc-list-header">
        <h2 className="sc-section-title">{labels.countryList}</h2>
        <div className="sc-sort-controls">
          <button
            className={`sc-sort-btn ${sortBy === "alpha" ? "sc-sort-btn-active" : ""}`}
            onClick={() => setSortBy("alpha")}
          >
            {labels.sortAlpha}
          </button>
          <button
            className={`sc-sort-btn ${sortBy === "people" ? "sc-sort-btn-active" : ""}`}
            onClick={() => setSortBy("people")}
          >
            {labels.sortPeople}
          </button>
        </div>
      </div>
      <div className="sc-country-grid">
        {sorted.map(country => (
          <Link
            key={country.slug}
            href={`${localePrefix}/profile/country/${country.slug}`}
            className="sc-country-item"
          >
            <img
              className="sc-country-flag"
              src={`/images/icons/country/${country.slug}.svg`}
              alt=""
              loading="lazy"
            />
            <div className="sc-country-info">
              <span className="sc-country-name">{country.localName}</span>
              <span className="sc-country-count">
                {(country.num_born || 0).toLocaleString(locale)} {labels.people}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
