import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {VS_MIN_PEOPLE, vsPath} from "@/components/occupation-country/vs";

export const PAIRS_PER_SITEMAP = 25000;

export async function occupationGroups() {
  const groups = new Map();
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const params = new URLSearchParams({
      select: "occupation_slug,country_slug", num_people: `gte.${VS_MIN_PEOPLE}`,
      occupation_slug: "not.is.null", country_slug: "not.is.null",
      order: "occupation_slug,country_slug", limit, offset,
    });
    const response = await fetch(`${BASE_API}/occupation_country?${params}`, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}});
    if (!response.ok) throw new Error(`Comparison sitemap source returned ${response.status}`);
    const rows = await response.json();
    for (const {occupation_slug: occupation, country_slug: country} of rows) {
      if (!groups.has(occupation)) groups.set(occupation, []);
      groups.get(occupation).push(country);
    }
    if (rows.length < limit) return groups;
  }
}

export function pairCount(countries) {
  return countries.length * (countries.length - 1) / 2;
}

export function* occupationPairPaths(groups, page) {
  let offset = 0;
  const start = page * PAIRS_PER_SITEMAP;
  const end = start + PAIRS_PER_SITEMAP;
  for (const [occupation, countries] of groups) {
    if (offset + pairCount(countries) <= start) {
      offset += pairCount(countries);
      continue;
    }
    for (let i = 0; i < countries.length; i++) {
      for (let j = i + 1; j < countries.length; j++) {
        if (offset >= end) return;
        if (offset >= start) yield vsPath(occupation, countries[i], countries[j]);
        offset++;
      }
    }
  }
}
