import PlacesMap from "./vizes/PlacesMap";
import SectionLayout from "../../common/SectionLayout";

export default function Places({place, peopleBorn, peopleDied, slug, title}) {
  const tmapBornData = peopleBorn
    .filter(p => p.deathyear !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      event: "CITY OF DEATHS OF FAMOUS PEOPLE",
      place: d.dplace_geonameid,
    }));

  const geomapBornData = tmapBornData
    .filter(
      d =>
        d.dplace_geonameid && d.dplace_geonameid.lat && d.dplace_geonameid.lon
    )
    .sort((a, b) => b.l - a.l)
    .slice(0, 100);
  geomapBornData.forEach(d => {
    d.place_name = d.dplace_geonameid.place;
    d.place_coord = [d.dplace_geonameid.lat, d.dplace_geonameid.lon];
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",")
        .map(Number);
    }
    d.place_coord.reverse();
  });

  const tmapDeathData = peopleDied
    .filter(p => p.deathyear !== null)
    .sort((a, b) => b.l - a.l)
    .map(d => ({
      ...d,
      event: "CITY FOR BIRTHS OF FAMOUS PEOPLE",
      place: d.bplace_geonameid,
    }));
  // console.log("tmapDeathData!", tmapDeathData.length);
  const geomapDeathData = tmapDeathData
    .filter(d => d.place && d.place.lat && d.place.lon)
    .sort((a, b) => b.l - a.l)
    .slice(0, 100);
  geomapDeathData.forEach(d => {
    d.place_name = d.place.place;
    d.place_coord = [d.place.lat, d.place.lon];
    if (!(d.place_coord instanceof Array)) {
      d.place_coord = d.place_coord
        .replace("(", "")
        .replace(")", "")
        .split(",")
        .map(Number);
    }
    d.place_coord.reverse();
  });
  return (
    <SectionLayout slug={slug} title={title}>
      <PlacesMap
        place={place}
        data={geomapBornData}
        title={`Death places for people born in ${place.place}`}
      />
      <PlacesMap
        place={place}
        data={geomapDeathData}
        title={`Birth places for people deceased in ${place.place}`}
      />
    </SectionLayout>
  );
}
