"use client";
import { AreaPlot } from "d3plus-react";
import { FORMATTERS } from "../utils/consts";

export default function MemMetricsAreaPlot({ trendData }) {
  return (
    <div className="metric-trending">
      <AreaPlot
        config={{
          height: 200,
          data: trendData,
          groupBy: "pid",
          discrete: "x",
          x: "date",
          y: "views",
          legend: false,
          shapeConfig: {
            Area: {
              curve: "monotoneX",
              fill: (d) => d.color,
            },
          },
          yConfig: {
            title: "Wikipedia Pageviews",
          },
          time: "date",
          title: "Pageviews for the past 30 days",
          titleConfig: {
            fontColor: "#4B4A48",
            fontFamily: () => ["Amiko", "Arial Narrow", "sans-serif"],
          },
          tooltipConfig: {
            footer: (d) => `${FORMATTERS.commas(d.views)} Page Views`,
            title: (d) =>
              `<span class="center">${moment(d.date, "YYYY-MM-DD").format(
                "LL"
              )}</span>`,
            titleStyle: { "text-align": "center" },
            width: "200px",
            footerStyle: {
              "font-size": "12px",
              "text-transform": "none",
              color: "#4B4A48",
            },
          },
        }}
      />
    </div>
  );
}
