"use client";
import { LinePlot } from "d3plus-react";
import { FORMATTERS } from "../utils/consts";

export default function HeaderLine({ data }) {
  return (
    <div>
      <LinePlot
        config={{
          data: data,
          discrete: "x",
          // groupBy: "article",
          height: 120,
          legend: false,
          shape: (d) => d.shape || "Line",
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
            body: (d) => {
              const topPeople =
                d.topPeople instanceof Array ? d.topPeople : [d.topPeople];
              let txt = `<span class='sub'>Top Ranked ${
                topPeople.length === 1 ? "Person" : "People"
              }</span>`;
              // const peopleNames = d.topPeople.map(d => d.name);
              topPeople.forEach((n) => {
                txt += `<br /><span class="bold">${
                  n.name
                }</span> b.${FORMATTERS.year(n.birthyear)}`;
              });
              return txt;
            },
            footer: (d) => `${FORMATTERS.commas(d.y)} Total Births`,
            title: (d) => `<span class="center">${d.binName}</span>`,
            titleStyle: { "text-align": "center" },
            width: "200px",
            footerStyle: {
              "font-size": "12px",
              "text-transform": "none",
              color: "#4B4A48",
            },
          },
          width: 275,
          x: (d) => `${d.x}`,
          xConfig: {
            tickFormat: (s) => `${s}`,
          },
          y: (d) => d.y,
          yConfig: { labels: [], ticks: [], title: "Births" },
        }}
      />
    </div>
  );
}
