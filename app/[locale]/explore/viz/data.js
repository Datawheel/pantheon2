import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchJson} from "@/app/utils/safeFetch";

export async function getPlaces() {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died&num_born=gte.5`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
}

export async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
}
