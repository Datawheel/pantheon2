import {placeDistribution} from "./distribution";
import {getLocalizedPlaceNameMap} from "@/app/utils/locationLocalization";
import {cache} from "react";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {formatDecimal, formatNumber, formatShare, cleanPersonName, englishCountry, occupationPluralFor} from "@/app/occupationCountryTranslations";
import {formatPair, getVsStrings} from "@/app/occupationCountryVsTranslations";
import {VS_MIN_PEOPLE, pickRivals, vsPath} from "@/components/occupation-country/vs";
import {countryPortraitIds} from "@/components/occupation-country/vs/portraits";

async function rows(table, params) {
  const url = `${BASE_API}/${table}?${new URLSearchParams(params)}`;
  const response = await fetch(url, {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}});
  if (!response.ok) throw new Error(`Country comparison: ${table} returned ${response.status}`);
  return response.json();
}

export const countryCatalog = cache(locale => rows("country", {
  select: `id,country,slug,num_born,born_rank_unique,label:translations->${locale}->>country,inCountry:translations->${locale}->>in_country`,
  order: "slug",
}));

const loadGeography = cache(async (countryId, slug) => {
  const places = [];
  const limit = 1000;
  for (let offset = 0; ; offset += limit) {
    const page = await rows("place", {
      country: `eq.${countryId}`, or: "(num_born.gt.0,num_died.gt.0)",
      select: "id,slug,place,num_born,num_died", order: "id", offset, limit,
    });
    places.push(...page);
    if (page.length < limit) break;
  }
  return {
    births: placeDistribution(places, "num_born", slug),
    deaths: placeDistribution(places, "num_died", slug),
  };
});

// Names listed under each occupation in the rankings.
const OCCUPATION_LEADERS = 3;

// The rows each occupation ranking shows. Shared with CountryAnalysis so
// names are only fetched for occupations that appear on the page.
export function rankOccupations(fields, metric, limit = 5) {
  return fields.filter(row => Number.isFinite(row[metric]))
    .sort((a, b) => b[metric] - a[metric] || b.num_people - a.num_people || a.occupation_slug.localeCompare(b.occupation_slug))
    .slice(0, limit);
}

const loadSide = cache(async (countryId, slug, locale) => {
  const [ranks, fields, leaders] = await Promise.all([rows("person_ranks", {
    select: "id,hpi", "bplace_country": `eq.${countryId}`, hpi: "not.is.null",
    order: "hpi.desc,id.asc", limit: 10,
  }), rows("occupation_country", {
    country: `eq.${countryId}`,
    select: `occupation,occupation_slug,num_people,num_people_country,rca,info:occupation!occupation(occupation,domain_slug,label:translations->${locale}->>occupation)`,
    order: "num_people.desc,occupation_slug",
  }), rows("person_ranks", {
    // Top people in every occupation at once: ~35KB for the largest countries.
    select: "id,occupation", "bplace_country": `eq.${countryId}`,
    "bplace_country_occupation_rank_unique": `lte.${OCCUPATION_LEADERS}`,
    order: "bplace_country_occupation_rank_unique,id",
  })]);
  const shown = new Set(["num_people", "rca"].flatMap(metric => rankOccupations(fields, metric)).map(row => row.occupation));
  const leaderIds = leaders.filter(p => shown.has(p.occupation)).map(p => p.id);
  const cutouts = countryPortraitIds(slug);
  const ids = [...new Set([...ranks.map(row => row.id), ...cutouts, ...leaderIds])];
  if (!ids.length) return {people: [], portraits: [], fields};
  const profiles = await rows("person", {
    select: `id,name,slug,birthyear,deathyear,alive,gender,occupation(occupation_slug),label:translations->>${locale}`,
    "bplace_country": `eq.${countryId}`, id: `in.(${ids.join(",")})`,
  });
  const byId = new Map(profiles.map(p => [p.id, {
    ...p,
    localizedName: cleanPersonName(p.label || p.name, locale),
    "occupation_slug": p.occupation?.occupation_slug,
  }]));
  // Map.groupBy needs Node 21; production runs Node 20.
  const leadersByOccupation = new Map();
  for (const p of leaders) {
    if (shown.has(p.occupation) && byId.has(p.id)) leadersByOccupation.set(p.occupation, [...leadersByOccupation.get(p.occupation) || [], byId.get(p.id)]);
  }
  const people = ranks.filter(p => byId.has(p.id)).map(p => ({...byId.get(p.id), hpi: p.hpi}));
  const portraits = [...new Set([...cutouts, ...people.map(p => p.id)])]
    .filter(id => byId.has(id)).slice(0, 3).map(id => ({...byId.get(id), cutout: cutouts.includes(id)}));
  return {people, portraits, fields: fields.map(row => ({
    ...row,
    leaders: leadersByOccupation.get(row.occupation) || [],
  }))};
});

