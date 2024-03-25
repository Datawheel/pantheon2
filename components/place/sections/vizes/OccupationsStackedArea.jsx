"use client";
import {StackedArea} from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import {groupBy, groupTooltip, shapeConfig} from "../../../utils/vizHelpers";

export default function OccupationsStackedArea({
  attrs,
  data,
  title,
  ticks,
  buckets,
}) {
  return (
    <VizWrapper component={this} refKey="viz">
      <div className="metric-trending">
        <StackedArea
          key="stacked1"
          config={{
            title,
            data,
            depth: 2,
            groupBy: ["domain", "industry", "occupation_name"].map(
              groupBy(attrs)
            ),
            shapeConfig: shapeConfig(attrs),
            tooltipConfig: groupTooltip(data),
            xConfig: {
              labels: ticks,
              tickFormat: d => buckets[d],
            },
          }}
        />
      </div>
    </VizWrapper>
  );
}
