import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Born Where?" - Name a person, guess their birth country.
 * Distractors: countries from the same continent.
 */
export default async function generateBornWhere(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation,bplace_country,hpi&bplace_country=not.is.null&hpi=gte.${minHpi}&order=hpi.desc&limit=200`,
    {},
    []
  );

  if (people.length < 4) return null;

  const shuffled = seededShuffle(people, rng);
  const subject = shuffled[0];

  if (!subject.bplace_country) return null;

  // Get country details
  const countries = await safeFetchJson(
    `${BASE_API}/country?select=id,country,continent`,
    {},
    []
  );
  const countryMap = {};
  for (const c of countries) {
    countryMap[c.id] = c;
  }

  const subjectCountry = countryMap[subject.bplace_country];
  if (!subjectCountry) return null;

  const correctCountry = subjectCountry.country;
  const continent = subjectCountry.continent;

  // Find distractor countries from same continent first
  const seen = new Set([correctCountry]);
  const distractors = [];

  for (const p of shuffled) {
    if (!p.bplace_country || p.bplace_country === subject.bplace_country) continue;
    const c = countryMap[p.bplace_country];
    if (!c || seen.has(c.country)) continue;
    if (c.continent === continent) {
      seen.add(c.country);
      distractors.push(c.country);
    }
    if (distractors.length === 3) break;
  }

  // Fill with any countries if not enough
  if (distractors.length < 3) {
    for (const p of shuffled) {
      if (!p.bplace_country) continue;
      const c = countryMap[p.bplace_country];
      if (!c || seen.has(c.country)) continue;
      seen.add(c.country);
      distractors.push(c.country);
      if (distractors.length === 3) break;
    }
  }

  if (distractors.length < 3) return null;

  const allOptions = seededShuffle([correctCountry, ...distractors], rng);
  const correctIndex = allOptions.indexOf(correctCountry);

  return {
    type: "born_where",
    questionText: `Where was ${subject.name} born?`,
    personId: subject.id,
    gender: subject.gender,
    occupation: subject.occupation,
    options: allOptions,
    correctIndex,
    explanation: `${subject.name} was born in ${correctCountry}.`,
    personName: subject.name,
    personSlug: subject.slug,
    difficulty,
  };
}
