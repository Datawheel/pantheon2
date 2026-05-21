import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Odd One Out" - 4 people, 3 from the same country, find the outsider.
 */
export default async function generateCountrymates(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation,bplace_country,hpi&bplace_country=not.is.null&hpi=gte.${minHpi}&order=hpi.desc&limit=300`,
    {},
    []
  );

  if (people.length < 20) return null;

  // Get country names
  const countries = await safeFetchJson(
    `${BASE_API}/country?select=id,country,continent`,
    {},
    []
  );
  const countryMap = {};
  for (const c of countries) {
    countryMap[c.id] = c;
  }

  const shuffled = seededShuffle(people, rng);

  // Group by country
  const byCountry = {};
  for (const p of shuffled) {
    const countryId = p.bplace_country;
    if (!countryId || !countryMap[countryId]) continue;
    if (!byCountry[countryId]) byCountry[countryId] = [];
    byCountry[countryId].push(p);
  }

  // Find a country with at least 3 people
  let trio = null;
  let trioCountryId = null;
  for (const [countryId, group] of Object.entries(byCountry)) {
    if (group.length >= 3) {
      trio = group.slice(0, 3);
      trioCountryId = countryId;
      break;
    }
  }

  if (!trio) return null;

  const trioCountry = countryMap[trioCountryId];
  const trioContinent = trioCountry?.continent;

  // Find an outsider from a different country, preferring same continent
  let outsider = null;
  for (const p of shuffled) {
    if (p.bplace_country === trioCountryId) continue;
    const c = countryMap[p.bplace_country];
    if (c?.continent === trioContinent) {
      outsider = p;
      break;
    }
  }

  // Fallback: any different country
  if (!outsider) {
    outsider = shuffled.find((p) => p.bplace_country !== trioCountryId);
  }

  if (!outsider) return null;

  const outsiderCountry = countryMap[outsider.bplace_country];
  const displayOptions = seededShuffle([...trio, outsider], rng);
  const correctIndex = displayOptions.findIndex((o) => o.id === outsider.id);

  return {
    type: "odd_one_out",
    questionText: `Three of these people were born in ${trioCountry.country}. Who is the odd one out?`,
    imageUrl: null,
    personImages: displayOptions.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      gender: p.gender,
      occupation: p.occupation,
    })),
    options: displayOptions.map((o) => o.name),
    correctIndex,
    explanation: `${outsider.name} was born in ${outsiderCountry?.country || "a different country"}, not ${trioCountry.country}.`,
    personName: outsider.name,
    personSlug: outsider.slug,
    gender: outsider.gender,
    occupation: outsider.occupation,
    difficulty,
  };
}
