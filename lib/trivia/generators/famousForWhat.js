import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Famous For What?" - Show name + description, guess occupation.
 * Distractors: other occupations from same domain.
 */
export default async function generateFamousForWhat(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  // First get top people by HPI from person_ranks
  const topPeople = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug&hpi=gte.${minHpi}&order=hpi.desc&limit=100`,
    {},
    []
  );

  if (topPeople.length < 10) return null;

  // Pick a subset and fetch their details from person table (famous_for + occupation join)
  const shuffled = seededShuffle(topPeople, rng);
  const candidateIds = shuffled.slice(0, 30).map((p) => p.id).join(",");

  const people = await safeFetchJson(
    `${BASE_API}/person?select=id,name,slug,gender,occupation,famous_for,description,occupation(id,occupation,occupation_slug,domain)&id=in.(${candidateIds})&famous_for=not.is.null`,
    {},
    []
  );

  if (people.length < 4) return null;

  const shuffledPeople = seededShuffle(people, rng);
  const subject = shuffledPeople[0];

  if (!subject.occupation?.occupation) return null;

  // Get distractors: different occupations
  const seen = new Set([subject.occupation.occupation]);
  const distractors = [];

  for (const p of shuffledPeople.slice(1)) {
    if (!p.occupation?.occupation || seen.has(p.occupation.occupation)) continue;
    seen.add(p.occupation.occupation);
    distractors.push(p.occupation.occupation);
    if (distractors.length === 3) break;
  }

  if (distractors.length < 3) return null;

  const correctOcc = subject.occupation.occupation;
  const allOptions = seededShuffle([correctOcc, ...distractors], rng);
  const correctIndex = allOptions.indexOf(correctOcc);

  let clue = subject.famous_for || subject.description || "";
  // Strip leading name to avoid "Name: Name was a..."
  if (clue.toLowerCase().startsWith(subject.name.toLowerCase())) {
    clue = clue.slice(subject.name.length).replace(/^\s*(was|is)\s+/i, "Was ");
  }

  return {
    type: "famous_for_what",
    questionText: `${subject.name}: "${clue}" — What was their occupation?`,
    personId: subject.id,
    options: allOptions.map((o) => o.charAt(0).toUpperCase() + o.slice(1).toLowerCase()),
    correctIndex,
    explanation: `${subject.name} was a ${correctOcc.toLowerCase()}.`,
    personName: subject.name,
    personSlug: subject.slug,
    gender: subject.gender,
    occupation: subject.occupation,
    difficulty,
  };
}
