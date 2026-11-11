import {cache} from "react";
import {BASE_API, REVALIDATE_PERIODS} from "@/app/constants";
import {DEFAULT_LOCALE} from "@/app/locales";
import {encodePostgrestValue} from "@/app/utils/postgrest";
import {safeFetchArray, safeFetchArrayPaged} from "@/app/utils/safeFetch";
import {cleanPersonName} from "@/app/occupationCountryTranslations";

const CACHE = {next: {revalidate: REVALIDATE_PERIODS.DEFAULT}};
// Top-10 cards show a description; only those people need translations.
const TOP_DESCRIPTIONS = 10;

async function getOccupation(slug) {
  const rows = await safeFetchArray(
    `${BASE_API}/occupation?occupation_slug=eq.${encodePostgrestValue(slug)}&select=*`,
    CACHE,
  );
  return rows[0] || null;
}

async function getCountry(slug) {
  const rows = await safeFetchArray(
    `${BASE_API}/country?slug=eq.${encodePostgrestValue(slug)}&select=*`,
    CACHE,
  );
  return rows[0] || null;
}

async function getCountriesForOccupation(occupationId, lang) {
  return safeFetchArray(
    `${BASE_API}/occupation_country?occupation=eq.${encodePostgrestValue(occupationId)}&order=num_people.desc.nullslast&select=country,country_slug,num_people,hpi,rca,country_data:country!country(slug,country,${lang}_country:translations->${lang}->>country,${lang}_from_country:translations->${lang}->>from_country)`,
    CACHE,
  );
}

async function getOccupationsForCountry(countryId, lang) {
  return safeFetchArray(
    `${BASE_API}/occupation_country?country=eq.${encodePostgrestValue(countryId)}&order=num_people.desc.nullslast&select=occupation,occupation_slug,num_people,occupation_data:occupation!occupation(occupation_slug,occupation,domain_slug,${lang}_occupation:translations->${lang}->>occupation)`,
    CACHE,
  );
}

// Fetched in id-ordered pages to keep each fetch under Next's 2MB data-cache
// limit (US actors alone are ~7MB). The occupation row is attached in JS.
async function getPeople(occupationId, countryId, lang) {
  return safeFetchArrayPaged(
    `${BASE_API}/person?occupation=eq.${encodePostgrestValue(occupationId)}&bplace_country=eq.${encodePostgrestValue(countryId)}&order=id.asc&select=bplace_geonameid(id,place,slug),occupation_id:occupation,name,localized_name:translations->>${lang},slug,id,gender,birthyear,deathyear,alive,famous_for,description`,
    CACHE,
  );
}

async function getPeopleHpi(occupationId, countryId) {
  return safeFetchArrayPaged(
    `${BASE_API}/person_ranks?occupation=eq.${encodePostgrestValue(occupationId)}&bplace_country=eq.${encodePostgrestValue(countryId)}&order=hpi.desc.nullslast,id.asc&select=id,hpi,l,hpi_prev,l_prev`,
    CACHE,
    10000,
  );
}

// Machine-translated famous_for blurbs (core.person_famous_for, filled by
// scripts/translate-famous-for.py). Until that table exists PostgREST
// answers 404, which Next doesn't cache, so back off in-process instead of
// re-requesting and logging on every render.
const FAMOUS_FOR_BACKOFF_MS = 10 * 60 * 1000;
let famousForUnavailableUntil = 0;

async function getFamousForTranslations(personIds, lang) {
  if (lang === DEFAULT_LOCALE || !personIds.length) return new Map();
  if (Date.now() < famousForUnavailableUntil) return new Map();
  const url = `${BASE_API}/person_famous_for?lang=eq.${encodePostgrestValue(lang)}&person_id=in.(${personIds.join(",")})&select=person_id,famous_for`;
  try {
    const res = await fetch(url, CACHE);
    if (!res.ok) {
      if (res.status === 404) famousForUnavailableUntil = Date.now() + FAMOUS_FOR_BACKOFF_MS;
      else console.error(`[person_famous_for] HTTP ${res.status} for: ${url}`);
      return new Map();
    }
    const rows = await res.json();
    return new Map(Array.isArray(rows) ? rows.map(row => [row.person_id, row.famous_for]) : []);
  } catch (e) {
    console.error(`[person_famous_for] ${e.message}`);
    return new Map();
  }
}