export const countryComparison = cache(async (slugA, slugB, locale) => {
  const catalog = await countryCatalog(locale);
  const countries = [slugA, slugB].map(slug => catalog.find(c => c.slug === slug && c.num_born >= VS_MIN_PEOPLE));
  if (countries.some(c => !c)) return null;
  const sides = await Promise.all(countries.map(async c => ({
    ...await loadSide(c.id, c.slug, locale),
    country: c, label: c.label || c.country,
    inCountry: locale === "en" ? `in ${englishCountry(c.country)}` : c.inCountry,
    count: formatNumber(c.num_born, locale), path: `/profile/country/${c.slug}`,
  })));
  const [a, b] = sides;
  const vs = getVsStrings(locale);
  const total = catalog.reduce((sum, c) => sum + (c.num_born || 0), 0);
  const metrics = [
    [vs.rowCount, side => side.country.num_born, formatNumber],
    [vs.rowRank, side => side.country.born_rank_unique, formatNumber],
    [vs.rowShare, side => side.country.num_born / total, formatShare],
    [vs.rowAvg, side => side.people.length ? side.people.reduce((sum, p) => sum + p.hpi, 0) / side.people.length : null, formatDecimal],
    [vs.rowTop, side => side.people[0]?.hpi, formatDecimal],
  ];
  const scoreRows = metrics.map(([label, value, format]) => {
    const first = value(a);
    const second = value(b);
    const cell = (n, side) => ({
      text: Number.isFinite(n) ? format(n, locale) : "—",
      person: label === vs.rowTop ? side.people[0] : null,
    });
    const comparable = Number.isFinite(first) && Number.isFinite(second);
    const bar = comparable && label !== vs.rowRank && Math.max(first, second) > 0;
    const higherWins = label !== vs.rowRank;
    return {key: label, label, a: cell(first, a), b: cell(second, b), bar,
      widthA: bar ? 100 * first / Math.max(first, second) : 0,
      widthB: bar ? 100 * second / Math.max(first, second) : 0,
      winner: comparable && first !== second ? ((first > second) === higherWins ? "a" : "b") : null};
  });
  const matchups = Array.from({length: Math.max(a.people.length, b.people.length)}, (_, i) => {
    const first = a.people[i], second = b.people[i];
    return {rank: i + 1, a: first, b: second,
      winner: first && second && first.hpi !== second.hpi ? (first.hpi > second.hpi ? "a" : "b") : null};
  });
  const countsB = new Map(b.fields.map(row => [row.occupation_slug, row.num_people]));
  const sharedFields = a.fields.filter(row => row.num_people >= VS_MIN_PEOPLE && countsB.get(row.occupation_slug) >= VS_MIN_PEOPLE)
    .map(row => ({
      slug: row.occupation_slug,
      label: occupationPluralFor(row.occupation_slug, row.info?.label || row.info?.occupation, locale),
      domain: row.info?.domain_slug,
      counts: [row.num_people, countsB.get(row.occupation_slug)],
      count: Math.min(row.num_people, countsB.get(row.occupation_slug)),
    }))
    .sort((x, y) => y.count - x.count).slice(0, 12);
  // Other countries to compare each side with: the largest by number of
  // people plus each side's neighbors in that ranking (see pickRivals).
  const standings = catalog.filter(c => c.num_born >= VS_MIN_PEOPLE)
    .map(c => ({country: c.id, "country_slug": c.slug, "num_people": c.num_born, name: c.label || c.country}))
    .sort((x, y) => y.num_people - x.num_people);
  const rivals = (side, other) => pickRivals(standings, side.country.id, {exclude: [other.country.id], max: 6})
    .map(row => ({key: row.country, href: vsPath(null, side.country.slug, row.country_slug), opponent: row.name}));
  return {sides, sharedFields, rivalsA: rivals(a, b), rivalsB: rivals(b, a), pair: formatPair(a.label, b.label, locale), namesA: {country: a.label},
    namesB: {country: b.label}, rows: scoreRows, matchups};
});

export async function comparisonGeography(sides, locale) {
  const summaries = await Promise.all(sides.map(side => loadGeography(side.country.id, side.country.slug)));
  const names = await getLocalizedPlaceNameMap(summaries.flatMap(s => [...s.births.top, ...s.deaths.top]), locale);
  return summaries.map(s => Object.fromEntries(Object.entries(s).map(([event, distribution]) =>
    [event, {...distribution, top: distribution.top.map(p => ({...p, name: names.get(String(p.id)) || p.name}))}]
  )));
}
