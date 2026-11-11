// Universal time periods
export const REVALIDATE_PERIODS = {
  DEFAULT: 1 * 24 * 60 * 60, // 1 day in seconds
  SHORT: 60 * 60, // 1 hour in seconds
  LONG: 30 * 24 * 60 * 60, // 30 days in seconds
  // Add more as needed
};

// Edition year of the HPI in person_ranks (hpi); hpi_prev/l_prev are the
// edition before it. Update when person_ranks is rebuilt for a new year.
export const HPI_YEAR = 2025;

// Server-side API (uses localhost to bypass nginx rate limits)
export const BASE_API = process.env.BASE_API || "http://localhost:3100";

// Client-side API (must go through public URL)
export const PUBLIC_API = process.env.NEXT_PUBLIC_BASE_API || "https://api.pantheon.world";
