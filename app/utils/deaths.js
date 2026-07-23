import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {DEFAULT_LOCALE, SUPPORTED_LOCALES} from "@/app/locales";
import {
  getLocalizedPlaceNameMap,
  localizePersonPlaces,
} from "@/app/utils/locationLocalization";
import {safeFetchArray, safeFetchFirst} from "@/app/utils/safeFetch";

export function normalizeDeathsLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

function localizePeople(people) {
  return people.map(person => ({
    ...person,
    name: person.localized_name || person.name,
    bplace_country: person.bplace_country
      ? {
          ...person.bplace_country,
          country:
            person.bplace_country.localized_country
            || person.bplace_country.country,
        }
      : person.bplace_country,
    dplace_country: person.dplace_country
      ? {
          ...person.dplace_country,
          country:
            person.dplace_country.localized_country
            || person.dplace_country.country,
        }
      : person.dplace_country,
    occupation: person.occupation
      ? {
          ...person.occupation,
          englishOccupation: person.occupation.occupation,
          englishDomain: person.occupation.domain,
          occupation:
            person.occupation.localized_occupation
            || person.occupation.occupation,
          industry:
            person.occupation.localized_industry
            || person.occupation.industry,
          domain:
            person.occupation.localized_domain
            || person.occupation.domain,
        }
      : person.occupation,
  }));
}

export async function getDeathsPeople(yearNum, requestedLocale) {
  const locale = normalizeDeathsLocale(requestedLocale);
  const peopleUrl = `${BASE_API}/person?alive=is.false&deathdate=gte.01-01-${yearNum}&deathdate=lte.12-31-${yearNum}&select=bplace_country(id,country,localized_country:translations->${locale}->>country,slug),dplace_country(id,country,localized_country:translations->${locale}->>country,slug),dplace_geonameid(id,place,slug,lat,lon),occupation(id,occupation,localized_occupation:translations->${locale}->>occupation,occupation_slug,domain_slug,industry,localized_industry:translations->${locale}->>industry,domain,localized_domain:translations->${locale}->>domain),occupation_id:occupation,name,localized_name:translations->>${locale},slug,id,gender,birthyear,birthdate,deathyear,deathdate,alive&order=deathdate.asc`;
  const hpiUrl = `${BASE_API}/person_ranks?deathyear=eq.${yearNum}&select=id,hpi,hpi_prev,non_en_page_views`;
  const [people, ranks] = await Promise.all([
    safeFetchArray(peopleUrl, {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }),
    safeFetchArray(hpiUrl, {
      next: {revalidate: REVALIDATE_PERIODS.DEFAULT},
    }),
  ]);
  const rankById = new Map(ranks.map(rank => [`${rank.id}`, rank]));
  let localizedPeople = localizePeople(people).map(person => ({
    ...person,
    ...(rankById.get(`${person.id}`) || {}),
  }));
  const localizedPlaceNames = await getLocalizedPlaceNameMap(
    localizedPeople.map(person => person.dplace_geonameid),
    locale,
  );
  localizedPeople = localizePersonPlaces(
    localizedPeople,
    localizedPlaceNames,
  );
  return localizedPeople;
}

export async function getDeathsOccupation(slug, requestedLocale) {
  const locale = normalizeDeathsLocale(requestedLocale);
  const url = `${BASE_API}/occupation?occupation_slug=eq.${encodeURIComponent(slug)}&select=*,localized_occupation:translations->${locale}->>occupation,localized_industry:translations->${locale}->>industry,localized_domain:translations->${locale}->>domain`;
  const occupation = await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
  if (!occupation?.id) return occupation;
  return {
    ...occupation,
    englishOccupation: occupation.occupation,
    englishDomain: occupation.domain,
    occupation: occupation.localized_occupation || occupation.occupation,
    industry: occupation.localized_industry || occupation.industry,
    domain: occupation.localized_domain || occupation.domain,
  };
}

export async function getDeathsCountry(slug, requestedLocale) {
  const locale = normalizeDeathsLocale(requestedLocale);
  const url = `${BASE_API}/country?slug=eq.${encodeURIComponent(slug)}&select=*,localized_country:translations->${locale}->>country,localized_demonym:translations->${locale}->>demonym`;
  const country = await safeFetchFirst(
    url,
    {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}},
    {},
  );
  if (!country?.id) return country;
  return {
    ...country,
    englishCountry: country.country,
    country: country.localized_country || country.country,
    demonym: country.localized_demonym || country.demonym,
  };
}
