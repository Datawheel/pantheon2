"use client";

import {useEffect, useRef} from "react";
import * as echarts from "echarts";

export default function EChart({baseOption, style}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    // Deep clone option so we can modify it safely
    const option = JSON.parse(JSON.stringify(baseOption));

    // Inject safe tooltip formatter for top 10 sorted
    option.tooltip = {
      trigger: "axis",
      //   formatter: function (params) {
      //     return `<pre>${JSON.stringify(params, null, 2)}</pre>`;
      //   },
      formatter: function (params) {
        const sorted = [...params]
          .sort((a, b) => b.data.value - a.data.value)
          .slice(0, 10);

        const lines = sorted.map(item => {
          const lang = item.data.langLabel || item.seriesName;
          return `
              <div>
                <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
                  item.color
                };"></span>
                ${lang}: <strong>${item.data.value.toLocaleString()}</strong>
              </div>
            `;
        });

        const title = sorted[0]?.axisValueLabel || "";
        return `<strong>${title}</strong><br/>` + lines.join("");
      },
    };

    // Ensure all series use symbol: 'none'
    if (option.series) {
      option.series = option.series.map(s => ({
        ...s,
        symbol: "none",
      }));
    }

    chart.setOption(option);

    return () => chart.dispose();
  }, [baseOption]);

  return (
    <div
      ref={chartRef}
      style={{width: "100%", height: "600px", ...(style || {})}}
    />
  );
}
