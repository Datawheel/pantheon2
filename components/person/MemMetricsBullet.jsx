import React, {useRef, useEffect} from "react";
import * as echarts from "echarts";
import {toTitleCase} from "/components/utils/vizHelpers";
import {FORMATTERS} from "/components/utils/consts";

const MemMetricsBullet = ({value, compareValue, compareValueTitle}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose previous instance if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
    }

    // Initialize chart
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const markLine = compareValue
      ? {
          symbol: ["none", "none"],
          symbolSize: 10,
          lineStyle: {
            type: "dashed",
            color: "#aaa",
          },
          label: {
            show: true,
            position: "end",
            offset: [0, 10],
            formatter: params => {
              const value = params.value;
              // Round to nearest integer and format with commas
              const formattedValue =
                value != null ? Math.round(value).toLocaleString() : "";
              return `${params.name}\n${formattedValue}`;
            },
            color: "#333",
            fontWeight: "bold",
          },
          data: [
            {
              xAxis: compareValue,
              name: `Avg ${toTitleCase(compareValueTitle)}`,
            },
            // {xAxis: , name: "Avg Occupation"},
          ],
        }
      : null;

    const option = {
      grid: {
        left: 0,
        right: 50,
        top: 20,
        bottom: 10,
        containLabel: true,
      },
      xAxis: {
        type: "value",
        // min: minValue,
        // max: maxValue,
      },
      yAxis: {
        type: "category",
        data: [""],
      },
      series: [
        {
          name: `Avg ${compareValueTitle} Background`,
          type: "bar",
          data: [compareValue],
          barWidth: 40,
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 1,
                  color: "#bbb",
                },
                {
                  offset: 0,
                  color: "rgba(187, 187, 187, 0)",
                },
              ],
            },
          },
          z: 1,
          silent: true,
          barGap: "-75%",
        },
        {
          name: "Value",
          type: "bar",
          data: [value],
          barWidth: 20,
          itemStyle: {
            color: "#B12D11",
          },
          label: {
            show: true,
            position: "inside",
            formatter: function (params) {
              return params.value.toLocaleString();
            },
            color: "#fff",
          },
          z: 2,
          markLine,
        },
      ],
      media: [
        {
          query: {
            maxWidth: 600,
          },
          option: {
            xAxis: {
              axisLabel: {
                formatter: v => FORMATTERS.bigNum(v),
              },
            },
          },
        },
      ],
    };

    chart.setOption(option);

    // Responsive resize
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
    };
  }, [value, compareValue]);

  return <div ref={chartRef} style={{width: "100%", height: 140}} />;
};

export default MemMetricsBullet;
