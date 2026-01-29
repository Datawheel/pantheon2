import {nest} from "d3-collection";
import Explore from "/features/Explore";
import {BASE_API} from "/app/constants";

async function getPlaces() {
  try {
    const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died`;
    console.log("[rankings] Fetching places from:", url);
    const res = await fetch(url, {cache: "no-store"});
    if (!res.ok) {
      console.error("[rankings] Places fetch failed:", res.status, res.statusText);
      throw new Error(`Places API returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("[rankings] Error fetching places:", error);
    throw error;
  }
}

async function getOccupations() {
  try {
    const url = `${BASE_API}/occupation?order=num_born.desc.nullslast`;
    console.log("[rankings] Fetching occupations from:", url);
    const res = await fetch(url, {cache: "no-store"});
    if (!res.ok) {
      console.error("[rankings] Occupations fetch failed:", res.status, res.statusText);
      throw new Error(`Occupations API returned ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("[rankings] Error fetching occupations:", error);
    throw error;
  }
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
        baseApi={BASE_API}
        places={nestedPlaces}
        occupations={occupations}
        pageType="rankings"
      />
      <div className="explore-body"></div>
    </div>
  );
}
