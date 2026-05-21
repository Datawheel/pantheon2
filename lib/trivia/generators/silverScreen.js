import {safeFetchJson} from "@/app/utils/safeFetch";
import {BASE_API} from "@/app/constants";
import {seededShuffle} from "../seedRandom";

/**
 * "Silver Screen" - Show a movie, guess who's associated with it.
 * Distractors: other actors/directors.
 */
export default async function generateSilverScreen(rng, difficulty = "medium") {
  const movies = await safeFetchJson(
    `${BASE_API}/movie?select=pid,title,slug,poster,role&title=not.is.null&poster=not.is.null&limit=200&order=rating_count.desc`,
    {},
    []
  );

  if (movies.length < 4) return null;

  const shuffled = seededShuffle(movies, rng);

  let subject = null;
  let subjectPerson = null;

  for (const movie of shuffled) {
    const person = await safeFetchJson(
      `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation&id=eq.${movie.pid}`,
      {},
      []
    );
    if (person.length > 0) {
      subject = movie;
      subjectPerson = person[0];
      break;
    }
  }

  if (!subject || !subjectPerson) return null;

  // Get other people who appear in movies as distractors
  const otherPids = shuffled
    .filter((m) => m.pid !== subject.pid)
    .map((m) => m.pid)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 20);

  if (otherPids.length < 3) return null;

  const otherPeople = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug,gender,occupation&id=in.(${otherPids.join(",")})`,
    {},
    []
  );

  if (otherPeople.length < 3) return null;

  const distractors = seededShuffle(otherPeople, rng).slice(0, 3);
  const allOptions = seededShuffle([subjectPerson, ...distractors], rng);
  const correctIndex = allOptions.findIndex((o) => o.id === subjectPerson.id);

  const roleText = subject.role ? ` (${subject.role})` : "";

  return {
    type: "silver_screen",
    questionText: `Who is associated with the movie "${subject.title}"${roleText}?`,
    imageUrl: subject.poster ? `https://image.tmdb.org/t/p/w300${subject.poster}` : null,
    personId: subjectPerson.id,
    options: allOptions.map((o) => o.name),
    correctIndex,
    explanation: `${subjectPerson.name} appeared in "${subject.title}".`,
    personName: subjectPerson.name,
    personSlug: subjectPerson.slug,
    gender: subjectPerson.gender,
    occupation: subjectPerson.occupation,
    difficulty,
  };
}
