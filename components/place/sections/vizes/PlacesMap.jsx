"use client";
import PeopleLocationsMap from "../../../common/PeopleLocationsMap";

export default function PlacesMap({
  place,
  data,
  title,
  bubbleFill,
  bubbleBorder,
  bubbleHoverFill,
}) {
  return (
    <PeopleLocationsMap
      countryNum={place?.country_num ?? null}
      data={data}
      title={title}
      bubbleFill={bubbleFill}
      bubbleBorder={bubbleBorder}
      bubbleHoverFill={bubbleHoverFill}
    />
  );
}
