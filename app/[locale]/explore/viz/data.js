import {BASE_API} from "/app/constants";

export async function getPlaces() {
  const res = await fetch(
    `${BASE_API}/place?select=id,place,lat,lon,slug,country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died`
  );
  return res.json();
}

export async function getOccupations() {
  const res = await fetch(
    `${BASE_API}/occupation?order=num_born.desc.nullslast`
  );
  return res.json();
}
