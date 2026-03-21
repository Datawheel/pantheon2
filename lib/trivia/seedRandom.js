/**
 * Seeded PRNG using mulberry32 algorithm.
 * Produces deterministic sequences from a 32-bit seed.
 */
export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create a date-based seed for daily challenges.
 * Same date always produces the same seed.
 */
export function dateSeed(dateStr) {
  // dateStr format: "YYYY-MM-DD"
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash >>> 0;
}

/**
 * Fisher-Yates shuffle using a seeded PRNG function.
 */
export function seededShuffle(arr, rng) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Pick n random items from array using seeded PRNG.
 */
export function seededPick(arr, n, rng) {
  const shuffled = seededShuffle(arr, rng);
  return shuffled.slice(0, n);
}

/**
 * Get today's date string in YYYY-MM-DD format (UTC).
 */
export function todayDateStr() {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Calculate game number (days since launch).
 */
export function gameNumber(dateStr) {
  const launch = new Date("2022-10-06T00:00:00Z");
  const current = new Date(dateStr + "T00:00:00Z");
  return Math.ceil((current - launch) / (1000 * 60 * 60 * 24));
}
