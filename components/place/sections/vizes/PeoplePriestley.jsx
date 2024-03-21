"use client";
import {Priestley} from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import {
  groupBy,
  peopleTooltip,
  on,
  shapeConfig,
} from "../../../utils/vizHelpers";

export default function PeoplePriestley({attrs, data, title}) {
  return (
    <VizWrapper component={this} refKey="lifespansViz">
      <Priestley
        title={title}
        key="priestley1"
        config={{
          data,
          depth: 1,
          detectVisible: false,
          end: "deathyear",
          groupBy: ["domain", "name"].map(groupBy(attrs)),
          height: 700,
          legendConfig: {
            label: d => d.occupation.domain,
          },
          on: on("person", d => d.slug),
          start: "birthyear",
          shapeConfig: Object.assign({}, shapeConfig(attrs), {
            labelPadding: 2,
          }),
          tooltipConfig: peopleTooltip,
        }}
      />
    </VizWrapper>
  );
}
