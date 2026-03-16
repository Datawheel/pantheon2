"use client";

import {useState, useMemo} from "react";
import Link from "next/link";

export default function PlaceList({places, localePrefix, locale, labels}) {
  const [sortBy, setSortBy] = useState("people");
  const [grouped, setGrouped] = useState(true);

  // Flat sorted list
  const sorted = useMemo(() => {
    if (sortBy === "alpha") {
      return [...places].sort((a, b) =>
        a.place.localeCompare(b.place, locale),
      );
    }
    return [...places].sort((a, b) => (b.num_born || 0) - (a.num_born || 0));
  }, [places, sortBy, locale]);

  // Grouped by country
  const countryGroups = useMemo(() => {
    const map = new Map();
    for (const place of places) {
      const key = place.country?.slug || "_unknown";
      if (!map.has(key)) {
        map.set(key, {
          slug: place.country?.slug,
          country: place.country?.country || "Unknown",
          totalBorn: 0,
          places: [],
        });
      }
      const group = map.get(key);
      group.totalBorn += place.num_born || 0;
      group.places.push(place);
    }

    // Sort places within each group by num_born desc
    for (const group of map.values()) {
      group.places.sort((a, b) => (b.num_born || 0) - (a.num_born || 0));
    }

    const groups = [...map.values()];
    if (sortBy === "alpha") {
      groups.sort((a, b) => a.country.localeCompare(b.country, locale));
    } else {
      groups.sort((a, b) => b.totalBorn - a.totalBorn);
    }
    return groups;
  }, [places, sortBy, locale]);

  const toggleGrouped = () => setGrouped(g => !g);

  return (
    <>
      <div className="sp-list-header">
        <h2 className="sp-section-title">{labels.placeList}</h2>
        <div className="sp-list-controls">
          <button
            className={`sp-sort-btn ${grouped ? "sp-sort-btn-active" : ""}`}
            onClick={toggleGrouped}
          >
            {labels.groupByCountry}
          </button>
          <div className="sp-sort-controls">
            <button
              className={`sp-sort-btn ${sortBy === "alpha" ? "sp-sort-btn-active" : ""}`}
              onClick={() => setSortBy("alpha")}
            >
              {labels.sortAlpha}
            </button>
            <button
              className={`sp-sort-btn ${sortBy === "people" ? "sp-sort-btn-active" : ""}`}
              onClick={() => setSortBy("people")}
            >
              {labels.sortPeople}
            </button>
          </div>
        </div>
      </div>

      {grouped ? (
        <div className="sp-country-groups">
          {countryGroups.map(group => (
            <div key={group.slug || group.country} className="sp-country-group">
              <div className="sp-country-group-header">
                {group.slug && (
                  <img
                    className="sp-place-flag sp-place-flag-lg"
                    src={`/images/icons/country/${group.slug}.svg`}
                    alt=""
                  />
                )}
                <Link
                  href={`${localePrefix}/profile/country/${group.slug}`}
                  className="sp-country-group-name"
                >
                  {group.country}
                </Link>
                <span className="sp-country-group-count">
                  {group.totalBorn.toLocaleString(locale)} {labels.people}
                </span>
              </div>
              <div className="sp-place-grid">
                {group.places.map(place => (
                  <Link
                    key={place.id}
                    href={`${localePrefix}/profile/place/${place.slug}`}
                    className="sp-place-item"
                  >
                    <div className="sp-place-info">
                      <span className="sp-place-name">{place.place}</span>
                    </div>
                    <span className="sp-place-count">
                      {(place.num_born || 0).toLocaleString(locale)} {labels.people}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="sp-place-grid">
          {sorted.map(place => (
            <Link
              key={place.id}
              href={`${localePrefix}/profile/place/${place.slug}`}
              className="sp-place-item"
            >
              {place.country?.slug && (
                <img
                  className="sp-place-flag"
                  src={`/images/icons/country/${place.country.slug}.svg`}
                  alt=""
                  loading="lazy"
                />
              )}
              <div className="sp-place-info">
                <span className="sp-place-name">{place.place}</span>
                <span className="sp-place-country">{place.country?.country}</span>
              </div>
              <span className="sp-place-count">
                {(place.num_born || 0).toLocaleString(locale)} {labels.people}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
