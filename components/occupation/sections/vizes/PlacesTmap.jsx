"use client";
import { Treemap } from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import { groupTooltip, on } from "../../../utils/vizHelpers";
import { COLORS_CONTINENT } from "../../../utils/consts";

export default function PlacesTmap({ data, title }) {
  return (
    <VizWrapper component={this} refKey="occAliveTmapViz">
      <div className="metric-trending">
        <Treemap
          key="tmap_country1"
          config={{
            title,
            data,
            depth: 1,
            groupBy: ["continent", "country"],
            on: on("country", (d) => d.country.slug),
            legendConfig: {
              label: (d) => d.borncontinent,
            },
            shapeConfig: { fill: (d) => COLORS_CONTINENT[d.continent] },
            // time: "birthyear",
            tooltipConfig: groupTooltip(data, (d) => d.country.slug),
            sum: (d) => (d.id ? (d.id instanceof Array ? d.id.length : 1) : 0),
          }}
        />
      </div>
    </VizWrapper>
  );
}
