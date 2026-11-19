import {cache} from "react";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {safeFetchArray, safeFetchArrayPaged} from "@/app/utils/safeFetch";
import {VS_MIN_PEOPLE} from "@/components/occupation-country/vs";

export const FEATURED_MATCHUPS = [
  ["", "france", "japan"],
  ["soccer-player", "argentina", "brazil"],
  ["composer", "austria", "germany"],
  ["", "germany", "italy"],
  ["painter", "france", "italy"],
  ["architect", "russia", "switzerland"],
  ["physicist", "germany", "united-kingdom"],
  ["writer", "france", "russia"],
  ["", "argentina", "brazil"],
  ["film-director", "japan", "united-states"],
  ["tennis-player", "spain", "switzerland"],
  ["singer", "egypt", "lebanon"],
  ["philosopher", "germany", "greece"],
  ["fashion-designer", "france", "italy"],
  ["chess-player", "india", "russia"],
];

// Rotating showcase in the hero: one per domain color, plus all occupations.
export const HERO_MATCHUPS = [
  ["", "france", "japan"],
  ["soccer-player", "argentina", "brazil"],
  ["composer", "austria", "germany"],
  ["physicist", "germany", "united-kingdom"],
];

export const loadVsLanding = cache(async (locale) => {
  const options = {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}};
  const [occupations, countries, combinations] = await Promise.all([
    safeFetchArray(`${BASE_API}/occupation?select=id,occupation,occupation_slug,domain_slug,label:translations->${locale}->>occupation&order=id`, options),
    safeFetchArray(`${BASE_API}/country?select=id,country,slug,num_born,label:translations->${locale}->>country&order=id`, options),
    safeFetchArrayPaged(`${BASE_API}/occupation_country?select=occupation,country,num_people&num_people=gte.${VS_MIN_PEOPLE}&order=occupation.asc,country.asc`, options),
  ]);
  const countryMap = new Map(countries.filter(c => c.slug).map(c => [c.id, {slug: c.slug, name: c.label || c.country}]));
  const collator = new Intl.Collator(locale, {sensitivity: "base"});
  const byOccupation = new Map();
  for (const row of combinations) {
    const country = countryMap.get(row.country);
    if (!country) continue;
    if (!byOccupation.has(row.occupation)) byOccupation.set(row.occupation, []);
    byOccupation.get(row.occupation).push(country);
  }
  const fields = occupations.map(o => ({
    slug: o.occupation_slug,
    name: o.label || o.occupation,
    domain: o.domain_slug,
    countries: (byOccupation.get(o.id) || []).sort((a, b) => collator.compare(a.name, b.name)),
  })).filter(o => o.slug && o.countries.length >= 2)
    .sort((a, b) => collator.compare(a.name, b.name));
  const allCountries = countries.filter(c => c.slug && c.num_born >= VS_MIN_PEOPLE)
    .map(c => countryMap.get(c.id)).sort((a, b) => collator.compare(a.name, b.name));
  return {occupations: fields, allCountries};
});

export function getFeaturedMatchups(occupations, allCountries, list = FEATURED_MATCHUPS) {
  return list.flatMap(([slug, a, b]) => {
    const occupation = occupations.find(o => o.slug === slug);
    const eligible = slug ? occupation?.countries : allCountries;
    const countryA = eligible?.find(c => c.slug === a);
    const countryB = eligible?.find(c => c.slug === b);
    return countryA && countryB ? [{occupation, countryA, countryB}] : [];
  });
}
