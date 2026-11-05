"use client";

import {Fragment, useState} from "react";
import Link from "next/link";
import SimpleTooltip from "@/components/common/SimpleTooltip";
import PersonImage from "@/components/utils/PersonImage";
import "./MonthlyEdition.css";

function formatViews(n) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

const NEW_PEOPLE_PAGE = 12;

function formatYear(year) {
  if (year === null || year === undefined) return "";
  return year < 0 ? `${Math.abs(year)} BC` : String(year);
}

function formatLifespan(person) {
  const born = formatYear(person.birthyear);
  if (person.deathyear !== null && person.deathyear !== undefined) {
    return `${born}–${formatYear(person.deathyear)}`;
  }
  return born ? `b. ${born}` : "";
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
  const [newPeopleCount, setNewPeopleCount] = useState(NEW_PEOPLE_PAGE);
  const newPeople = edition.newPeople || [];
  // Newer editions split the editorial into headed sections; older ones are
  // three plain paragraphs (intro / middle / conclusion).
  const editorialSections = edition.editorial.sections || [
    {
      paragraphs: [
        edition.editorial.intro,
        edition.editorial.middle,
        edition.editorial.conclusion,
      ],
    },
  ];

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
            {newPeople.length > 0 && (
              <li>
                <a href="#new-to-pantheon">
                  <span className="nav-icon">&#10010;</span> New to Pantheon
                </a>
              </li>
            )}
            <li>
              <a href="#deep-dive">
                <span className="nav-icon">&#9783;</span> The Deep Dive
              </a>
            </li>
          </ul>

          {edition.archive && edition.archive.length > 1 && (
            <>
              <p className="monthly-sidebar-archive-heading">Past Editions</p>
              <ul className="monthly-sidebar-archive">
                {[...edition.archive]
                  .reverse()
                  .map(item => {
                    const isCurrent =
                      item.year === edition.year && item.month === edition.month;
                    return (
                      <li key={`${item.year}-${item.month}`}>
                        {isCurrent ? (
                          <span className="monthly-sidebar-archive-current">
                            {item.label}
                          </span>
                        ) : (
                          <Link
                            href={`${localePrefix}/monthly/${item.year}/${item.month}`}
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
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
            {editorialSections.map((section, sectionIndex) => (
              <Fragment key={section.heading || sectionIndex}>
                {section.heading && (
                  <h3 className="monthly-editorial-heading">
                    {section.heading}
                  </h3>
                )}
                {section.paragraphs.map((html, paragraphIndex) => (
                  <p
                    key={paragraphIndex}
                    className={
                      sectionIndex === 0 && paragraphIndex === 0
                        ? "monthly-editorial-intro"
                        : undefined
                    }
                    dangerouslySetInnerHTML={{
                      __html: localizeEditorialHtml(html, localePrefix),
                    }}
                  />
                ))}
              </Fragment>
            ))}
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
                          person={mover}
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
                          person={mover}
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

          {/* New to Pantheon: people added during the edition month */}
          {newPeople.length > 0 && (
            <>
              <section id="new-to-pantheon" className="monthly-newcomers">
                <div className="monthly-section-header">
                  <h2 className="monthly-section-title">
                    New to Pantheon this month
                  </h2>
                  <a
                    href={`${localePrefix}/profile/recently-added`}
                    className="monthly-section-link"
                  >
                    Recently Added
                  </a>
                </div>
                {edition.newPeopleIntro?.length > 0 && (
                  <div className="monthly-editorial monthly-newcomers-story">
                    {edition.newPeopleIntro.map((html, index) => (
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{
                          __html: localizeEditorialHtml(html, localePrefix),
                        }}
                      />
                    ))}
                  </div>
                )}
                <p className="monthly-newcomers-note">
                  {newPeople.length} people joined Pantheon this month after
                  their Wikidata entries reached 15 sitelinks, our threshold
                  for inclusion. They are ordered by sitelinks; the figure on
                  each card is the number of Wikipedia language editions with
                  an article about them.
                </p>
                <ol className="monthly-newcomers-grid">
                  {newPeople.slice(0, newPeopleCount).map(person => (
                    <li key={person.slug} className="monthly-newcomer">
                      <Link
                        href={`${localePrefix}/profile/person/${person.slug}`}
                        className="monthly-newcomer-link"
                      >
                        <PersonImage
                          person={person}
                          src={person.id ? `/profile/people/${person.id}.jpg` : undefined}
                          fallbackSrc="https://static.pantheon.world/icons/icon-person.svg"
                          alt={person.name}
                          className="monthly-newcomer-avatar"
                        />
                        <span className="monthly-newcomer-text">
                          <span className="monthly-newcomer-name">{person.name}</span>
                          <span className="monthly-newcomer-meta">
                            {[person.occupation, formatLifespan(person)]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                          <span className="monthly-newcomer-langs">
                            {person.languages} languages
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                {newPeopleCount < newPeople.length && (
                  <div className="monthly-show-more">
                    <button
                      onClick={() =>
                        setNewPeopleCount(prev => prev + NEW_PEOPLE_PAGE * 4)
                      }
                    >
                      Show More ({newPeople.length - newPeopleCount} more)
                    </button>
                  </div>
                )}
              </section>

              <hr className="monthly-divider" />
            </>
          )}

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
                            person={row}
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
