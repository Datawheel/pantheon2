"use client";

import {useEffect, useRef} from "react";
import * as echarts from "echarts";

export default function PageViewsChart({pageviewsData, lang = "en"}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !pageviewsData || pageviewsData.length === 0) {
      return;
    }

    // Initialize chart
    const chart = echarts.init(chartRef.current);

    // Prepare data
    const dates = pageviewsData.map(d => d.date);
    const views = pageviewsData.map(d => d.views);

    // Find min and max indices for marking
    const minIndex = views.indexOf(Math.min(...views));
    const maxIndex = views.indexOf(Math.max(...views));

    // Format date for peak label (YYYY-MM-DD -> Mon YYYY) in the current language
    const formatDateLabel = (dateStr) => {
      const [year, month, day] = dateStr.split("-");
      const date = new Date(year, parseInt(month) - 1, day || 1);

      // Get localized month abbreviation
      const monthFormatter = new Intl.DateTimeFormat(lang, { month: "short" });
      const monthName = monthFormatter.format(date);

      return `${monthName} ${year}`;
    };

    // Chart configuration
    const option = {
      grid: {
        left: 30,
        right: 30,
        top: 25,
        bottom: 25,
      },
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: (index) => {
            // Only show first and last labels
            return index === 0 || index === dates.length - 1;
          },
          formatter: (value) => {
            return value.split("-")[0]; // Show year only
          },
          color: "#999",
          fontSize: 11,
        },
      },
      yAxis: {
        type: "value",
        show: false,
      },
      series: [
        {
          type: "line",
          data: views,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            color: "#2a2a2a",
            width: 1.5,
          },
          markPoint: {
            symbol: "circle",
            symbolSize: 6,
            data: [
              // First point
              {
                coord: [0, views[0]],
                itemStyle: {color: "#2a2a2a"},
                label: {show: false},
              },
              // Last point
              {
                coord: [views.length - 1, views[views.length - 1]],
                itemStyle: {color: "#2a2a2a"},
                label: {show: false},
              },
              // Max point with label
              {
                coord: [maxIndex, views[maxIndex]],
                itemStyle: {color: "#2a2a2a"},
                label: {
                  show: true,
                  formatter: () => formatDateLabel(dates[maxIndex]),
                  position: "top",
                  color: "#2a2a2a",
                  fontSize: 11,
                  fontWeight: 500,
                  distance: 8,
                },
              },
            ],
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderColor: "#ccc",
        borderWidth: 1,
        textStyle: {
          color: "#2a2a2a",
        },
        formatter: (params) => {
          const date = params[0].axisValue;
          const views = params[0].data.toLocaleString();
          const formattedDate = formatDateLabel(date);
          return `${formattedDate}<br/><strong>${views}</strong> views`;
        },
      },
    };

    chart.setOption(option);

    // Handle resize
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [pageviewsData]);

  if (!pageviewsData || pageviewsData.length === 0) {
    return null;
  }

  return (
    <div className="pageviews-chart-container">
      <div
        ref={chartRef}
        className="pageviews-chart"
        style={{width: "100%", height: "120px"}}
      />
      <p className="pageviews-label">{lang.toUpperCase()}.WIKIPEDIA PAGE VIEWS (PV)</p>
    </div>
  );
}
