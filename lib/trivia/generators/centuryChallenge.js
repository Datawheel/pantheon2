import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

function centuryLabel(year) {
  if (year <= 0) {
    const c = Math.ceil(Math.abs(year) / 100);
    return `${c}${ordinalSuffix(c)} century BC`;
  }
  const c = Math.ceil(year / 100);
  return `${c}${ordinalSuffix(c)} century`;
}

function ordinalSuffix(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function centuryNumber(year) {
  if (year <= 0) return -Math.ceil(Math.abs(year) / 100);
  return Math.ceil(year / 100);
}

/**
 * "Century Challenge" - Guess which century a person was born in.
 * Distractors: nearby centuries.
 */
export default async function generateCenturyChallenge(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation,birthyear,hpi&birthyear=not.is.null&hpi=gte.${minHpi}&order=hpi.desc&limit=200`,
    {},
    []
  );

  if (people.length < 4) return null;

  const shuffled = seededShuffle(people, rng);
  const subject = shuffled[0];

  if (subject.birthyear == null) return null;

  const correctCentury = centuryNumber(subject.birthyear);
  const correctLabel = centuryLabel(subject.birthyear);

  // Generate nearby centuries as distractors
  const offsets = [-2, -1, 1, 2, 3];
  const distractorCenturies = seededShuffle(offsets, rng)
    .map((off) => correctCentury + off)
    .filter((c) => c !== 0)
    .slice(0, 3);

  if (distractorCenturies.length < 3) return null;

  const distractorLabels = distractorCenturies.map((c) => {
    if (c < 0) {
      const abs = Math.abs(c);
      return `${abs}${ordinalSuffix(abs)} century BC`;
    }
    return `${c}${ordinalSuffix(c)} century`;
  });

  const allOptions = seededShuffle([correctLabel, ...distractorLabels], rng);
  const correctIndex = allOptions.indexOf(correctLabel);

  return {
    type: "century_challenge",
    questionText: `In which century was ${subject.name} born?`,
    personId: subject.id,
    gender: subject.gender,
    occupation: subject.occupation,
    options: allOptions,
    correctIndex,
    explanation: `${subject.name} was born in ${subject.birthyear} (${correctLabel}).`,
    personName: subject.name,
    personSlug: subject.slug,
    difficulty,
  };
}
