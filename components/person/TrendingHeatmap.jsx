"use client";

import {useEffect, useState, useRef, useCallback} from "react";
import SectionLayout from "../common/SectionLayout";
import {getTranslations} from "@/app/translations";
import "./TrendingHeatmap.css";

const REASON_HOVER_LIMIT = 80;

// Localized single-letter labels for Mon/Wed/Fri/Sun rows and short month
// names, derived from Intl so every supported locale works without a table.
function getDayLabels(lang) {
  const fmt = new Intl.DateTimeFormat(lang, {weekday: "narrow"});
  // 2024-01-01 is a Monday; offsets pick Mon, Wed, Fri, Sun.
  const narrow = offset => fmt.format(new Date(2024, 0, 1 + offset));
  return [narrow(0), "", narrow(2), "", narrow(4), "", narrow(6)];
}

function getMonthName(monthIndex, lang) {
  return new Intl.DateTimeFormat(lang, {month: "short"}).format(
    new Date(2024, monthIndex, 1),
  );
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeeksForYear(year) {
  const today = todayStr();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  const startDay = start.getDay();
  const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
  const gridStart = new Date(start);
  gridStart.setDate(gridStart.getDate() + mondayOffset);

  const weeks = [];
  const current = new Date(gridStart);

  while (current <= end || current.getDay() !== 1) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
      const inYear = current.getFullYear() === year;
      const inFuture = dateStr > today;
      week.push({date: dateStr, inYear, inFuture, dayOfWeek: d});
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (current > end && current.getDay() === 1) break;
  }

  return weeks;
}

function getMonthLabels(weeks, year, lang) {
  const labels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIdx) => {
    const monday = week[0];
    if (!monday.inYear) return;
    const month = parseInt(monday.date.split("-")[1], 10) - 1;
    if (month !== lastMonth) {
      labels.push({month, weekIdx, label: getMonthName(month, lang)});
      lastMonth = month;
    }
  });
  return labels;
}

function getCellColor(rank) {
  if (!rank) return null;
  if (rank <= 1) return "var(--heatmap-5, #6b4e00)";
  if (rank <= 3) return "var(--heatmap-4, #86640e)";
  if (rank <= 5) return "var(--heatmap-3, #a07920)";
  if (rank <= 8) return "var(--heatmap-2, #b8923a)";
  return "var(--heatmap-1, #c8a96e)";
}

function formatDateLabel(dateStr, lang = "en") {
  const [y, m, d] = dateStr.split("-");
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString(lang, {weekday: "short", month: "short", day: "numeric", year: "numeric"});
}

function truncateReason(reason) {
  if (!reason || reason.length <= REASON_HOVER_LIMIT) return reason;
  return reason.slice(0, REASON_HOVER_LIMIT).replace(/\s+\S*$/, "") + "...";
}

