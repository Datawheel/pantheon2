import {BASE_API} from "@/app/constants";
import {safeFetchJson} from "@/app/utils/safeFetch";

export async function getPlaces() {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died`;
  return await safeFetchJson(url, {}, []);
}

export async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {}, []);
}
