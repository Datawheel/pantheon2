import { Geomap } from "d3plus-react";
import { RESET } from "d3plus-common";
import { groupTooltip } from "../../utils/vizHelpers";

export default function PMap({ data }) {
  const geomapData = data
    .filter(
      (d) =>
        d.bplace_geonameid && d.bplace_geonameid.lat && d.bplace_geonameid.lon
    )
    .sort((a, b) => b.l - a.l)
    .slice(0, 1000)
    .map((d) => {
      let place_coord = d.bplace_geonameid
        ? [d.bplace_geonameid.lat, d.bplace_geonameid.lon]
        : null;
      if (place_coord && !(place_coord instanceof Array)) {
        place_coord = place_coord
          .replace("(", "")
          .replace(")", "")
          .split(",")
          .map(Number);
      }

      const newData = {
        ...d,
        event: "CITY FOR BIRTHS OF FAMOUS PEOPLE",
        borncountry: d.bplace_country
          ? d.bplace_country.country
          : d.bplace_country,
        bornplace: d.bplace_geonameid
          ? d.bplace_geonameid.place
          : d.bplace_geonameid,
        borncontinent: d.bplace_country
          ? d.bplace_country.continent
          : d.bplace_country,
        occupation_id: `${d.occupation_id}`,
        place_name: d.bplace_geonameid ? d.bplace_geonameid.place : "",
        place_coord: place_coord ? place_coord.reverse() : null,
      };

      return newData;
    });

  // console.log("geomapData", geomapData);

  return (
    <Geomap
      config={{
        data: geomapData,
        depth: 1,
        fitFilter: (d) => ["152", "643"].includes(d.id),
        groupBy: ["event", "place_name"],
        height: RESET,
        // on: on("place", d => d.place.slug),
        shapeConfig: {
          fill: (d) =>
            d.event.toLowerCase().indexOf("birth") > 0
              ? "rgba(76, 94, 215, 0.4)"
              : "rgba(95, 1, 22, 0.4)",
          stroke: () => "#4A4948",
          strokeWidth: 1,
          Path: {
            fill: "transparent",
            stroke: "#4A4948",
            strokeWidth: 0.75,
          },
        },
        tooltipConfig: groupTooltip(geomapData, (d) => d.bplace_geonameid.slug),
      }}
    />
  );
}
