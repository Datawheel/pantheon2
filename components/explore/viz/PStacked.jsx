"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {initEChart} from "@/components/utils/echarts";
import {
  formatExploreNumber,
  formatExploreYear,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {
  buildExploreRows,
  buildTimeSeries,
  escapeHtml,
  setupResize,
} from "./echartsData";

const CAL_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
  'stroke="#9b958c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/>' +
  '<path d="M3 9.5h18"/><path d="M8 2.5v4"/><path d="M16 2.5v4"/></svg>';

export default function PStacked({
  data,
  occupations,
  show,
  yearType,
  years,
  scale,
  binCount,
  percent = false,
  locale,
}) {
  const t = useMemo(() => getExploreTranslations(locale), [locale]);
  const chartRef = useRef(null);
  const echartRef = useRef(null);
  const focalRef = useRef(-1);
  const soloRef = useRef(new Set());
  // Soloed domains: empty = all visible; otherwise only these are shown.
  const [soloDomains, setSoloDomains] = useState(() => new Set());

  const timeSeries = useMemo(() => {
    const {rows, levels} = buildExploreRows(
      data,
      occupations,
      show,
      yearType,
      locale,
    );
    return buildTimeSeries(rows, levels, yearType, {
      yearRange: years,
      scale,
      binCount,
      percent,
    });
  }, [data, occupations, show, yearType, years, scale, binCount, percent, locale]);

  // Effective solo set: ignore any soloed domains that no longer exist after a
  // data/legend change (empty = all visible). Mirror it to a ref for handlers.
  const legendNames = useMemo(
    () => new Set(timeSeries.legendItems.map(item => item.name)),
    [timeSeries]
  );
  const effectiveSolo = useMemo(() => {
    if (soloDomains.size === 0) return soloDomains;
    return new Set([...soloDomains].filter(name => legendNames.has(name)));
  }, [soloDomains, legendNames]);

  useEffect(() => {
    soloRef.current = effectiveSolo;
  }, [effectiveSolo]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !timeSeries.series.length) return;

    const chart = initEChart(element);
    echartRef.current = chart;
    const {series: tsSeries, labels} = timeSeries;
    const zeros = Array(labels.length).fill(0);
    const isVisible = name =>
      soloRef.current.size === 0 || soloRef.current.has(name);

    const tooltipFormatter = params => {
      const rows = Array.isArray(params) ? params : [params];
      if (!rows.length) return "";
      const bucket = rows[0].dataIndex;
      const focal = focalRef.current;
      const focalSeries =
        focal >= 0 && isVisible(tsSeries[focal].groupName)
          ? tsSeries[focal]
          : null;

      const breakdown = tsSeries
        .map((series, index) => ({
          name: series.name,
          color: series.color,
          count: series.counts[bucket] || 0,
          group: series.groupName,
          index,
        }))
        .filter(item => item.count > 0 && isVisible(item.group))
        .sort((a, b) => b.count - a.count);
      const totalPeople = breakdown.reduce((sum, item) => sum + item.count, 0);

      const compact =
        typeof window !== "undefined" && window.innerWidth < 560;
      const W = compact ? 210 : 264;
      const PX = compact ? 12 : 16;
      const RAD = compact ? 12 : 14;
      const ICON = compact ? 28 : 34;
      const YEAR_FS = compact ? 16 : 19;
      const SUB_FS = compact ? 11.5 : 12.5;
      const TITLE_FS = compact ? 15 : 17;
      const NAME_FS = compact ? 12.5 : 13.5;
      const YR_FS = compact ? 11.5 : 12.5;
      const LABEL_FS = compact ? 10 : 11;
      const ROW_FS = compact ? 11 : 12;
      const DOT = compact ? 8 : 9;
      const PEOPLE_MB = compact ? 5 : 7;
      const ROW_MB = compact ? 6 : 8;
      const MAX_ROWS = compact ? 8 : 12;
      const MAX_PEOPLE = compact ? 4 : 5;

      let html =
        `<div style="width:${W}px;max-width:calc(100vw - 20px);box-sizing:border-box;` +
        `background:#fff;border-radius:${RAD}px;box-shadow:0 8px 28px rgba(0,0,0,0.16);` +
        'overflow:hidden;font-family:Amiko,Arial,sans-serif;color:#2a2a2a;">';

      // Header
      html +=
        `<div style="display:flex;align-items:center;gap:10px;padding:${compact ? 10 : 12}px ${PX}px ${compact ? 8 : 10}px;">` +
        `<div style="width:${ICON}px;height:${ICON}px;border-radius:50%;background:#f1efe9;` +
        `display:flex;align-items:center;justify-content:center;flex:0 0 auto;">${CAL_ICON}</div>` +
        "<div>" +
        `<div style="font-size:${YEAR_FS}px;font-weight:700;line-height:1.05;color:#222;">${escapeHtml(rows[0].axisValue)}</div>` +
        `<div style="font-size:${SUB_FS}px;color:#8a857c;margin-top:1px;">${formatExploreNumber(totalPeople, locale)} ${t(totalPeople === 1 ? "person" : "peopleCount")}</div>` +
        "</div></div>";
      html += '<div style="height:1px;background:#ededea;"></div>';

      // Focal occupation + its top people for this bucket
      if (focalSeries) {
        const count = focalSeries.counts[bucket] || 0;
        const pct = percent
          ? ` · ${Number(focalSeries.values[bucket] || 0).toFixed(1)}%`
          : "";
        html +=
          `<div style="padding:${compact ? 10 : 12}px ${PX}px 0;">` +
          `<div style="border-left:${compact ? 3 : 4}px solid ${focalSeries.color};padding-left:${compact ? 9 : 11}px;">` +
          `<div style="font-size:${TITLE_FS}px;font-weight:700;letter-spacing:0.4px;line-height:1.05;` +
          `text-transform:uppercase;color:${focalSeries.color};">${escapeHtml(focalSeries.name)}</div>` +
          `<div style="font-size:${SUB_FS}px;color:#8a857c;margin-top:2px;">${formatExploreNumber(count, locale)} ${t(count === 1 ? "person" : "peopleCount")}${pct}</div>` +
          "</div></div>";
        html += `<div style="height:1px;background:#ededea;margin:${compact ? 10 : 12}px ${PX}px 0;"></div>`;

        const people = (focalSeries.bucketTopPeople[bucket] || []).slice(
          0,
          MAX_PEOPLE
        );
        if (people.length) {
          html +=
            `<div style="padding:${compact ? 9 : 11}px ${PX}px 0;">` +
            `<div style="font-size:${LABEL_FS}px;letter-spacing:0.7px;color:#aaa49b;` +
            `text-transform:uppercase;margin-bottom:${compact ? 6 : 8}px;">${t("topRankedPeople")}</div>`;
          html += people
            .map(person => {
              const yr =
                person.birthyear != null
                  ? t("bornAbbreviation", {
                      year: formatExploreYear(person.birthyear, locale),
                    })
                  : "";
              return (
                `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:${PEOPLE_MB}px;">` +
                `<span style="font-size:${NAME_FS}px;font-weight:700;color:#2a2a2a;">${escapeHtml(person.name)}</span>` +
                `<span style="font-size:${YR_FS}px;color:#aaa49b;white-space:nowrap;">${escapeHtml(yr)}</span>` +
                "</div>"
              );
            })
            .join("");
          html += "</div>";
        }
      }

      // Full occupation breakdown for this bucket (raw counts, dotted leaders)
      const visible = breakdown.slice(0, MAX_ROWS);
      const hidden = breakdown.length - visible.length;
      html += `<div style="padding:${compact ? 10 : 12}px ${PX}px ${compact ? 11 : 13}px;">`;
      html += visible
        .map(item => {
          const bold = item.index === focal ? "font-weight:700;" : "";
          return (
            `<div style="display:flex;align-items:center;margin-bottom:${ROW_MB}px;">` +
            `<span style="width:${DOT}px;height:${DOT}px;border-radius:50%;background:${item.color};flex:0 0 auto;margin-right:${compact ? 9 : 11}px;"></span>` +
            `<span style="font-size:${ROW_FS}px;letter-spacing:0.3px;color:#3a3a3a;text-transform:uppercase;${bold}">${escapeHtml(item.name)}</span>` +
            `<span style="flex:1;border-bottom:1px dotted #d9d5ce;margin:0 8px;transform:translateY(-3px);"></span>` +
            `<span style="font-size:${ROW_FS}px;color:#3a3a3a;${bold}">${formatExploreNumber(item.count, locale)}</span>` +
            "</div>"
          );
        })
        .join("");
      if (hidden > 0) {
        html += `<div style="font-size:${LABEL_FS + 1}px;color:#aaa49b;margin-top:1px;">${t("andMore", {count: formatExploreNumber(hidden, locale)})}</div>`;
      }
      html += "</div></div>";

      return html;
    };

    const option = {
      color: tsSeries.map(series => series.color),
      tooltip: {
        trigger: "axis",
        triggerOn: "none",
        confine: true,
        axisPointer: {type: "line"},
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
        extraCssText: "box-shadow:none;",
        formatter: tooltipFormatter,
      },
      grid: {
        top: 18,
        right: 20,
        bottom: 54,
        left: 58,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: labels,
        axisTick: {alignWithLabel: true},
        axisLabel: {
          interval: 0,
          rotate: 45,
          fontSize: 10,
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
        },
        axisLine: {lineStyle: {color: "#D6D6D0"}},
      },
      yAxis: {
        type: "value",
        name: percent
          ? t("shareOfMemorableIndividuals")
          : t("globallyMemorableIndividuals"),
        nameLocation: "middle",
        nameGap: 42,
        max: percent ? 100 : undefined,
        nameTextStyle: {
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
          fontSize: 11,
        },
        axisLabel: {
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
          formatter: percent
            ? value => `${value}%`
            : value => (value % 1
              ? ""
              : formatExploreNumber(Math.round(value), locale)),
        },
        splitLine: {lineStyle: {color: "#D6D6D0"}},
      },
      series: tsSeries.map(series => ({
        name: series.name,
        type: "line",
        stack: "total",
        smooth: true,
        showSymbol: false,
        symbol: "circle",
        sampling: "lttb",
        data: isVisible(series.groupName) ? series.values : zeros,
        lineStyle: {
          width: 0.75,
          color: series.color,
        },
        areaStyle: {
          opacity: 0.72,
          color: series.color,
        },
        itemStyle: {
          color: series.color,
        },
        emphasis: {
          focus: "series",
        },
      })),
    };

    chart.setOption(option, {notMerge: true, lazyUpdate: true});
    const cleanupResize = setupResize(chart, element);

    // Hover: find the stacked band under the cursor to highlight that occupation
    // (and surface it + its top HPI people in the tooltip).
    const zr = chart.getZr();
    const downplayAll = () => chart.dispatchAction({type: "downplay"});
    const visAt = i =>
      soloRef.current.size === 0 || soloRef.current.has(tsSeries[i].groupName);

    const handleMove = event => {
      const pointer = [event.offsetX, event.offsetY];
      if (!chart.containPixel({gridIndex: 0}, pointer)) {
        if (focalRef.current !== -1) {
          focalRef.current = -1;
          downplayAll();
        }
        chart.dispatchAction({type: "hideTip"});
        return;
      }

      const [xVal, yVal] = chart.convertFromPixel({gridIndex: 0}, pointer);
      let bucket = Math.round(xVal);
      if (bucket < 0) bucket = 0;
      if (bucket > labels.length - 1) bucket = labels.length - 1;

      // Series array order == stack order (bottom → top); skip hidden bands.
      let cumulative = 0;
      let focal = -1;
      for (let i = 0; i < tsSeries.length; i += 1) {
        const value = visAt(i) ? tsSeries[i].values[bucket] || 0 : 0;
        cumulative += value;
        if (value > 0 && yVal <= cumulative) {
          focal = i;
          break;
        }
      }
      if (focal === -1 && yVal > 0) {
        for (let i = tsSeries.length - 1; i >= 0; i -= 1) {
          if (visAt(i) && (tsSeries[i].values[bucket] || 0) > 0) {
            focal = i;
            break;
          }
        }
      }

      if (focal !== focalRef.current) {
        focalRef.current = focal;
        downplayAll();
        if (focal >= 0) {
          chart.dispatchAction({type: "highlight", seriesIndex: focal});
        }
      }
      chart.dispatchAction({type: "showTip", x: event.offsetX, y: event.offsetY});
    };

    const handleOut = () => {
      focalRef.current = -1;
      downplayAll();
      chart.dispatchAction({type: "hideTip"});
    };

    zr.on("mousemove", handleMove);
    zr.on("globalout", handleOut);

    return () => {
      cleanupResize();
      zr.off("mousemove", handleMove);
      zr.off("globalout", handleOut);
      chart.dispose();
      echartRef.current = null;
    };
  }, [timeSeries, percent, locale, t]);

  // Apply solo selection to the existing chart without a full rebuild.
  useEffect(() => {
    const chart = echartRef.current;
    if (!chart || !timeSeries.series.length) return;
    const zeros = Array(timeSeries.labels.length).fill(0);
    chart.setOption(
      {
        series: timeSeries.series.map(series => ({
          data:
            effectiveSolo.size === 0 || effectiveSolo.has(series.groupName)
              ? series.values
              : zeros,
        })),
      },
      {lazyUpdate: true}
    );
  }, [effectiveSolo, timeSeries]);

  const toggleDomain = name => {
    setSoloDomains(prev => {
      // Start from the pruned set so stale domains don't linger.
      const next = new Set([...prev].filter(item => legendNames.has(item)));
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (!timeSeries.series.length) {
    return <div>{t("noDataAvailable")}</div>;
  }

  return (
    <div className="pantheon-echart-shell">
      <div
        className="pantheon-echart"
        ref={chartRef}
        role="img"
        aria-label={t("exploreStackedChart")}
      />
      <div className="pantheon-echart-legend">
        {timeSeries.legendItems.map(item => {
          const dimmed =
            effectiveSolo.size > 0 && !effectiveSolo.has(item.name);
          return (
            <button
              type="button"
              className={`pantheon-echart-legend-item${dimmed ? " is-dimmed" : ""}`}
              key={item.name}
              onClick={() => toggleDomain(item.name)}
              aria-pressed={effectiveSolo.has(item.name)}
              title={t("solo", {name: item.name})}
            >
              <span style={{backgroundColor: item.color}} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
