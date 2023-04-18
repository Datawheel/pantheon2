"use client";
import { Geomap } from "d3plus-react";
import VizWrapper from "../../../common/VizWrapper";
import { groupTooltip, on } from "../../../utils/vizHelpers";

export default function PlacesMap({ place, data, title }) {
  return (
    <div>
      <Geomap
        key="geomapDeaths"
        config={{
          title: title,
          data: data,
          depth: 1,
          // fitFilter: `${country.country_num}`,
          groupBy: ["event", "place_name"],
          on: on("place", (d) => d.dplace_geonameid.slug),
          shapeConfig: {
            fill: (d) =>
              d.event.toLowerCase().indexOf("birth") > 0
                ? "rgba(76, 94, 215, 0.4)"
                : "rgba(95, 1, 22, 0.4)",
            stroke: () => "#4A4948",
            strokeWidth: 1,
            Path: {
              fill: (d) =>
                parseInt(d.id, 10) === parseInt(place.country_num, 10)
                  ? "#ccc"
                  : "transparent",
              stroke: "#4A4948",
              strokeWidth: 0.75,
            },
          },
          tooltipConfig: groupTooltip(data, (d) => d.dplace_geonameid.slug),
        }}
      />
    </div>
  );
}
