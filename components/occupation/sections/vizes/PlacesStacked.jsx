"use client";
import { StackedArea } from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import {
  groupBy,
  groupTooltip,
  on,
  shapeConfig,
} from "../../../utils/vizHelpers";
import { COLORS_CONTINENT } from "../../../utils/consts";

export default function PlacesStacked({ data, title, ticks, buckets }) {
  return (
    <VizWrapper component={this} refKey="occAliveTmapViz">
      <div className="metric-trending">
        <StackedArea
          key="stacked_country1"
          config={{
            title,
            data,
            depth: 1,
            groupBy: ["continent", "country"],
            on: on("country", (d) => d.country.slug),
            shapeConfig: { fill: (d) => COLORS_CONTINENT[d.continent] },
            tooltipConfig: groupTooltip(data, (d) => d.country.slug),
            xConfig: {
              labels: ticks,
              tickFormat: (d) => buckets[d],
            },
            x: "yearBucket",
            y: "yearWeight",
          }}
        />
      </div>
    </VizWrapper>
  );
}
