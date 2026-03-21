import {safeFetchJson} from "/app/utils/safeFetch";
import {BASE_API} from "/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Who Came First?" - 4 people from same occupation, guess who was born earliest.
 */
export default async function generateWhoCameFirst(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,birthyear,occupation,hpi&birthyear=not.is.null&hpi=gte.${minHpi}&order=hpi.desc&limit=300`,
    {},
    []
  );

  if (people.length < 20) return null;

  const shuffled = seededShuffle(people, rng);

  // Group by occupation
  const byOcc = {};
  for (const p of shuffled) {
    const occ = p.occupation;
    if (!occ) continue;
    if (!byOcc[occ]) byOcc[occ] = [];
    byOcc[occ].push(p);
  }

  // Find an occupation with at least 4 people with different birth years
  let chosen = null;
  for (const [occ, group] of Object.entries(byOcc)) {
    const uniqueYears = new Set(group.map((p) => p.birthyear));
    if (uniqueYears.size >= 4) {
      const seen = new Set();
      const picks = [];
      for (const p of group) {
        if (!seen.has(p.birthyear)) {
          seen.add(p.birthyear);
          picks.push(p);
        }
        if (picks.length === 4) break;
      }
      if (picks.length === 4) {
        chosen = {occ, picks};
        break;
      }
    }
  }

  if (!chosen) return null;

  const {occ, picks} = chosen;
  const oldest = picks.reduce((a, b) => (a.birthyear < b.birthyear ? a : b));
  const displayOptions = seededShuffle(picks, rng);
  const correctIndex = displayOptions.findIndex((o) => o.id === oldest.id);

  const occLabel = typeof occ === "string" ? occ.charAt(0) + occ.slice(1).toLowerCase() : "person";

  return {
    type: "who_came_first",
    questionText: `Which ${occLabel} was born first?`,
    imageUrl: null,
    personImages: displayOptions.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
    })),
    options: displayOptions.map((o) => o.name),
    correctIndex,
    explanation: `${oldest.name} was born in ${oldest.birthyear}, making them the earliest.`,
    personName: oldest.name,
    personSlug: oldest.slug,
    difficulty,
  };
}
