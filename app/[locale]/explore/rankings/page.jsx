import {nest} from "d3-collection";
import Explore from "/features/Explore";
import {BASE_API, PUBLIC_API} from "/app/constants";
import {safeFetchJson} from "/app/utils/safeFetch";

async function getPlaces() {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died`;
  return await safeFetchJson(url, {cache: "no-store"}, []);
}

async function getOccupations() {
  const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
  return await safeFetchJson(url, {cache: "no-store"}, []);
}

export default async function Page() {
  const [places, occupations] = await Promise.all([
    getPlaces(),
    getOccupations(),
  ]);
  const nestedPlaces = nest()
    .key(d => d.country_id)
    .entries(places)
    .map(countryData => ({
      country: countryData.values[0].country,
      cities: countryData.values,
    }))
    .filter(countryData => countryData.country);

  return (
    <div className="explore">
      <Explore
        baseApi={PUBLIC_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="rankings"
      />
      <div className="explore-body"></div>
    </div>
  );
}
