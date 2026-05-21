import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

const DIFFICULTY_HPI = {easy: 50, medium: 30, hard: 15};

/**
 * "Who Am I?" - Show a photo, guess the person's name.
 * Distractors: same occupation, similar era.
 */
export default async function generateWhoAmI(rng, difficulty = "medium") {
  const minHpi = DIFFICULTY_HPI[difficulty] || 30;

  const people = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation,birthyear,bplace_country,hpi&hpi=gte.${minHpi}&order=hpi.desc&limit=200`,
    {},
    []
  );

  if (people.length < 10) return null;

  const shuffled = seededShuffle(people, rng);
  const subject = shuffled[0];

  // Find distractors: same occupation preferred
  const sameOcc = shuffled.filter(
    (p) => p.id !== subject.id && p.occupation === subject.occupation
  );
  const others = shuffled.filter(
    (p) => p.id !== subject.id && p.occupation !== subject.occupation
  );

  const distractorPool = [...sameOcc, ...others];
  const distractors = distractorPool.slice(0, 3);

  if (distractors.length < 3) return null;

  // Get description from person table
  const personDetail = await safeFetchJson(
    `${BASE_API}/person?id=eq.${subject.id}&select=description`,
    {},
    []
  );
  const description = personDetail?.[0]?.description || "A notable historical figure.";

  const options = seededShuffle([subject, ...distractors], rng);
  const correctIndex = options.findIndex((o) => o.id === subject.id);

  return {
    type: "who_am_i",
    questionText: "Who is this famous person?",
    personId: subject.id,
    gender: subject.gender,
    occupation: subject.occupation,
    options: options.map((o) => o.name),
    correctIndex,
    explanation: `${subject.name} — ${description}`,
    personName: subject.name,
    personSlug: subject.slug,
    difficulty,
  };
}
