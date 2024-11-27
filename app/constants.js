// Universal time periods
export const REVALIDATE_PERIODS = {
  DEFAULT: 7 * 24 * 60 * 60, // 7 days in seconds
  SHORT: 60 * 60, // 1 hour in seconds
  LONG: 30 * 24 * 60 * 60, // 30 days in seconds
  // Add more as needed
};

// Add other constants as needed
export const BASE_API = process.env.BASE_API || "https://api.pantheon.world";
