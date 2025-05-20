"use client";

import {useEffect, useRef} from "react";
import * as echarts from "echarts";
import {FORMATTERS} from "/components/utils/consts";
import {COLORS_CONTINENT} from "../../../utils/consts";

function assignColorsFromParent(data, COLORS_CONTINENT) {
  return data.map(continentNode => {
    const continentColor = COLORS_CONTINENT[continentNode.name] || "#ccc";

    function applyColorRecursively(node) {
      const newNode = {
        ...node,
        itemStyle: {color: continentColor},
      };

      if (node.children) {
        newNode.children = node.children.map(applyColorRecursively);
      }

      return newNode;
    }

    return applyColorRecursively(continentNode);
  });
}

export default function PlacesTmap({baseOption, style}) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    // Deep clone option so we can modify it safely
    const option = JSON.parse(JSON.stringify(baseOption));

    option.series[0].label.formatter = params => {
      return `{name|${params.name}}\n{percent|${(
        (params.value / params.treePathInfo[0].value) *
        100
      ).toFixed(1)}%}`;
    };

    option.series[0].data = assignColorsFromParent(
      option.series[0].data,
      COLORS_CONTINENT
    );
    // console.log("-----option", option.series[0].data);
    option.tooltip = {
      trigger: "item",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#ccc",
      borderWidth: 1,
      padding: [5, 10],
      textStyle: {
        color: "#333",
      },
      formatter: info => {
        const {name, value} = info;
        return `${name}: ${value}`;
      },
    };

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
