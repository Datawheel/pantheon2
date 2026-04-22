"use client";

import {useEffect, useRef} from "react";
import {initEChart} from "@/components/utils/echarts";

export default function PlacesStacked({baseOption, style, cohorts}) {
  const chartRef = useRef(null);
  const highlightedCountryRef = useRef(null);
  const mouseYRef = useRef(null);

  useEffect(() => {
    const dom = chartRef.current;
    if (!chartRef.current) return;
    const chart = initEChart(chartRef.current);

    // Deep clone option so we can modify it safely
    const option = JSON.parse(JSON.stringify(baseOption));

    option.legend = {
      ...option.legend,
      formatter: name => name, // keep names simple
    };

    // Inject safe tooltip formatter for top 10 sorted
    option.tooltip = {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
          formatter: function (params) {
            return params.axisDimension === "y"
              ? Math.round(params.value)
              : params.value;
          },
        },
      },
      formatter: function (params) {
        const cohort = params[0].axisValue;
        const sorted = params
          .filter(p => p.value !== 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 15);
        const numCountries = params.filter(p => p.value !== 0).length;

        const highlighted = highlightedCountryRef.current;

        let ttipHtml =
          `<div style="text-align: center;"><b>${cohort}</b></div><hr/>` +
          sorted
            .map(p => {
              const isHighlighted = p.seriesName === highlighted;
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${
                p.color
              };"></span> ${
                isHighlighted
                  ? `<span style="background-color: #fff9c4; padding: 2px 4px; border-radius: 3px;"><b>${p.seriesName}: ${p.value}</b></span>`
                  : `${p.seriesName}: ${p.value}`
              }`;
            })
            .join("<br/>");
        if (highlighted && !ttipHtml.includes(highlighted)) {
          const highlightedValue = params.find(
            p => p.seriesName === highlighted
          );
          if (highlightedValue) {
            ttipHtml += `<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${highlightedValue.color};"></span><span style="background-color: #fff9c4; padding: 2px 4px; border-radius: 3px;"><b>${highlighted}: ${highlightedValue.value}</b></span>`;
          }
        }
        if (numCountries > 15) {
          ttipHtml += `<br/><span style="font-size:10px;color:gray;">(and ${
            numCountries - 15
          } more)</span>`;
        }
        return ttipHtml;
      },
    };

    chart.setOption(option);

    // Native mousemove to track Y
    const handleMouseMove = e => {
      const rect = dom.getBoundingClientRect();
      const y = e.clientY - rect.top;
      // console.log("y:", e.clientY, rect.top);
      mouseYRef.current = y;
    };

    dom.addEventListener("mousemove", handleMouseMove);

    chart.on("updateAxisPointer", function (event) {
      const xIndex = event.axesInfo?.[0]?.value;
      const currentMouseY = mouseYRef.current;
      if (!xIndex || currentMouseY == null) return;

      const xLabel = cohorts[xIndex];
      if (!xLabel) return;

      let cumulative = 0;
      highlightedCountryRef.current = null;

      for (const s of option.series) {
        const value = s.data[xIndex] || 0;
        const newTop = cumulative + value;

        const bottomPx = chart.convertToPixel({yAxisIndex: 0}, cumulative);
        const topPx = chart.convertToPixel({yAxisIndex: 0}, newTop);

        if (currentMouseY >= topPx && currentMouseY <= bottomPx) {
          // console.log("highlighted:", s.name);
          highlightedCountryRef.current = s.name;
          break;
        }

        cumulative = newTop;
      }
    });

    return () => chart.dispose();
  }, [baseOption, cohorts]);

  return (
    <div
      ref={chartRef}
      style={{width: "100%", height: "600px", ...(style || {})}}
    />
  );
}
