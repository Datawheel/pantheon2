"use client";

import {useState} from "react";
import Link from "next/link";
import SimpleTooltip from "/components/common/SimpleTooltip";
import PersonImage from "/components/utils/PersonImage";
import "./MonthlyEdition.css";

function formatViews(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

function anomalyTier(score) {
  if (score >= 500) return "hot";
  if (score >= 100) return "warm";
  return "cool";
}

function getViewLabels(year, monthNum) {
  const currentDate = new Date(Date.UTC(year, monthNum - 1, 1));
  const previousDate = new Date(Date.UTC(year, monthNum - 2, 1));

  return {
    previous: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    }).format(previousDate),
    current: new Intl.DateTimeFormat("en-US", {
      month: "long",
      timeZone: "UTC",
    }).format(currentDate),
  };
}

function withLocalePrefix(pathname, localePrefix) {
  if (!localePrefix || !pathname.startsWith("/")) return pathname;
  if (pathname === localePrefix || pathname.startsWith(`${localePrefix}/`)) {
    return pathname;
  }
  return `${localePrefix}${pathname}`;
}

function localizeEditorialHtml(html, localePrefix) {
  return html.replace(/href="(\/[^"]*)"/g, (match, href) => {
    return `href="${withLocalePrefix(href, localePrefix)}"`;
  });
}

