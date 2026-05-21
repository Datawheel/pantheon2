"use client";

import {useEffect, useMemo, useRef} from "react";
import {initEChart} from "@/components/utils/echarts";
import {FORMATTERS} from "../../utils/consts";
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

const peopleWord = n => (n === 1 ? "person" : "people");

export default function PStacked({
  data,
  occupations,
  show,
  yearType,
  years,
  scale,
  binCount,
  percent = false,
}) {
  const chartRef = useRef(null);

  const timeSeries = useMemo(() => {
    const {rows, levels} = buildExploreRows(data, occupations, show, yearType);
    return buildTimeSeries(rows, levels, yearType, {
      yearRange: years,
      scale,
      binCount,
      percent,
    });
  }, [data, occupations, show, yearType, years, scale, binCount, percent]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !timeSeries.series.length) return;

    const chart = initEChart(element);
    const {series: tsSeries, bucketCounts, labels} = timeSeries;
    const focalRef = {current: -1};

    const tooltipFormatter = params => {
      const rows = Array.isArray(params) ? params : [params];
      if (!rows.length) return "";
      const bucket = rows[0].dataIndex;
      const totalPeople = bucketCounts[bucket] || 0;
      const focal = focalRef.current;
      const focalSeries = focal >= 0 ? tsSeries[focal] : null;

      // Card shell + header (calendar icon, year, total people)
      let html =
        '<div style="width:288px;box-sizing:border-box;background:#fff;' +
        "border-radius:16px;box-shadow:0 10px 34px rgba(0,0,0,0.16);" +
        'overflow:hidden;font-family:Amiko,Arial,sans-serif;color:#2a2a2a;">';
      html +=
        '<div style="display:flex;align-items:center;gap:12px;padding:15px 18px 13px;">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:#f1efe9;' +
        `display:flex;align-items:center;justify-content:center;flex:0 0 auto;">${CAL_ICON}</div>` +
        "<div>" +
        `<div style="font-size:21px;font-weight:700;line-height:1.05;color:#222;">${escapeHtml(rows[0].axisValue)}</div>` +
        `<div style="font-size:13px;color:#8a857c;margin-top:2px;">${FORMATTERS.commas(totalPeople)} ${peopleWord(totalPeople)}</div>` +
        "</div></div>";
      html += '<div style="height:1px;background:#ededea;"></div>';

      // Focal occupation + its top people for this bucket
      if (focalSeries) {
        const count = focalSeries.counts[bucket] || 0;
        const pct = percent
          ? ` · ${Number(focalSeries.values[bucket] || 0).toFixed(1)}%`
          : "";
        html +=
          '<div style="padding:15px 18px 0;">' +
          `<div style="border-left:4px solid ${focalSeries.color};padding-left:12px;">` +
          "<div style=\"font-size:21px;font-weight:700;letter-spacing:0.5px;line-height:1.05;" +
          `text-transform:uppercase;color:${focalSeries.color};">${escapeHtml(focalSeries.name)}</div>` +
          `<div style="font-size:13px;color:#8a857c;margin-top:3px;">${FORMATTERS.commas(count)} ${peopleWord(count)}${pct}</div>` +
          "</div></div>";
        html += '<div style="height:1px;background:#ededea;margin:14px 18px 0;"></div>';

        const people = focalSeries.bucketTopPeople[bucket] || [];
        if (people.length) {
          html +=
            '<div style="padding:13px 18px 0;">' +
            '<div style="font-size:11px;letter-spacing:0.8px;color:#aaa49b;' +
            'text-transform:uppercase;margin-bottom:9px;">Top Ranked People</div>';
          html += people
            .map(person => {
              const yr =
                person.birthyear != null
                  ? `b.${FORMATTERS.year(person.birthyear)}`
                  : "";
              return (
                '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">' +
                `<span style="font-size:14px;font-weight:700;color:#2a2a2a;">${escapeHtml(person.name)}</span>` +
                `<span style="font-size:13px;color:#aaa49b;padding-left:14px;white-space:nowrap;">${escapeHtml(yr)}</span>` +
                "</div>"
              );
            })
            .join("");
          html += "</div>";
        }
      }

      // Full occupation breakdown for this bucket (raw counts, dotted leaders)
      const breakdown = tsSeries
        .map((series, index) => ({
          name: series.name,
          color: series.color,
          count: series.counts[bucket] || 0,
          index,
        }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);
      const visible = breakdown.slice(0, 12);
      const hidden = breakdown.length - visible.length;

      html += '<div style="padding:14px 18px 16px;">';
      html += visible
        .map(item => {
          const bold = item.index === focal ? "font-weight:700;" : "";
          return (
            '<div style="display:flex;align-items:center;margin-bottom:10px;">' +
            `<span style="width:9px;height:9px;border-radius:50%;background:${item.color};flex:0 0 auto;margin-right:11px;"></span>` +
            `<span style="font-size:12.5px;letter-spacing:0.4px;color:#3a3a3a;text-transform:uppercase;${bold}">${escapeHtml(item.name)}</span>` +
            '<span style="flex:1;border-bottom:1px dotted #d9d5ce;margin:0 9px;transform:translateY(-3px);"></span>' +
            `<span style="font-size:13px;color:#3a3a3a;${bold}">${FORMATTERS.commas(item.count)}</span>` +
            "</div>"
          );
        })
        .join("");
      if (hidden > 0) {
        html += `<div style="font-size:12px;color:#aaa49b;margin-top:2px;">(and ${hidden} more)</div>`;
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
          ? "Share of Memorable Individuals"
          : "Globally Memorable Individuals",
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
            : value => (value % 1 ? "" : FORMATTERS.commas(Math.round(value))),
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
        data: series.values,
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

      // Series array order == stack order (bottom → top)
      let cumulative = 0;
      let focal = -1;
      for (let i = 0; i < tsSeries.length; i += 1) {
        cumulative += tsSeries[i].values[bucket] || 0;
        if (yVal <= cumulative) {
          focal = i;
          break;
        }
      }
      if (focal === -1 && yVal > 0) focal = tsSeries.length - 1;

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
    };
  }, [timeSeries, percent]);

  if (!timeSeries.series.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="pantheon-echart-shell">
      <div
        className="pantheon-echart"
        ref={chartRef}
        role="img"
        aria-label="Explore stacked area chart"
      />
      <div className="pantheon-echart-legend">
        {timeSeries.legendItems.map(item => (
          <div className="pantheon-echart-legend-item" key={item.name}>
            <span style={{backgroundColor: item.color}} />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
