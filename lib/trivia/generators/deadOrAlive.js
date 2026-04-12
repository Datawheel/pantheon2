import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Dead or Alive?" - Is this person alive? If dead, guess the decade they died.
 */
export default async function generateDeadOrAlive(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  // Get people born after 1850 from person_ranks (which has deathyear, birthyear)
  const ranked = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,birthyear,deathyear&birthyear=gte.1850&hpi=gte.${minHpi}&order=hpi.desc&limit=100`,
    {},
    []
  );

  if (ranked.length < 4) return null;

  // Get alive status from person table for a small batch
  const shuffled = seededShuffle(ranked, rng);
  const candidateIds = shuffled.slice(0, 30).map((p) => p.id).join(",");

  const personDetails = await safeFetchJson(
    `${BASE_API}/person?select=id,alive&id=in.(${candidateIds})`,
    {},
    []
  );

  const aliveMap = {};
  for (const p of personDetails) {
    aliveMap[p.id] = p.alive;
  }

  // Merge alive status
  const candidates = shuffled.slice(0, 30).map((p) => ({
    ...p,
    alive: aliveMap[p.id],
  }));

  if (candidates.length < 4) return null;

  const subject = candidates[0];
  const isAlive = subject.alive === true || subject.alive === "true" || subject.alive === "TRUE";

  if (isAlive) {
    const allOptions = seededShuffle(["Still alive", "Deceased"], rng);
    const correctIndex = allOptions.indexOf("Still alive");

    return {
      type: "dead_or_alive",
      questionText: `Is ${subject.name} (born ${subject.birthyear}) still alive?`,
      personId: subject.id,
      options: allOptions,
      correctIndex,
      explanation: `${subject.name} is still alive.`,
      personName: subject.name,
      personSlug: subject.slug,
      difficulty,
    };
  }

  // Dead - guess the decade they died
  if (subject.deathyear == null) return null;

  const correctDecade = Math.floor(subject.deathyear / 10) * 10;
  const correctLabel = `${correctDecade}s`;

  const offsets = [-30, -20, -10, 10, 20, 30];
  const distractors = seededShuffle(offsets, rng)
    .map((off) => correctDecade + off)
    .filter((d) => d >= 1800 && d <= 2020)
    .slice(0, 3);

  if (distractors.length < 3) {
    const allOptions = seededShuffle(["Still alive", "Deceased"], rng);
    const correctIndex = allOptions.indexOf("Deceased");

    return {
      type: "dead_or_alive",
      questionText: `Is ${subject.name} (born ${subject.birthyear}) still alive?`,
      personId: subject.id,
      options: allOptions,
      correctIndex,
      explanation: `${subject.name} died in ${subject.deathyear}.`,
      personName: subject.name,
      personSlug: subject.slug,
      difficulty,
    };
  }

  const distractorLabels = distractors.map((d) => `${d}s`);
  const allOptions = seededShuffle([correctLabel, ...distractorLabels], rng);
  const correctIndex = allOptions.indexOf(correctLabel);

  return {
    type: "dead_or_alive",
    questionText: `In which decade did ${subject.name} die?`,
    personId: subject.id,
    options: allOptions,
    correctIndex,
    explanation: `${subject.name} died in ${subject.deathyear} (${correctLabel}).`,
    personName: subject.name,
    personSlug: subject.slug,
    difficulty,
  };
}
