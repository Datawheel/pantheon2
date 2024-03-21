"use client";
import {Treemap} from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import {
  groupBy,
  groupTooltip,
  on,
  shapeConfig,
} from "../../../utils/vizHelpers";

export default function OccupationsTmap({attrs, data, title}) {
  return (
    <VizWrapper component={this} refKey="occAliveTmapViz">
      <div className="metric-trending">
        <Treemap
          key="occAliveTmapViz"
          config={{
            title,
            total: d => (d.id ? (d.id instanceof Array ? d.id.length : 1) : 0),
            data,
            depth: 2,
            groupBy: ["domain", "industry", "occupation_name"].map(
              groupBy(attrs)
            ),
            on: on("occupation", d => d.occupation.occupation_slug),
            shapeConfig: shapeConfig(attrs),
            // time: "birthyear",
            tooltipConfig: groupTooltip(
              data,
              d => d.occupation.occupation_slug
            ),
          }}
        />
      </div>
    </VizWrapper>
  );
}