function YearGrid({year, weeks, trendMap, onHover, onLeave, onClick, lang = "en"}) {
  const monthLabels = getMonthLabels(weeks, year, lang);
  const today = todayStr();

  return (
    <div className="heatmap-year">
      <div className="heatmap-year-col">
        <div className="heatmap-year-label">{year}</div>
        <div className="heatmap-day-labels">
          {getDayLabels(lang).map((label, i) => (
            <span key={i} className="heatmap-day-label">{label}</span>
          ))}
        </div>
      </div>
      <div className="heatmap-grid-container">
        <div className="heatmap-month-labels" style={{gridTemplateColumns: `repeat(${weeks.length}, 14px)`}}>
          {monthLabels.map(({label, weekIdx}) => (
            <span
              key={`${year}-${label}`}
              className="heatmap-month-label"
              style={{gridColumn: weekIdx + 1}}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="heatmap-grid" style={{gridTemplateColumns: `repeat(${weeks.length}, 14px)`}}>
          {weeks.map((week, weekIdx) =>
            week.map((cell, dayIdx) => {
                if (!cell) return <span key={`${weekIdx}-${dayIdx}`} className="heatmap-cell heatmap-outside" />;

                const isOutside = !cell.inYear || cell.inFuture;
                if (isOutside) {
                  return <span key={`${weekIdx}-${dayIdx}`} className="heatmap-cell heatmap-outside" />;
                }

                const entry = trendMap[cell.date];
                const rank = entry?.rank;
                const color = getCellColor(rank);
                const isToday = cell.date === today;
                const hasReason = !!entry?.reason;

                return (
                  <span
                    key={`${weekIdx}-${dayIdx}`}
                    className={`heatmap-cell${isToday ? " heatmap-today" : ""}${rank ? " heatmap-active" : ""}${hasReason ? " heatmap-clickable" : ""}`}
                    style={color ? {backgroundColor: color} : undefined}
                    onMouseEnter={e => onHover(e, cell.date, entry)}
                    onMouseLeave={onLeave}
                    onClick={hasReason ? () => onClick(cell.date, entry) : undefined}
                  />
                );
              }),
            )}
          </div>
      </div>
    </div>
  );
}

export default function TrendingHeatmap({personSlug, lang = "en", title, slug: sectionSlug}) {
  const t = getTranslations(lang);
  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    fetch(`/api/trendingHistory?slug=${encodeURIComponent(personSlug)}&lang=${encodeURIComponent(lang)}`)
      .then(r => r.json())
      .then(data => {
        setTrendData(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTrendData([]);
        setLoading(false);
      });
  }, [personSlug, lang]);

  const handleHover = useCallback((e, date, entry) => {
    const label = formatDateLabel(date, lang);
    const rank = entry?.rank;
    let text = rank
      ? `${label} — ${t.person.heatmap.rankNum({rank})}`
      : `${label} — ${t.person.heatmap.notTrending}`;
    if (entry?.reason) {
      text += `\n${truncateReason(entry.reason)}`;
    }
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      text,
      hasRank: !!rank,
      hasReason: !!entry?.reason,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }, [lang, t]);

  const handleLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleClick = useCallback((date, entry) => {
    // Trending data is from the day before, so news page needs date + 1
    const [y, m, d] = date.split("-").map(Number);
    const next = new Date(y, m - 1, d + 1);
    const nextDate = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
    setDetail(prev => prev?.date === date ? null : {
      date,
      nextDate,
      rank: entry.rank,
      reason: entry.reason,
      label: formatDateLabel(date, lang),
    });
  }, [lang]);

  const closeDetail = useCallback(() => {
    setDetail(null);
  }, []);

  if (loading) return null;
  if (!trendData || trendData.length === 0) return null;

  // Build a map of date -> {rank, reason}
  const trendMap = {};
  trendData.forEach(({date, rank_pantheon, reason}) => {
    trendMap[date] = {rank: rank_pantheon, reason: reason || null};
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const prevYear = currentYear - 1;

  const currentWeeks = getWeeksForYear(currentYear);
  const prevWeeks = getWeeksForYear(prevYear);

  const totalDays = trendData.length;

  return (
    <SectionLayout slug={sectionSlug} title={title}>
      <div className="trending-heatmap">
        <div className="heatmap-header">
          <span className="heatmap-summary">
            {t.person.heatmap.trendingDays({count: totalDays})}
          </span>
        </div>
        <YearGrid year={currentYear} weeks={currentWeeks} trendMap={trendMap} onHover={handleHover} onLeave={handleLeave} onClick={handleClick} lang={lang} />
        <YearGrid year={prevYear} weeks={prevWeeks} trendMap={trendMap} onHover={handleHover} onLeave={handleLeave} onClick={handleClick} lang={lang} />
        <div className="heatmap-legend">
          <span className="heatmap-legend-label">{t.person.heatmap.less}</span>
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-0, #ebedf0)"}} />
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-1, #c8a96e)"}} />
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-2, #b8923a)"}} />
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-3, #a07920)"}} />
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-4, #86640e)"}} />
          <span className="heatmap-cell heatmap-legend-cell" style={{backgroundColor: "var(--heatmap-5, #6b4e00)"}} />
          <span className="heatmap-legend-label">{t.person.heatmap.more}</span>
        </div>

        {/* Hover tooltip */}
        {tooltip && (
          <div
            className={`heatmap-tooltip${tooltip.hasRank ? " heatmap-tooltip-active" : ""}`}
            style={{
              position: "fixed",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            {tooltip.text.split("\n").map((line, i) => (
              <div key={i} className={i > 0 ? "heatmap-tooltip-reason" : ""}>{line}</div>
            ))}
            {tooltip.hasReason && (
              <div className="heatmap-tooltip-hint">
                {t.person.heatmap.clickForDetails}
              </div>
            )}
          </div>
        )}

        {/* Detail panel */}
        {detail && (
          <div className="heatmap-detail">
            <div className="heatmap-detail-header">
              <div className="heatmap-detail-date">
                <span className="heatmap-detail-label">{detail.label}</span>
                <span className="heatmap-detail-rank">
                  {t.person.heatmap.rankNum({rank: detail.rank})}
                </span>
              </div>
              <button className="heatmap-detail-close" onClick={closeDetail} type="button">&times;</button>
            </div>
            <p className="heatmap-detail-reason">{detail.reason}</p>
            <a
              href={`/${lang}/news?date=${detail.nextDate}`}
              className="heatmap-detail-link"
            >
              {t.person.heatmap.viewAllTrendingNews({date: detail.label})} &rarr;
            </a>
          </div>
        )}
      </div>
    </SectionLayout>
  );
}
