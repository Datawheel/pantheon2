"use client";
import {LinePlot} from "d3plus-react";
import dayjs from "dayjs";
import {FORMATTERS} from "../utils/consts";

export default function Header({pageViewData}) {
  return (
    <div>
      <LinePlot
        config={{
          data: pageViewData,
          height: 150,
          groupBy: "article",
          legend: false,
          discrete: "x",
          shape: d => d.shape || "Line",
          shapeConfig: {
            hoverOpacity: 1,
            Circle: {
              fill: "#4B4A48",
              r: () => 3.5,
            },
            Line: {
              fill: "none",
              stroke: "#4B4A48",
              strokeWidth: 1,
            },
          },
          // time: (d) => d.date,
          timeline: false,
          tooltipConfig: {
            footer: d => `${FORMATTERS.commas(d.views)} Page Views`,
            title: d =>
              `<span class="center">${dayjs(d.date, "YYYY/MM/DD").format(
                "MMMM YYYY"
              )}</span>`,
            titleStyle: {"text-align": "center"},
            width: "200px",
            footerStyle: {
              "font-size": "12px",
              "text-transform": "none",
              "color": "#4B4A48",
            },
          },
          width: 275,
          x: d => d.date,
          xConfig: {
            barConfig: {"stroke-width": 0},
            // labels: sparkTicks,
            shapeConfig: {
              fill: "#4B4A48",
              fontColor: "#4B4A48",
              fontSize: () => 8,
              stroke: "#4B4A48",
            },
            // ticks: sparkTicks,
            tickSize: 0,
            tickFormat: d => {
              if (typeof d === "number") return new Date(d).getFullYear();
              return d;
            },
            title: "EN.WIKIPEDIA PAGE VIEWS (PV)",
            titleConfig: {
              fontColor: "#4B4A48",
              fontFamily: () => ["Amiko", "Arial Narrow", "sans-serif"],
              fontSize: () => 11,
              stroke: "#4B4A48",
            },
          },
          y: d => d.views,
          yConfig: {labels: [], ticks: [], title: false},
        }}
      />
    </div>
  );
}
