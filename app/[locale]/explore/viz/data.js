import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchJson} from "@/app/utils/safeFetch";

export async function getPlaces(locale) {
  const url = `${BASE_API}/place?select=id,place,lat,lon,slug,country:country(id,country,localized_country:translations->${locale}->>country,slug,country_num,country_code,continent,region),country_id:country,num_born,num_died&num_born=gte.5`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
}

export async function getOccupations(locale) {
  const url = `${BASE_API}/occupation?select=id,occupation,localized_occupation:translations->${locale}->>occupation,industry,localized_industry:translations->${locale}->>industry,domain,localized_domain:translations->${locale}->>domain,group,num_born,num_born_men,num_born_women,hpi,l,occupation_slug,industry_slug,domain_slug,group_slug,hpi_avg&order=num_born.desc.nullslast`;
  return await safeFetchJson(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.LONG}},
    [],
  );
}
