import {mulberry32, dateSeed, todayDateStr, seededShuffle} from "../seedRandom";
import generateWhoAmI from "./whoAmI";
import generateFamousForWhat from "./famousForWhat";
import generateBornWhere from "./bornWhere";
import generateCenturyChallenge from "./centuryChallenge";
import generateWhoWroteIt from "./whoWroteIt";
import generateSilverScreen from "./silverScreen";
import generateWhoCameFirst from "./whoCameFirst";
import generateMoreFamous from "./moreFamous";
import generateCountrymates from "./countrymates";
import generateDeadOrAlive from "./deadOrAlive";

const ALL_GENERATORS = [
  generateWhoAmI,
  generateFamousForWhat,
  generateBornWhere,
  generateCenturyChallenge,
  generateWhoWroteIt,
  generateSilverScreen,
  generateWhoCameFirst,
  generateMoreFamous,
  generateCountrymates,
  generateDeadOrAlive,
];

/**
 * Generate trivia questions.
 *
 * @param {Object} opts
 * @param {"daily"|"practice"} opts.mode - Game mode
 * @param {number} opts.count - Number of questions (default 10)
 * @param {"easy"|"medium"|"hard"|"mixed"} opts.difficulty - Difficulty level
 * @param {string} [opts.seed] - Optional seed override (daily mode uses date)
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateQuestions({
  mode = "daily",
  count = 10,
  difficulty = "mixed",
  seed = null,
} = {}) {
  // Determine seed
  const dateStr = todayDateStr();
  let seedValue;

  if (mode === "daily") {
    seedValue = dateSeed(seed || dateStr);
  } else {
    // Practice mode: random seed each time
    seedValue = seed ? dateSeed(seed) : (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
  }

  const rng = mulberry32(seedValue);

  // Decide difficulty per question
  const difficulties = [];
  const diffOptions = ["easy", "medium", "hard"];
  for (let i = 0; i < count; i++) {
    if (difficulty === "mixed") {
      // Weighted distribution: 30% easy, 40% medium, 30% hard
      const r = rng();
      if (r < 0.3) difficulties.push("easy");
      else if (r < 0.7) difficulties.push("medium");
      else difficulties.push("hard");
    } else {
      difficulties.push(difficulty);
    }
  }

  // Pick which generator types to use — ensure variety
  const generatorOrder = seededShuffle([...ALL_GENERATORS], rng);
  const questions = [];

  // Try each generator type in shuffled order, cycling as needed
  let attempts = 0;
  const maxAttempts = count * 3;
  let genIdx = 0;

  while (questions.length < count && attempts < maxAttempts) {
    const generator = generatorOrder[genIdx % generatorOrder.length];
    const diff = difficulties[questions.length] || "medium";

    try {
      const question = await generator(rng, diff);
      if (question) {
        questions.push({
          ...question,
          id: questions.length + 1,
        });
      }
    } catch (err) {
      console.error(`[trivia] Generator failed:`, err.message);
    }

    genIdx++;
    attempts++;
  }

  return questions;
}
