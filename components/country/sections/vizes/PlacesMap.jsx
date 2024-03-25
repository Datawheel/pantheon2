"use client";
import {Geomap} from "d3plus-react";
// import VizWrapper from "../../../common/VizWrapper";
import {groupTooltip, on} from "../../../utils/vizHelpers";

export default function PlacesMap({country, data, title}) {
  return (
    <div>
      <Geomap
        key="geomapDeaths"
        config={{
          title,
          data,
          depth: 1,
          fitFilter: country ? `${country.country_num}` : null,
          groupBy: ["event", "place_name"],
          on: on("place", d => d.place.slug),
          shapeConfig: {
            fill: d =>
              d.event.toLowerCase().indexOf("birth") > 0
                ? "rgba(76, 94, 215, 0.4)"
                : "rgba(95, 1, 22, 0.4)",
            stroke: () => "#4A4948",
            strokeWidth: 1,
            Path: {
              fill: d =>
                country &&
                parseInt(d.id, 10) === parseInt(country.country_num, 10)
                  ? "#ccc"
                  : "transparent",
              stroke: "#4A4948",
              strokeWidth: 0.75,
            },
          },
          tooltipConfig: groupTooltip(data, d => d.place.slug),
        }}
      />
    </div>
  );
}
