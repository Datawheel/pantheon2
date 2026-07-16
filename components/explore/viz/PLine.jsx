"use client";

import {useEffect, useMemo, useRef} from "react";
import {initEChart} from "@/components/utils/echarts";
import {
  formatExploreNumber,
  getExploreTranslations,
} from "@/app/exploreTranslations";
import {
  buildExploreRows,
  buildTimeSeries,
  escapeHtml,
  formatChartValue,
  setupResize,
} from "./echartsData";

function axisTooltip(params, locale, t) {
  const rows = Array.isArray(params) ? params : [params];
  const visibleRows = rows
    .filter(row => Number(row.value) > 0)
    .sort((a, b) => Number(b.value) - Number(a.value))
    .slice(0, 15);

  if (!rows.length) return "";

  let html = `<div style="text-align:center;"><b>${escapeHtml(rows[0].axisValue)}</b></div><hr/>`;
  html += visibleRows
    .map(
      row =>
        `${row.marker} ${escapeHtml(row.seriesName)}: ${formatChartValue(row.value, locale)}`
    )
    .join("<br/>");

  const hidden = rows.filter(row => Number(row.value) > 0).length - visibleRows.length;
  if (hidden > 0) {
    html += `<br/><span style="font-size:10px;color:gray;">${escapeHtml(t("andMore", {count: formatExploreNumber(hidden, locale)}))}</span>`;
  }
  return html;
}

export default function PLine({
  data,
  occupations,
  show,
  yearType,
  years,
  scale,
  binCount,
  locale,
}) {
  const t = useMemo(() => getExploreTranslations(locale), [locale]);
  const chartRef = useRef(null);

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
    });
  }, [data, occupations, show, yearType, years, scale, binCount, locale]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !timeSeries.series.length) return;

    const chart = initEChart(element);
    const option = {
      color: timeSeries.series.map(series => series.color),
      tooltip: {
        trigger: "axis",
        confine: true,
        axisPointer: {type: "cross"},
        formatter: params => axisTooltip(params, locale, t),
      },
      grid: {
        top: 18,
        right: 24,
        bottom: 54,
        left: 58,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: timeSeries.labels,
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
        name: t("globallyMemorableIndividuals"),
        nameLocation: "middle",
        nameGap: 42,
        nameTextStyle: {
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
          fontSize: 11,
        },
        axisLabel: {
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
          formatter: value =>
            value % 1 ? "" : formatExploreNumber(Math.round(value), locale),
        },
        splitLine: {lineStyle: {color: "#D6D6D0"}},
      },
      series: timeSeries.series.map(series => ({
        name: series.name,
        type: "line",
        smooth: true,
        showSymbol: false,
        symbol: "circle",
        sampling: "lttb",
        data: series.values,
        lineStyle: {
          width: 2,
          color: series.color,
        },
        itemStyle: {
          color: series.color,
        },
        emphasis: {
          focus: "series",
          lineStyle: {width: 3},
        },
      })),
    };

    chart.setOption(option, {notMerge: true, lazyUpdate: true});
    const cleanupResize = setupResize(chart, element);

    return () => {
      cleanupResize();
      chart.dispose();
    };
  }, [timeSeries, locale, t]);

  if (!timeSeries.series.length) {
    return <div>{t("noDataAvailable")}</div>;
  }

  return (
    <div className="pantheon-echart-shell">
      <div
        className="pantheon-echart"
        ref={chartRef}
        role="img"
        aria-label={t("exploreLineChart")}
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
