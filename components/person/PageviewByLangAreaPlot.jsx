"use client";
import { StackedArea } from "d3plus-react";
import { FORMATTERS } from "../utils/consts";

const langFamColors = {
  afa: "#cdc84c",
  cau: "#0E5E5B",
  "": "#67AF8C",
  ine: "#B12D11",
  nic: "#732945",
  tut: "#4C5ED7",
  crp: "#4F680A",
  sit: "#D28629",
  map: "#260348",
  urj: "#160B5B",
  dra: "#162A6D",
  tai: "#255A7F",
};

export default function PageviewsByLangAreaPlot({ timeSeriesData, numLangs }) {
  // Whether or not we should show the labels on the lines
  // depends on how many unique languages we have. If there are
  // more than 30 the chart becomes too cluttered with the labels.
  const lineLabels = numLangs <= 30;

  return (
    <>
      <StackedArea
        config={{
          height: 600,
          data: timeSeriesData,
          groupBy: ["primary_family_code", "project"],
          depth: 1,
          discrete: "x",
          shapeConfig: {
            Line: {
              // fill: "none",
              stroke: (d) => langFamColors[d.primary_family_code],
              strokeWidth: 2,
              labelConfig: {
                fontColor: (d) => langFamColors[d.primary_family_code],
              },
            },
          },
          label: (d) => d.language || d.project,
          legendConfig: {
            label: (d) =>
              Array.isArray(d.primary_family_name)
                ? d.primary_family_name.filter(Boolean).join(", ")
                : d.primary_family_name,
          },
          legendTooltip: {
            title: (d) =>
              Array.isArray(d.primary_family_name)
                ? d.primary_family_name.filter(Boolean).join(", ")
                : d.primary_family_name,
            tbody: [],
          },
          lineLabels,
          time: "date",
          timeline: false,
          tooltipConfig: {
            // title: d => `${person.name} (${d.language})`,
            title: (d) => {
              const dObj = new Date(d.date);
              return dObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              });
            },
            body: (d) => {
              let projectTxt = d.project;
              if (Array.isArray(d.project)) {
                projectTxt = d.project.slice(0, 5).join(", ");
                if (d.project.length > 5) {
                  projectTxt += `... (${d.project.slice(5).length} more)`;
                }
              }
              return `<ul>
                    <li class="large">
                      ${FORMATTERS.commas(d.views)}
                      <span>page views</span>
                    </li>
                    <li class="large">
                      ${
                        Array.isArray(d.language)
                          ? d.language.join(", ")
                          : d.language
                      }
                      <span>${projectTxt}</span>
                    </li>
                  </ul>`;
            },
          },
          x: "date",
          // xConfig: {tickFormat: d => FORMATTERS.year(new Date(d).getFullYear())},
          y: "views",
          yConfig: {
            // scale: "log",
            title: "Pageviews by language edition",
            titleConfig: {
              fontSize: () => 18,
            },
            labelConfig: {
              fontSize: () => 18,
            },
            shapeConfig: {
              labelConfig: {
                fontSize: () => 20,
              },
            },
          },
        }}
      />
    </>
  );
}