const isLiving = p => p.alive === true && !Number.isFinite(p.deathyear);

// Year-over-year movement within this list: last edition's rank among the
// same people, from hpi_prev. People without a previous HPI weren't in the
// last edition at all and are flagged as new.
function addRankChanges(people) {
  const prevOrder = people
    .filter(p => p.hpi != null && p.hpi_prev != null)
    .sort((a, b) => b.hpi_prev - a.hpi_prev || a.id - b.id);
  const prevRank = new Map(prevOrder.map((p, i) => [p.id, i + 1]));
  for (const person of people) {
    const prev = prevRank.get(person.id);
    person.rankPrev = prev ?? null;
    person.rankDelta = prev != null ? prev - person.rank : null;
    person.isNew = person.hpi != null && person.hpi_prev == null;
    person.langDelta = person.l != null && person.l_prev != null ? person.l - person.l_prev : null;
  }
}

const MOVERS_POOL = 100;
const MOVERS_PER_LIST = 5;
const MOVERS_MIN_PEOPLE = 10;

// Biggest climbers, fallers and newcomers among the current top 100.
function pickMovers(people) {
  if (people.length < MOVERS_MIN_PEOPLE) return null;
  // Nobody moved by tracking ranks alone if the previous edition is missing.
  if (!people.some(p => p.rankPrev != null)) return null;
  const pool = people.slice(0, MOVERS_POOL);
  const climbers = pool
    .filter(p => p.rankDelta > 0)
    .sort((a, b) => b.rankDelta - a.rankDelta || a.rank - b.rank)
    .slice(0, MOVERS_PER_LIST);
  const fallers = pool
    .filter(p => p.rankDelta < 0)
    .sort((a, b) => a.rankDelta - b.rankDelta || a.rank - b.rank)
    .slice(0, MOVERS_PER_LIST);
  const newcomers = pool.filter(p => p.isNew).slice(0, MOVERS_PER_LIST);
  if (climbers.length + newcomers.length < 2) return null;
  return {climbers, fallers, newcomers};
}

// Sorted birth years without isolated bad rows: in a large group, an
// earliest year more than 1,000 years before the next one is a data error
// (a 1950-born US actor stored as born in year 3), and it would otherwise
// stretch the range and flip the era grouping to centuries.
export function birthYearRange(people) {
  const years = people.map(p => p.birthyear).filter(Number.isFinite).sort((a, b) => a - b);
  let lo = 0;
  while (years.length - lo > 20 && years[lo + 1] - years[lo] > 1000) lo++;
  return years.length ? {min: years[lo], max: years[years.length - 1]} : null;
}

// Decades when they're meaningful; centuries once the spread gets wide
// (Greek philosophers span 37 decades with one or two people in most).
export function groupByEra(people) {
  const range = birthYearRange(people);
  if (!range) return {unit: "decade", groups: []};
  const span = range.max - range.min;
  const unit = span > 250 ? "century" : "decade";
  const size = unit === "century" ? 100 : 10;

  const byKey = new Map();
  for (const person of people) {
    if (!Number.isFinite(person.birthyear)) continue;
    const start = Math.floor(person.birthyear / size) * size;
    if (!byKey.has(start)) byKey.set(start, []);
    byKey.get(start).push(person);
  }
  const groups = [...byKey.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([start, members]) => ({start, end: start + size - 1, people: members}));
  return {unit, groups};
}

