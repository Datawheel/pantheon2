import {nest} from "d3-collection";
import Explore from "@/features/Explore";
import {PUBLIC_API} from "@/app/constants";
import {getPlaces, getOccupations} from "./data";

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
        pageType="viz"
      />
      <div className="explore-body"></div>
    </div>
  );
}
