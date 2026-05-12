"use client";

import {useEffect, useMemo, useRef} from "react";
import {initEChart} from "@/components/utils/echarts";
import {FORMATTERS} from "../../utils/consts";
import {
  buildExploreRows,
  buildTimeSeries,
  escapeHtml,
  formatChartValue,
  setupResize,
} from "./echartsData";

function axisTooltip(params) {
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
        `${row.marker} ${escapeHtml(row.seriesName)}: ${formatChartValue(row.value)}`
    )
    .join("<br/>");

  const hidden = rows.filter(row => Number(row.value) > 0).length - visibleRows.length;
  if (hidden > 0) {
    html += `<br/><span style="font-size:10px;color:gray;">(and ${hidden} more)</span>`;
  }
  return html;
}

export default function PStacked({data, occupations, show, yearType}) {
  const chartRef = useRef(null);

  const timeSeries = useMemo(() => {
    const {rows, levels} = buildExploreRows(data, occupations, show, yearType);
    return buildTimeSeries(rows, levels, yearType);
  }, [data, occupations, show, yearType]);

  useEffect(() => {
    const element = chartRef.current;
    if (!element || !timeSeries.series.length) return;

    const chart = initEChart(element);
    const tickSet = new Set(timeSeries.ticks);
    const option = {
      color: timeSeries.series.map(series => series.color),
      tooltip: {
        trigger: "axis",
        confine: true,
        axisPointer: {type: "cross"},
        formatter: axisTooltip,
      },
      grid: {
        top: 18,
        right: 20,
        bottom: 38,
        left: 58,
        containLabel: false,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: timeSeries.labels,
        axisTick: {alignWithLabel: true},
        axisLabel: {
          color: "#9E978D",
          fontFamily: "Amiko, Arial, sans-serif",
          formatter: (value, index) => (tickSet.has(index) ? value : ""),
        },
        axisLine: {lineStyle: {color: "#D6D6D0"}},
      },
      yAxis: {
        type: "value",
        name: "Globally Memorable Individuals",
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
            value % 1 ? "" : FORMATTERS.commas(Math.round(value)),
        },
        splitLine: {lineStyle: {color: "#D6D6D0"}},
      },
      series: timeSeries.series.map(series => ({
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

    return () => {
      cleanupResize();
      chart.dispose();
    };
  }, [timeSeries]);

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
