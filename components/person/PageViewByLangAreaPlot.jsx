// "use client";
// import {StackedArea} from "d3plus-react";
// import {FORMATTERS} from "../utils/consts";

// const langFamColors = {
//   "afa": "#cdc84c",
//   "cau": "#0E5E5B",
//   "": "#67AF8C",
//   "ine": "#B12D11",
//   "nic": "#732945",
//   "tut": "#4C5ED7",
//   "crp": "#4F680A",
//   "sit": "#D28629",
//   "map": "#260348",
//   "urj": "#160B5B",
//   "dra": "#162A6D",
//   "tai": "#255A7F",
// };
"use client";

import {useEffect, useRef} from "react";
import * as echarts from "echarts";
import {FORMATTERS} from "/components/utils/consts";

export default function PageViewByLangAreaPlot({baseOption, style}) {
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
        // Count number of non-zero values at this x-axis point
        const numLangs = params.filter(item => item.data.value > 0).length;

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
        return (
          `<strong>${title}</strong><br/>` +
          lines.join("") +
          (numLangs > 10
            ? `<span style="font-size:10px;color:gray;">(and ${
                numLangs - 10
              } others)</span>`
            : "")
        );
      },
    };

    // Ensure all series use symbol: 'none'
    if (option.series) {
      option.series = option.series.map(s => ({
        ...s,
        symbol: "none",
      }));
    }

    // Ensure dates are formatted
    if (option.xAxis) {
      // Convert single xAxis object to array if needed
      option.xAxis = Array.isArray(option.xAxis)
        ? option.xAxis
        : [option.xAxis];
      option.xAxis = option.xAxis.map(x => ({
        ...x,
        axisLabel: {formatter: value => value},
      }));
    }

    option.media = [
      {
        query: {maxWidth: 600},
        option: {yAxis: {axisLabel: {formatter: v => FORMATTERS.bigNum(v)}}},
      },
    ];

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
