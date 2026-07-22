import PlacesMap from "./vizes/PlacesMap";
import SectionLayout from "../../common/SectionLayout";
import {getLocationTranslations} from "@/app/locationTranslations";

function hasCoord(value) {
  return value !== null && value !== undefined && value !== "";
}

function normalizeMapPoint(d, place) {
  const lat = place?.lat;
  const lon = place?.lon;

  d.place_name = place?.place;
  d.lat = hasCoord(lat) ? Number(lat) : null;
  d.lon = hasCoord(lon) ? Number(lon) : null;
  d.place_coord =
    d.lat !== null && d.lon !== null ? [d.lon, d.lat] : null;
}

export default function Places({
  country,
  peopleBorn,
  peopleDied,
  slug,
  title,
  lang = "en",
}) {
  const t = getLocationTranslations(lang);
  const safePeopleBorn = peopleBorn || [];
  const safePeopleDied = peopleDied || [];

  const tmapBornData = safePeopleBorn
    .filter(p => p.birthyear !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({...d, place: d.bplace_geonameid}));

  const geomapBornData = tmapBornData
    .filter(d => d.place && hasCoord(d.place.lat) && hasCoord(d.place.lon))
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapBornData.forEach(d => {
    normalizeMapPoint(d, d.place);
  });

  const tmapDeathData = safePeopleDied
    .filter(p => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({...d, place: d.dplace_geonameid}));

  const geomapDeathData = tmapDeathData
    .filter(
      d =>
        d.place &&
        hasCoord(d.place.lat) &&
        hasCoord(d.place.lon) &&
        d.occupation !== null
    )
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapDeathData.forEach(d => {
    normalizeMapPoint(d, d.place);
  });

  return (
    <SectionLayout slug={slug} title={title}>
      <PlacesMap
        country={country}
        data={geomapDeathData}
        title={t("citiesDeathsTitle", {location: country.country})}
      />
      <PlacesMap
        country={country}
        data={geomapBornData}
        title={t("citiesBirthsTitle", {location: country.country})}
        bubbleFill="rgba(105, 123, 232, 0.42)"
        bubbleBorder="rgba(72, 89, 201, 0.82)"
        bubbleHoverFill="rgba(105, 123, 232, 0.64)"
      />
    </SectionLayout>
  );
}
