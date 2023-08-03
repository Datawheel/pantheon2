import { nest } from "d3-collection";
import { plural } from "pluralize";
import PlacesMap from "../../country/sections/vizes/PlacesMap";
import AnchorList from "../../utils/AnchorList";
import { toTitleCase } from "../../utils/vizHelpers";
import SectionLayout from "../../common/SectionLayout";

export default function Places({ era, peopleBorn, peopleDied, slug, title }) {
  const tmapBornData = peopleBorn
    .filter((p) => p.birthyear !== null)
    .sort((a, b) => b.l - a.l);

  tmapBornData.forEach((d) => {
    d.event = "CITY FOR BIRTHS OF FAMOUS PEOPLE";
    d.bplace = d.bplace_geonameid;
  });

  const geomapBornData = tmapBornData
    .filter((d) => d.bplace && d.bplace.lat && d.bplace.lon)
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapBornData.forEach((d) => {
    d.place_name = d.bplace.place;
    d.place_coord = [d.bplace.lat, d.bplace.lon];
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
    .filter((p) => p.deathyear !== null && p.occupation !== null)
    .sort((a, b) => b.l - a.l);

  tmapDeathData.forEach((d) => {
    d.event = "CITY FOR DEATHS OF FAMOUS PEOPLE";
    d.place = d.dplace_geonameid;
  });

  const geomapDeathData = tmapDeathData
    .filter(
      (d) => d.place && d.place.lat && d.place.lon && d.occupation !== null
    )
    .sort((a, b) => b.l - a.l)
    .slice(0, 500);
  geomapDeathData.forEach((d) => {
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
        data={geomapDeathData}
        title={`Major Cities in ${era.name} for Deaths of Cultural Celebrities`}
      />
      <PlacesMap
        data={geomapBornData}
        title={`Major Cities in ${era.name} for Births of Cultural Celebrities`}
      />
    </SectionLayout>
  );
}
