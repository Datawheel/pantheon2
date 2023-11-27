import { nest } from "d3-collection";
import Explore from "../../../features/Explore";

async function getPlaces() {
  const res = await fetch(
    "https://api.pantheon.world/place?select=id,place,lat,lon,slug,country:country_fk(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died"
  );
  return res.json();
}

async function getOccupations() {
  const res = await fetch(
    "https://api.pantheon.world/occupation?order=num_born.desc.nullslast"
  );
  return res.json();
}

export default async function Page() {
  let [places, occupations] = await Promise.all([
    getPlaces(),
    getOccupations(),
  ]);
  places = nest()
    .key((d) => d.country_id)
    .entries(places)
    .map((countryData) => ({
      country: countryData.values[0].country,
      cities: countryData.values,
    }))
    .filter((countryData) => countryData.country);

  return (
    <div className="explore">
      <Explore places={places} occupations={occupations} pageType="viz" />
      <div className="explore-body"></div>
    </div>
  );
}
