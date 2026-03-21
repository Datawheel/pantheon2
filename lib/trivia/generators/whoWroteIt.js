import {safeFetchJson} from "/app/utils/safeFetch";
import {BASE_API} from "/app/constants";
import {seededShuffle} from "../seedRandom";

/**
 * "Who Wrote It?" - Show a book title, guess the author.
 * Distractors: other writers.
 */
export default async function generateWhoWroteIt(rng, difficulty = "medium") {
  // Fetch books with their associated person
  const books = await safeFetchJson(
    `${BASE_API}/book?select=pid,title,slug,cover&title=not.is.null&limit=200&order=editions.desc`,
    {},
    []
  );

  if (books.length < 4) return null;

  const shuffled = seededShuffle(books, rng);

  // Find a book with a valid person
  let subject = null;
  let subjectPerson = null;

  for (const book of shuffled) {
    const person = await safeFetchJson(
      `${BASE_API}/person_ranks?select=id,name,slug&id=eq.${book.pid}`,
      {},
      []
    );
    if (person.length > 0) {
      subject = book;
      subjectPerson = person[0];
      break;
    }
  }

  if (!subject || !subjectPerson) return null;

  // Get other writers as distractors
  const writers = await safeFetchJson(
    `${BASE_API}/person_ranks?select=id,name,slug&occupation=eq.WRITER&id=neq.${subjectPerson.id}&order=hpi.desc&limit=50`,
    {},
    []
  );

  if (writers.length < 3) return null;

  const distractors = seededShuffle(writers, rng).slice(0, 3);
  const allOptions = seededShuffle(
    [subjectPerson, ...distractors],
    rng
  );
  const correctIndex = allOptions.findIndex((o) => o.id === subjectPerson.id);

  return {
    type: "who_wrote_it",
    questionText: `Who wrote "${subject.title}"?`,
    imageUrl: subject.cover || null,
    personId: subjectPerson.id,
    options: allOptions.map((o) => o.name),
    correctIndex,
    explanation: `"${subject.title}" was written by ${subjectPerson.name}.`,
    personName: subjectPerson.name,
    personSlug: subjectPerson.slug,
    difficulty,
  };
}
