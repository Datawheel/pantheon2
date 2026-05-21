import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 25, hard: 10};

/**
 * "More Famous?" - Which of these 4 people has the highest HPI?
 */
export default async function generateMoreFamous(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 25;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation,birthyear,hpi&hpi=gte.${minHpi}&order=hpi.desc&limit=300`,
    {},
    []
  );

  if (people.length < 20) return null;

  const shuffled = seededShuffle(people, rng);
  const candidates = shuffled.slice(0, 20);

  const withHpi = candidates.filter((p) => p.hpi != null);

  if (withHpi.length < 4) return null;

  // Pick 4 with meaningfully different HPI scores
  const sorted = [...withHpi].sort((a, b) => b.hpi - a.hpi);
  const picks = [sorted[0]];
  for (const p of sorted.slice(1)) {
    if (picks.length >= 4) break;
    if (picks.every((pick) => Math.abs(pick.hpi - p.hpi) >= 1)) {
      picks.push(p);
    }
  }

  if (picks.length < 4) return null;

  const mostFamous = picks.reduce((a, b) => (a.hpi > b.hpi ? a : b));
  const displayOptions = seededShuffle(picks, rng);
  const correctIndex = displayOptions.findIndex((o) => o.id === mostFamous.id);

  return {
    type: "more_famous",
    questionText: "Which of these people has the highest Historical Popularity Index (HPI)?",
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
    explanation: `${mostFamous.name} has the highest HPI score of ${mostFamous.hpi.toFixed(1)}.`,
    personName: mostFamous.name,
    personSlug: mostFamous.slug,
    gender: mostFamous.gender,
    occupation: mostFamous.occupation,
    difficulty,
  };
}
