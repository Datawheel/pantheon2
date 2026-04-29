"use client";
import PeopleLocationsMap from "../../../common/PeopleLocationsMap";

export default function PlacesMap({
  country,
  data,
  title,
  bubbleFill,
  bubbleBorder,
  bubbleHoverFill,
}) {
  return (
    <PeopleLocationsMap
      countryNum={country?.country_num ?? null}
      data={data}
      title={title}
      bubbleFill={bubbleFill}
      bubbleBorder={bubbleBorder}
      bubbleHoverFill={bubbleHoverFill}
    />
  );
}