function groupByBirthplace(people) {
  const byPlace = new Map();
  for (const person of people) {
    const place = person.bplace_geonameid;
    if (!place?.id || !place.place) continue;
    const entry = byPlace.get(place.id) || {...place, count: 0, people: []};
    entry.count += 1;
    entry.people.push(person);
    byPlace.set(place.id, entry);
  }
  return [...byPlace.values()].sort(
    (a, b) => b.count - a.count || (b.people[0]?.hpi || 0) - (a.people[0]?.hpi || 0),
  );
}

/**
 * Everything the occupation × country page and its metadata need, fetched
 * once per request (generateMetadata and the page share this via cache()).
 */
export const loadOccupationCountry = cache(async (occupationSlug, countrySlug, lang = DEFAULT_LOCALE) => {
  const [occupation, country] = await Promise.all([
    getOccupation(occupationSlug),
    getCountry(countrySlug),
  ]);
  if (!occupation?.id || !country?.id) return null;

  const [countries, occupationsInCountry, peopleAttrs, peopleHpi] = await Promise.all([
    getCountriesForOccupation(occupation.id, lang),
    getOccupationsForCountry(country.id, lang),
    getPeople(occupation.id, country.id, lang),
    getPeopleHpi(occupation.id, country.id),
  ]);

  // A valid occupation and country with nobody born there (astronauts from
  // Nepal) is an empty page: report it as missing so it 404s instead of
  // rendering a soft-404. Requiring both lookups to come back empty keeps a
  // single failed fetch from 404ing a real page.
  if (!peopleAttrs.length && !countries.some(row => row.country === country.id)) return null;

  const hpiById = new Map(peopleHpi.map(row => [row.id, row]));
  const people = peopleAttrs
    .map(person => ({
      ...person,
      ...hpiById.get(person.id),
      localizedName: cleanPersonName(person.localized_name, lang) || person.name,
      occupation_slug: occupation.occupation_slug,
    }))
    .sort((a, b) => (b.hpi ?? -1) - (a.hpi ?? -1))
    .map((person, i) => ({...person, rank: i + 1}));
  addRankChanges(people);

  const translated = await getFamousForTranslations(
    people.slice(0, TOP_DESCRIPTIONS).filter(p => p.famous_for).map(p => p.id),
    lang,
  );
  for (const person of people.slice(0, TOP_DESCRIPTIONS)) {
    person.famousForLocalized = lang === DEFAULT_LOCALE
      ? person.famous_for || person.description || null
      : translated.get(person.id) || null;
  }

  // Country standings for this occupation: most people first, HPI as the
  // tiebreak, matching how the old intro ranked countries.
  const standings = [...countries]
    .filter(row => row.num_people > 0)
    .sort((a, b) => b.num_people - a.num_people || (b.hpi || 0) - (a.hpi || 0));
  const rankIndex = standings.findIndex(row => row.country === country.id);
  const countryRow = rankIndex >= 0 ? standings[rankIndex] : null;
  const occTotal = occupation.num_born || standings.reduce((sum, row) => sum + row.num_people, 0);

  const range = birthYearRange(people);

  return {
    occupation,
    country,
    people,
    standings,
    occupationsInCountry: occupationsInCountry.filter(
      row => row.num_people > 0 && row.occupation !== occupation.id,
    ),
    stats: {
      count: people.length,
      occTotal,
      share: occTotal && countryRow ? countryRow.num_people / occTotal : null,
      rank: rankIndex >= 0 ? rankIndex + 1 : null,
      totalCountries: standings.length,
      rca: countryRow?.rca ?? null,
      women: people.filter(p => p.gender === "F").length,
      living: people.filter(isLiving).length,
      minYear: range?.min ?? null,
      maxYear: range?.max ?? null,
    },
    topWoman: people.find(p => p.gender === "F") || null,
    topLiving: people.find(isLiving) || null,
    birthplaces: groupByBirthplace(people),
    eras: groupByEra(people),
    movers: pickMovers(people),
  };
});

// Just what PersonImage needs to pick a fallback (occupation + gender), so
// client components don't serialize whole person rows into the RSC payload.
export const imagePerson = p => ({id: p.id, gender: p.gender, occupation_slug: p.occupation_slug});

export {isLiving};