export default function MonthlyEdition({edition, locale}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFallers, setShowFallers] = useState(false);
  const [visibleCount, setVisibleCount] = useState(50);

  const monthLabel =
    edition.month.charAt(0).toUpperCase() + edition.month.slice(1);
  const localePrefix = locale === "en" ? "" : `/${locale}`;
  const deceasedSlugs = new Set(edition.deceasedSlugs || []);
  const viewLabels = getViewLabels(edition.year, edition.monthNum);

  // Combine and filter table data
  const tableData = showFallers ? edition.fallers : edition.trends;
  const filtered = searchQuery
    ? tableData.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tableData;
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="monthly-edition">
      {/* Main Layout */}
      <div className="monthly-layout">
        {/* Sidebar */}
        <aside className="monthly-sidebar">
          <h2 className="monthly-sidebar-title">The Digital Curator</h2>
          <p className="monthly-sidebar-subtitle">Pantheon Monthly Archive</p>
          <ul className="monthly-sidebar-nav">
            <li>
              <a href="#big-story" className="active">
                <span className="nav-icon">&#10022;</span> The Big Story
              </a>
            </li>
            <li>
              <a href="#movers">
                <span className="nav-icon">&#8599;</span> Trending Now
              </a>
            </li>
            <li>
              <a href="#deep-dive">
                <span className="nav-icon">&#9783;</span> The Deep Dive
              </a>
            </li>
          </ul>
        </aside>

        {/* Content */}
        <main className="monthly-content">
          {/* Hero */}
          <section id="big-story" className="monthly-hero">
            <p className="monthly-hero-label">
              The Big Story &mdash; {monthLabel} {edition.year} Edition
            </p>
            <h1 className="monthly-hero-headline">{edition.headline}</h1>
            <div className="monthly-hero-image-wrap">
              {edition.heroImage && (
                <div className="image">
                  <img
                    src={edition.heroImage}
                    alt={`${monthLabel} ${edition.year} edition`}
                  />
                </div>
              )}
              <div className="monthly-hero-quote">
                &ldquo;{edition.subhead}&rdquo;
              </div>
            </div>
          </section>

          {/* Editorial */}
          <section className="monthly-editorial">
            <p
              className="monthly-editorial-intro"
              dangerouslySetInnerHTML={{
                __html: localizeEditorialHtml(
                  edition.editorial.intro,
                  localePrefix,
                ),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: localizeEditorialHtml(
                  edition.editorial.middle,
                  localePrefix,
                ),
              }}
            />
            <p
              dangerouslySetInnerHTML={{
                __html: localizeEditorialHtml(
                  edition.editorial.conclusion,
                  localePrefix,
                ),
              }}
            />
          </section>

          {/* Stats */}
          <div className="monthly-stats">
            <div className="monthly-stat">
              <span className="monthly-stat-label">
                {edition.stats.anomalyLabel}
              </span>
              <span className="monthly-stat-value">
                {edition.stats.anomalyScore} Ratio
              </span>
            </div>
            <div className="monthly-stat">
              <span className="monthly-stat-label">
                {edition.stats.globalVisibilityLabel}
              </span>
              <span className="monthly-stat-value">
                {edition.stats.globalVisibility} Diff
              </span>
            </div>
          </div>

          <hr className="monthly-divider" />

          {/* The Movers */}
          <section id="movers">
            <div className="monthly-section-header">
              <h2 className="monthly-section-title">The Movers</h2>
              <a href="#deep-dive" className="monthly-section-link">
                View All Trends
              </a>
            </div>

            {/* Row 1: Top Risers */}
            <h3 className="monthly-movers-row-label rising">Rising</h3>
            <div className="monthly-movers-grid">
              {edition.movers
                .filter(m => m.direction === "rising")
                .map(mover => (
                  <div key={mover.slug} className="monthly-mover-card">
                    <div className="monthly-mover-image">
                      <Link href={`${localePrefix}/profile/person/${mover.slug}`}>
                        <PersonImage
                          src={
                            mover.wpId
                              ? `/profile/people/${mover.wpId}.jpg`
                              : undefined
                          }
                          fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                          alt={mover.name}
                        />
                      </Link>
                      <span className="monthly-mover-badge rising">
                        &#8599; Rising
                      </span>
                    </div>
                    <div className="monthly-mover-name-row">
                      <span className="monthly-mover-name">{mover.name}</span>
                      <span className="monthly-mover-diff rising">
                        {mover.diffLabel}
                      </span>
                    </div>
                    <p className="monthly-mover-summary">{mover.summary}</p>
                    <span className="monthly-mover-meta">
                      Anomaly: {mover.score.toFixed(1)} / Rank #{mover.rank}
                    </span>
                  </div>
                ))}
            </div>

            {/* Row 2: Top Decreasers */}
            <h3 className="monthly-movers-row-label falling">Falling</h3>
            <div className="monthly-movers-grid">
              {edition.movers
                .filter(m => m.direction === "falling")
                .map(mover => (
                  <div key={mover.slug} className="monthly-mover-card">
                    <div className="monthly-mover-image">
                      <Link href={`${localePrefix}/profile/person/${mover.slug}`}>
                        <PersonImage
                          src={
                            mover.wpId
                              ? `/profile/people/${mover.wpId}.jpg`
                              : undefined
                          }
                          fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                          alt={mover.name}
                        />
                      </Link>
                      <span className="monthly-mover-badge falling">
                        &#8600; Falling
                      </span>
                    </div>
                    <div className="monthly-mover-name-row">
                      <span className="monthly-mover-name">{mover.name}</span>
                      <span className="monthly-mover-diff falling">
                        {mover.diffLabel}
                      </span>
                    </div>
                    <p className="monthly-mover-summary">{mover.summary}</p>
                    <span className="monthly-mover-meta">
                      Anomaly: {mover.score.toFixed(1)} / Rank #{mover.rank}
                    </span>
                  </div>
                ))}
            </div>
          </section>

          <hr className="monthly-divider" />

          {/* The Deep Dive */}
          <section id="deep-dive" className="monthly-deepdive">
            <div className="monthly-section-header">
              <h2 className="monthly-section-title">The Deep Dive</h2>
            </div>
            <p className="monthly-deepdive-description">
              Our comprehensive dataset of the top 200 anomalies filtered for
              institutional relevance and statistical significance.
            </p>

            <div className="monthly-deepdive-controls">
              <input
                type="text"
                className="monthly-deepdive-search"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button
                className={`monthly-deepdive-filter-btn ${!showFallers ? "active" : ""}`}
                onClick={() => {
                  setShowFallers(false);
                  setVisibleCount(50);
                }}
              >
                Risers
              </button>
              <button
                className={`monthly-deepdive-filter-btn ${showFallers ? "active" : ""}`}
                onClick={() => {
                  setShowFallers(true);
                  setVisibleCount(50);
                }}
              >
                Fallers
              </button>
            </div>

            <table className="monthly-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Person</th>
                  <th>{viewLabels.previous} Views</th>
                  <th>{viewLabels.current} Views</th>
                  <th className="align-right">Ratio</th>
                  <th className="align-right">
                    <SimpleTooltip
                      content="Anomaly score measures how unusual a page's traffic change is this month. It combines both the percentage change and the absolute difference in views—so big spikes and big drop-offs rank highest."
                      placement="top"
                    >
                      <span className="monthly-tooltip-trigger">
                        Anomaly Score
                      </span>
                    </SimpleTooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row, i) => (
                  <tr key={row.slug}>
                    <td>
                      <span className="monthly-table-rank">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="monthly-table-person">
                      <Link href={`${localePrefix}/profile/person/${row.slug}`}>
                        <span className="monthly-table-person-cell">
                          <PersonImage
                            src={
                              row.wpId
                                ? `/profile/people/${row.wpId}.jpg`
                                : undefined
                            }
                            fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                            alt={row.title}
                            className="monthly-table-avatar"
                          />
                          <span className="monthly-table-person-text">
                            <span className="monthly-table-person-name">
                              {row.title}
                              {deceasedSlugs.has(row.slug) && (
                                <SimpleTooltip
                                  content={`${row.title} passed away in ${monthLabel} ${edition.year}`}
                                  placement="top"
                                >
                                  <img
                                    src="/images/monthly/wreath.png"
                                    alt="Deceased"
                                    className="monthly-table-wreath"
                                  />
                                </SimpleTooltip>
                              )}
                            </span>
                            {row.description && (
                              <span className="monthly-table-person-description">
                                {row.description}
                              </span>
                            )}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="monthly-table-views">
                      {formatViews(row.prevViews)}
                    </td>
                    <td className="monthly-table-views">
                      {formatViews(row.latestViews)}
                    </td>
                    <td className="align-right">{row.ratio.toFixed(2)}x</td>
                    <td className="align-right">
                      <span
                        className={`monthly-anomaly-pill ${anomalyTier(row.anomalyScore)}`}
                      >
                        {row.anomalyScore.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleCount < filtered.length && (
              <div className="monthly-show-more">
                <button onClick={() => setVisibleCount(prev => prev + 20)}>
                  Show More
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
